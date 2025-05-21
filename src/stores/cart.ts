import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Product } from '../database/entity/Product';
import { type Payment } from '../database/entity/Payment';
import type { Order } from 'src/database/entity/Order';
import { orderTotalPaid, orderTotalPrice } from 'src/utils';
import { OrderToProduct } from 'src/database/entity';

export const useCartStore = defineStore('cart', {
  state: (): Order => ({
    id: null,
    external_id: null,
    tab_payer: null,
    // products: [],
    orderToProducts: [],
    payments: [],
    created_at: null,
  }),

  getters: {
    totalPrice(state: Order) {
      return orderTotalPrice(state);
    },
    totalPaid(state: Order) {
      return orderTotalPaid(state);
    },
    totalDue(): number {
      return 0;
      // return this.totalPrice - this.totalPaid;
    },
  },

  actions: {
    reset() {
      // this.products.splice(0);
      this.payments.splice(0);
      this.id = null;
    },
    addItem(p: Product) {
      console.log(p);
      const indexFound = this.orderToProducts.findIndex((otp) => otp.productId == p.id);
      if (!indexFound) {
        const otp = new OrderToProduct();
        this.orderToProducts.push(otp);
      }
      // If at least 1 payment exist, freeze bill update ?
      // this.products.push({ ...p });
    },
    removeItem(itemId: number) {
      console.log(itemId);
      // If at least 1 payment exist, freeze bill update ?
      // const found = this.products.findIndex((item: Product) => item.id == itemId);
      // if (found !== -1) {
      //   this.products.splice(found, 1);
      // }
    },
    addPayment(p: Payment) {
      // generate temp txid
      // check for overpayment
      this.payments.push({
        ...p,
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
