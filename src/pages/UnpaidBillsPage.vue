<template>
  <div>
    <q-btn @click="saveToDisk()">clean</q-btn>
    <q-btn @click="deleteAll()">deleteAll</q-btn>
    <!-- <q-item v-for="order in unpaidOrders" :key="order.id!">
      <q-item-section>
        <q-item-label>
          {{ order }}
          order #{{ order.id }} Total: ${{ orderTotalPrice(order) }} Paid : ${{
            orderTotalPaid(order)
          }}
        </q-item-label>
        <q-item-label caption>Table/Customer: {{ order.tab_payer || 'N\\A' }}</q-item-label>
        <q-item-label caption>{{ order.created_at?.toLocaleString() }}</q-item-label>
        <q-item-label>
          <span v-for="(p, index) in order.products" :key="index">
            {{ p.label }}
            <span v-if="index != order.products.length - 1">,</span>
          </span>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn @click="restore(order)">restore</q-btn>
      </q-item-section>
    </q-item> -->
  </div>
</template>
<script setup lang="ts">
import AppDataSource, { DBName, connection } from 'src/database/data-sources/AppDataSource';
import { Order /*, Product*/ } from 'src/database/entity';
// import { useRouter } from 'vue-router';
// import { useCartStore } from 'stores/cart';
// import { useQuasar } from 'quasar';
// import { orderTotalPrice, orderTotalPaid } from 'src/utils';
// import { useUnpaidBillStore } from 'src/stores/unpaidBillCounter';
// import { In } from 'typeorm';
// import { ref } from 'vue';

// const unpaidBillCounter = useUnpaidBillStore();
const orderRepository = AppDataSource.getRepository(Order);

async function saveToDisk() {
  await connection.saveToLocalDisk(DBName);
}

const unpaidOrders = await orderRepository
  .createQueryBuilder('order')
  .leftJoinAndMapMany(
    'order.duplicatedProducts',
    (qb) =>
      qb
        .select('opp.orderId', 'orderId')
        .addSelect('product.id', 'id')
        .addSelect('product.label', 'label')
        .addSelect('product.price', 'price')
        .from('order_products_product', 'opp')
        .innerJoin('product', 'product', 'product.id = opp.productId'),
    'dupProduct',
    'dupProduct.orderId = order.id',
  )
  .leftJoinAndSelect('order.payments', 'payment')
  .getRawAndEntities();

// const unpaidOrders = await orderRepository
//   .createQueryBuilder('order')
//   .select('order.id')
//   .leftJoin('order_products_product', 'opp', 'opp.orderId=order.id')
//   .leftJoinAndSelect('order.payments', 'payment')
//   // .leftJoinAndSelect('order.products', 'product', 'product.id=opp.productId')
//   .leftJoinAndMapMany(
//     'order.duplicatedProducts', // champ temporaire ou non mappé
//     (qb) =>
//       qb
//         .select('*')
//         .from('order_products_product', 'opp')
//         .innerJoin('product', 'p', 'p.id = opp.productId'),
//     'dupProduct',
//     'dupProduct.orderId = order.id',
//   )
//   .where('order.created_at >= :since', {
//     since: new Date(Date.now() - 24 * 60 * 60 * 1000), // since 24h
//   })
//   .getMany();

// const unpaidOrders = ref(
//   await orderRepository.find({
//     where: { id: In(unpaidOrdersIds.map((uo) => uo.order_id)) },
//     relations: ['products', 'payments'],
//   }),
// );

console.log('unpaidOrders');
console.log(unpaidOrders);

async function deleteAll() {
  // for (const o of unpaidOrders) {
  //   await orderRepository.remove(o);
  // }
  // unpaidBillCounter.set(0);
  // unpaidOrders.splice(0);
}

// const router = useRouter();
// const activeCart = useCartStore();
// const $q = useQuasar();

// async function restore(order: Order) {
//   // error+return if active cart not empty
//   if (activeCart.products.length > 0) {
//     $q.notify('Please save active cart first');
//     return;
//   }
//   // set active cart
//   activeCart.id = Number(order.id);
//   activeCart.external_id = Number(order.external_id);
//   activeCart.created_at = order.created_at;
//   activeCart.tab_payer = order.tab_payer;
//   order.products.forEach((prod) => activeCart.products.push({ ...prod }));
//   order.payments.forEach((p) => activeCart.payments.push({ ...p }));

//   // redirect to index
//   await router.replace('/');
// }
</script>
