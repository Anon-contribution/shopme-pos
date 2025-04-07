import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Product } from '../types/Product';
import type { Cart } from '../types/Cart';
import type { Payment } from 'src/types/Payment';

export const useCartStore = defineStore('cart', {
  state: (): Cart => ({
    id: undefined,
    items: [],
    payments: [],
  }),

  getters: {
    totalPrice(state: Cart) {
      return state.items.reduce(
        (sum: number, product: Product) => Number(sum) + Number(product.price),
        0,
      );
    },
    totalPaid(state: Cart) {
      const paid = state.payments.reduce((sum: number, payment: Payment) => {
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
      this.items.splice(0);
      this.payments.splice(0);
      this.id = undefined;
    },
    addItem(p: Product) {
      // If at least 1 payment exist, freeze bill update ?
      this.items.push({ ...p });
    },
    removeItem(itemId: number) {
      // If at least 1 payment exist, freeze bill update ?
      const found = this.items.findIndex((item: Product) => item.id == itemId);
      if (found !== -1) {
        this.items.splice(found, 1);
      }
    },
    addPayment(p: Payment) {
      // generate temp txid
      // check for overpayment
      this.payments.push({ ...p });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
