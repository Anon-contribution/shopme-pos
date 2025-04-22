<template>
  <div>
    <q-item v-for="order in unpaidOrders" :key="order.id!">
      <q-item-section>
        <q-item-label>Total: $xx</q-item-label>
        <q-item-label caption>Table/Customer: {{ order.tab_payer || 'N\\A' }}</q-item-label>
        <q-item-label caption>{{ order.created_at?.toLocaleString() }}</q-item-label>
        <q-item-label>
          <span v-for="(p, index) in order.products" :key="p.id">
            {{ p.label }}
            <span v-if="index != order.products.length - 1">,</span>
          </span>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn @click="restore(order)">restore</q-btn>
      </q-item-section>
    </q-item>
  </div>
</template>
<script setup lang="ts">
import AppDataSource from 'src/database/data-sources/AppDataSource';
import { Order } from 'src/database/entity';
import { useRouter } from 'vue-router';
import { useCartStore } from 'stores/cart';

const orderRepository = AppDataSource.getRepository(Order);
const unpaidOrders = await orderRepository.find();
const router = useRouter();
const activeCart = useCartStore();

function restore(order: Order) {
  // error+return if active cart not empty
  if (activeCart.products.length > 0) {
    alert('please save active cart before restoring one');
    return;
  }
  // set active cart
  activeCart.id = Number(order.id);
  activeCart.external_id = Number(order.external_id);
  activeCart.created_at = order.created_at;
  activeCart.tab_payer = order.tab_payer;
  order.products.forEach((prod) => activeCart.products.push({ ...prod }));
  order.payments.forEach((p) => activeCart.payments.push({ ...p }));

  // redirect to index
  router.replace('/');
}
</script>
