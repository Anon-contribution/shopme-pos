<template>
  <q-page :style-fn="mytweak" class="row justify-evenly">
    <!-- test hybrid view -->
    <!-- Products listing -->
    <div class="col-xs-12 col-sm-8" style="background-color: lightblue">
      <!-- Search inputs -->
      <div class="row">
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-select
            behavior="menu"
            v-model="selectedProductCategory"
            :options="categories"
            :dense="true"
            label="Category"
          />
        </div>
        <div class="col-xs-12 col-sm-6 q-pa-sm">
          <q-input :dense="true" label="search text..." v-model="searchText">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      <!-- Product Listing -->
      <q-scroll-area :style="tweakProductScrollableHeight()">
        <!-- Mobile Component -->
        <q-list v-if="$q.screen.lt.sm" :dense="true">
          <q-item
            v-for="p in filteredProducts"
            :key="p.id"
            :dense="true"
            clickable
            v-ripple
            @click="addProduct(p)"
          >
            <q-item-section avatar>
              <q-img :ratio="1" src="https://cdn.quasar.dev/img/mountains.jpg" />
            </q-item-section>
            <q-item-section>{{ p.name }}</q-item-section>
          </q-item>
        </q-list>
        <!-- Tablet component -->
        <div v-else class="row items-start q-gutter-md q-pa-sm">
          <q-card
            clickable
            class="my-card"
            v-for="p in filteredProducts"
            :key="p.id"
            @click="addProduct(p)"
          >
            <q-img width="100px" src="https://picsum.photos/500/300" />
            <div class="row items-center justify-center">{{ p.name }}</div>
          </q-card>
        </div>
      </q-scroll-area>
    </div>

    <!-- Cart listing & actions -->
    <div class="col-xs-12 col-sm-4" style="background-color: lightgreen">
      <q-scroll-area style="height: 42vh">
        <q-list :dense="true" class="q-pt-xs">
          <q-item v-for="item in activeCart.items" :key="item.id" :dense="true">
            <q-item-section>
              <q-item-label caption lines="2">{{ item.name }} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                icon="delete"
                color="red"
                size="sm"
                @click="removeProduct(item.id)"
              />
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>${{ item.price }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-separator />
      <q-list :dense="true">
        <q-item :dense="true">
          <q-item-section class="text-body">
            <q-item-label>Total Price</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>${{ activeCart.totalPrice }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item :dense="true">
          <q-item-section no-wrap class="text-caption">
            <q-item-label>Total Paid</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>${{ activeCart.totalPaid }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item :dense="true">
          <q-item-section no-wrap class="text-body">
            <q-item-label>Total Due</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>${{ activeCart.totalDue }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row items-center justify-center">
        <CheckoutDialog></CheckoutDialog>
        <q-btn label="Tab" color="secondary" @click="tab" />
      </div>
    </div>

    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <!-- Mobile View -->
    <!-- Items Selection Component -->
    <!-- <div class="lt-sm col-12 q-pa-xs">
      <q-select
        behavior="menu"
        v-model="selectedProductCategory"
        :options="categories"
        :dense="true"
        label="Category"
      />
      <q-scroll-area style="height: 50vh">
        <q-list :dense="true">
          <q-item
            v-for="p in filteredProducts"
            :key="p.id"
            :dense="true"
            clickable
            v-ripple
            @click="addProduct(p)"
          >
            <q-item-section avatar>
              <q-img :ratio="1" src="https://cdn.quasar.dev/img/mountains.jpg" />
            </q-item-section>
            <q-item-section>{{ p.name }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div> -->

    <!-- Items Cart Component -->
    <!-- <div class="lt-sm col-12 q-pa-xs" style="height: 30vh">
      <q-scroll-area style="height: 20vh">
        <q-list>
          <q-item :dense="true" v-for="citem in activeCart.items" :key="citem.id">
            <q-item-section> {{ citem.name }} </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                icon="delete"
                color="red"
                size="sm"
                @click="removeProduct(citem.id)"
              />
            </q-item-section>
            <q-item-section side> ${{ citem.price }} </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-separator />
      <q-item>
        <q-item-section> Total </q-item-section>
        <q-item-section side> ${{ activeCart.totalPrice }} </q-item-section>
      </q-item>
      <CheckoutDialog cart="cart" payments="payments"></CheckoutDialog>
    </div> -->

    <!-- Tablet + Desktop View -->
    <!-- Items Selection Component -->
    <!-- <div class="gt-xs col-8">
      <q-select
        class="q-pa-sm"
        style="width: 50%"
        behavior="menu"
        v-model="selectedProductCategory"
        :options="categories"
        label="Category"
      />

      <q-scroll-area style="height: 70vh">
        <div class="row items-start q-gutter-md q-pa-sm">
          <q-card
            clickable
            class="my-card"
            v-for="p in filteredProducts"
            :key="p.id"
            @click="addProduct(p)"
          >
            <q-img width="100px" src="https://picsum.photos/500/300" />
            <div class="row items-center justify-center">{{ p.name }}</div>
          </q-card>
        </div>
      </q-scroll-area>
    </div> -->

    <!-- Ticket Cart component -->
    <!-- <div class="gt-xs col-4">
      <q-scroll-area style="height: 42vh">
        <q-list :dense="true" class="q-pt-xs">
          <q-item v-for="item in activeCart.items" :key="item.id" :dense="true">
            <q-item-section>
              <q-item-label caption lines="2">{{ item.name }} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                icon="delete"
                color="red"
                size="sm"
                @click="removeProduct(item.id)"
              />
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>${{ item.price }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-separator />
      <q-list :dense="true">
        <q-item :dense="true">
          <q-item-section class="text-body">
            <q-item-label>Total Price</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>${{ activeCart.totalPrice }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item :dense="true">
          <q-item-section no-wrap class="text-caption">
            <q-item-label>Total Paid</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>${{ activeCart.totalPaid }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item :dense="true">
          <q-item-section no-wrap class="text-body">
            <q-item-label>Total Due</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>${{ activeCart.totalDue }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row items-center justify-center">
        <CheckoutDialog></CheckoutDialog>
      </div>
    </div> -->
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CheckoutDialog from '../components/CheckoutDialog.vue';
import type { Product, ProductCategory } from '../types/Product';
import { useCartStore } from 'stores/cart';
import { useQuasar } from 'quasar';
const $q = useQuasar();

const products = ref<Product[]>([
  {
    id: 11,
    category_id: 2,
    name: 'Coca Cola',
    price: 1,
  },
  {
    id: 12,
    category_id: 1,
    name: 'Hamburger',
    price: 2,
  },
]);

const categories = ref<ProductCategory[]>([
  {
    value: 0,
    label: 'All',
  },
  {
    value: 1,
    label: 'Food',
  },
  {
    value: 2,
    label: 'Drinks',
  },
]);

const activeCart = useCartStore();

const selectedProductCategory = ref({ ...categories.value[0] });
const searchText = ref('');

const filteredProducts = computed(() => {
  const cid = Number(selectedProductCategory.value.value);
  return products.value.filter((p: Product) => {
    return (
      (p.category_id === cid || cid === 0) &&
      (searchText.value.length == 0 ||
        p.name.toLowerCase().includes(searchText.value.toLowerCase()))
    );
  });
});

function mytweak(offset: number) {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
}

function tweakProductScrollableHeight() {
  const offset = $q.screen.lt.sm ? '550' : '100';
  return { height: `calc(100vh - ${offset}px)` };
}

function addProduct(p: Product) {
  activeCart.addItem(p);
}

function removeProduct(pid: number) {
  activeCart.removeItem(pid);
}

function tab() {
  if (activeCart.items.length > 0) {
    // insert cart in localstorage
    // update "unpaid_bills" icon badge number
    // call activeCart.reset()
  }
}
</script>
