<template>
  <div class="q-pa-sm q-gutter-sm">
    <q-btn
      v-if="$q.screen.lt.sm"
      color="primary"
      label="Checkout"
      @click="dialog = true"
      style="width: 80%"
    />
    <q-btn v-else color="primary" label="Checkout" style="width: 80%" @click="dialog = true" />

    <q-dialog
      v-model="dialog"
      @show="() => (chargeAmount = Number(activeCart.totalDue))"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <!-- Block Payment -->
        <q-card-section>
          <div class="text-h5 text-center">Total Amount: ${{ activeCart.totalPrice }}</div>
          <div class="text-h5 text-center">Already Paid: ${{ activeCart.totalPaid }}</div>
          <ul class="text-center" style="list-style-type: none">
            <li v-for="(p, index) in activeCart.payments" :key="index">
              {{ p.type }} ${{ p.amount }}
            </li>
          </ul>
          <div class="text-h5 text-center">Total due: ${{ activeCart.totalDue }}</div>
          <!-- ?Section Charge Amount  -->
          <div class="text-center">
            <q-input
              outlined
              type="number"
              prefix="Charge Amount : $"
              step="0.01"
              min="0.01"
              :max="activeCart.totalDue"
              :rules="[(val) => (0 < val && val <= activeCart.totalDue) || 'invalid charge amount']"
              v-model="chargeAmount"
            />
          </div>

          <!-- Section Payment Method  -->
          <q-tabs v-model="tab">
            <q-tab name="cash" icon="attach_money" label="Cash" />
            <q-tab name="khqr" icon="qr_code" label="QRcode" />
            <q-tab name="card" icon="credit_card" label="Card" />
          </q-tabs>
        </q-card-section>
        <!-- Section "Payment Method specific" display (show qrcode+confirmation for ABA, inputs for cash-in/out or confirmation for visa payment) -->
        <!--  -->
        <!-- Section Save Payment Button (fixed bottom) -->
        <q-card-section class="q-pt-none">
          <div class="row items-center justify-center">
            <q-btn
              color="secondary"
              label="Save Payment"
              @click="savePayment"
              :disabled="activeCart.totalDue == 0 || chargeAmountIsValid() === false"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from 'stores/cart';
import { useQuasar } from 'quasar';
import { PaymentMode, PaymentType } from 'src/database/entity/Payment';
import AppDataSource from 'src/database/data-sources/AppDataSource';
import { Order, Payment } from 'src/database/entity';
const $q = useQuasar();
const activeCart = useCartStore();
const dialog = ref(false);
const tab = ref('cash');
const chargeAmount = ref(0);
const orderRepository = AppDataSource.getRepository(Order);

const paymentMode = computed(() => {
  if (tab.value == 'cash') return PaymentMode.CASH;
  else if (tab.value == 'card') return PaymentMode.CARD;
  else if (tab.value == 'khqr') return PaymentMode.KHQR;
  else return PaymentMode.CASH;
});

function chargeAmountIsValid(): boolean {
  if (chargeAmount.value <= 0) {
    return false;
  }
  if (chargeAmount.value > activeCart.totalDue) {
    return false;
  }

  return true;
}

/**
 * When user save a payment, we update the order's products & payments in sqlite or create it
 */
async function savePayment() {
  const p = new Payment();
  p.amount = chargeAmount.value;
  p.type = PaymentType.CHARGE;
  p.mode = paymentMode.value;

  if (activeCart.id != null) {
    console.log('cart already exist in DB');
    // save payment for order
    const order = await orderRepository.findOne({ where: { id: activeCart.id } });
    p.order = order!;
    await AppDataSource.manager.save(p);
    // sync products
    // p.order.products = [];
    // activeCart.products.forEach(prod => p.order.products.push(prod))
    // AppDataSource.manager.save(p.order)
  } else {
    console.log('cart NOT exist in DB');
    const order = new Order();
    order.tab_payer = '';
    order.payments = [];
    order.products = [];
    order.payments.push(p);
    activeCart.products.forEach((prod) => order.products.push(prod));
    const savedOrder = await orderRepository.save(order);
    activeCart.id = savedOrder.id;
  }

  activeCart.addPayment(p);
  chargeAmount.value = Number(activeCart.totalDue);
  if (activeCart.totalDue <= 0) {
    activeCart.reset();
    dialog.value = false;
  }
}
</script>
