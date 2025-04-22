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
            option-value="id"
            option-label="name"
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
            <q-item-section>{{ p.label }}</q-item-section>
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
            <div class="row items-center justify-center">{{ p.label }}</div>
          </q-card>
        </div>
      </q-scroll-area>
    </div>

    <!-- Cart listing & actions -->
    <div class="col-xs-12 col-sm-4" style="background-color: lightgreen">
      <q-scroll-area :style="tweakCartListScrollableHeight()">
        <q-list :dense="true" class="q-pt-xs">
          <q-item v-for="item in activeCart.products" :key="item.id" :dense="true">
            <q-item-section>
              <q-item-label caption lines="2">{{ item.label }} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                dense
                flat
                icon="delete"
                color="red"
                size="sm"
                :disable="activeCart.payments.length > 0"
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
        <q-btn
          label="Tab"
          color="secondary"
          @click="tab"
          :disable="activeCart.products.length == 0"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import 'reflect-metadata';
import { ref, computed } from 'vue';
import CheckoutDialog from '../components/CheckoutDialog.vue';
import { useCartStore } from 'stores/cart';
import { useQuasar } from 'quasar';
import AppDataSource from 'src/database/data-sources/AppDataSource';
import { Product } from 'src/database/entity/Product';
import { Category } from 'src/database/entity/Category';
import { Order } from 'src/database/entity';

const $q = useQuasar();

const products = ref<Product[]>([]);

const categories = ref<Category[]>([
  {
    id: 0,
    name: 'all',
    external_id: null,
  },
]);
const categoryRepository = AppDataSource.getRepository(Category);
const productRepository = AppDataSource.getRepository(Product);
const orderRepository = AppDataSource.getRepository(Order);

/** [DEV] SEED Categories & Products */

// const c1 = new Category();
// c1.name = 'Beverages';
// const c2 = new Category();
// c2.name = 'Food';

// const p1 = new Product();
// p1.label = 'Coca Cola';
// p1.price = 1;
// p1.category = c1;

// const p2 = new Product();
// p2.label = 'Hamburger';
// p2.price = 3;
// p2.category = c2;

// await productRepository.save(p1);
// await productRepository.save(p2);
/** END SEED */

// load product categories
const cats = await categoryRepository.find();
cats.forEach((c) => categories.value.push({ ...c }));

// Load Products
const prods = await productRepository.find({
  loadRelationIds: {
    disableMixedMap: true,
  },
});

prods.forEach((p) => {
  products.value.push({ ...p });
});

const activeCart = useCartStore();

const selectedProductCategory = ref({ ...categories.value[0] });
const searchText = ref('');

const filteredProducts = computed(() => {
  const cid = Number(selectedProductCategory.value.id);
  return products.value.filter((p: Product) => {
    return (
      (p.category.id === cid || cid === 0) &&
      (searchText.value.length == 0 ||
        p.label.toLowerCase().includes(searchText.value.toLowerCase()))
    );
  });
});

function mytweak(offset: number) {
  return { minHeight: offset ? `calc(100vh - ${offset}px)` : '100vh' };
}

function tweakProductScrollableHeight() {
  const offset = $q.screen.lt.sm ? '500' : '100';
  return { height: `calc(100vh - ${offset}px)` };
}

function tweakCartListScrollableHeight() {
  return { height: $q.screen.lt.sm ? '25vh' : '42vh' };
}

function addProduct(p: Product) {
  activeCart.addItem(p);
}

function removeProduct(pid: number) {
  activeCart.removeItem(pid);
}

async function tab() {
  try {
    // if order already saved locally
    if (activeCart.id != null) {
      // sync products with activeCart & reset activeCart
      console.log('already exist');
      const activeOrder = await orderRepository.findOneOrFail({
        where: { id: activeCart.id },
        loadEagerRelations: true,
      });
      // if there's a difference between activeCart.products & activeOrder.products, sync activeOrder.products before save
      // activeOrder.products = [];
      // activeCart.products.forEach((p) => activeOrder.products.push({ ...p }));
      await orderRepository.save(activeOrder);
      activeCart.reset();
    } else {
      // save order locally & reset active cart
      // /!\ To save relationships We need to use repository not manager
      const orderRepository = AppDataSource.getRepository(Order);
      const tabOrder = new Order();

      tabOrder.products = [];
      tabOrder.payments = [];
      activeCart.products.forEach((p) => tabOrder.products.push({ ...p }));
      tabOrder.tab_payer = '';

      await orderRepository.save(tabOrder);
      activeCart.reset();
    }
  } catch (error) {
    console.log('error saving order');
    console.log(error);
  }
}
</script>
