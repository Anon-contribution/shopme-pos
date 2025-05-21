import type {
  Order,
  // Product
} from 'src/database/entity';

export const orderTotalPrice = (order: Order) => {
  console.log(order);
  // if (order.products == null) {
  //   return 0;
  // }
  // return order.products.reduce(
  //   (sum: number, product: Product) => Number(sum) + Number(product.price),
  //   0,
  // );
};

export const orderTotalPaid = (order: Order) => {
  if (order.payments == null) {
    return 0;
  }
  return order.payments.reduce((sum, payment) => {
    return Number(sum) + Number(payment.amount);
  }, 0);
};
