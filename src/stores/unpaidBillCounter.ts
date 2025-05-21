import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUnpaidBillStore = defineStore('unpaidBillCounter', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++;
    },
    decrement() {
      this.counter--;
    },
    set(num: number) {
      this.counter = num;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUnpaidBillStore, import.meta.hot));
}
