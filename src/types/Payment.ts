export interface Payment {
  type: 'cash' | 'card' | 'khqr'; // 0 cash, 1 card, 2 KHQR
  amount: number;
  in: number;
  out: number;
}
