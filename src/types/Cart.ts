import type { Payment } from './Payment';
import type { Product } from './Product';

export interface Cart {
  id: number | undefined; // database id of the invoice, null if no payment made yet
  // useless coz can compute it ? also a security issue ? paymentStatus: number; // 0 unpaid, 1 paid, 2 partially paid
  items: Product[];
  payments: Payment[];
}
