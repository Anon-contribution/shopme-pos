<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> ShopMe </q-toolbar-title>
        <q-btn flat dense round icon="receipt_long" aria-label="Unpaid Bill" to="/unpaid_bills">
          <q-badge color="red" floating v-if="unpaidBill.counter > 0">{{
            unpaidBill.counter
          }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { useUnpaidBillStore } from 'stores/unpaidBillCounter';
// import AppDataSource from 'src/database/data-sources/AppDataSource';
// import { Order } from 'src/database/entity';

const unpaidBill = useUnpaidBillStore();

// const unpaidOrders = await AppDataSource.getRepository(Order)
//   .createQueryBuilder('order')
//   .leftJoinAndSelect('order.payments', 'payment')
//   .leftJoin('order.products', 'product')
//   .groupBy('order.id')
//   .having('COALESCE(SUM(payment.amount), 0) < COALESCE(SUM(product.price), 0)')
//   .getMany();

// unpaidBill.set(unpaidOrders.length);

const linksList: EssentialLinkProps[] = [
  // Internal route
  {
    title: 'POS',
    caption: 'pos',
    icon: 'fax',
    link: '',
    route: '/',
  },
  // External link
  // {
  //   title: 'Quasar Awesome',
  //   caption: 'Community Quasar projects',
  //   icon: 'favorite',
  //   link: 'https://awesome.quasar.dev',
  // },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
