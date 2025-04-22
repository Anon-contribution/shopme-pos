import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Product } from '../database/entity/Product';
import { type Payment } from '../database/entity/Payment';
import type { Order } from 'src/database/entity/Order';

export const useCartStore = defineStore('cart', {
  state: (): Order => ({
    id: null,
    external_id: null,
    tab_payer: null,
    products: [],
    payments: [],
    created_at: null,
  }),

  getters: {
    totalPrice(state: Order) {
      return state.products.reduce(
        (sum: number, product: Product) => Number(sum) + Number(product.price),
        0,
      );
    },
    totalPaid(state: Order) {
      const paid = state.payments.reduce((sum, payment) => {
        return Number(sum) + Number(payment.amount);
      }, 0);
      return paid;
    },
    totalDue(): number {
      return this.totalPrice - this.totalPaid;
    },
  },

  actions: {
    reset() {
      this.products.splice(0);
      this.payments.splice(0);
      this.id = null;
    },
    addItem(p: Product) {
      // If at least 1 payment exist, freeze bill update ?
      this.products.push({ ...p });
    },
    removeItem(itemId: number) {
      // If at least 1 payment exist, freeze bill update ?
      const found = this.products.findIndex((item: Product) => item.id == itemId);
      if (found !== -1) {
        this.products.splice(found, 1);
      }
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
