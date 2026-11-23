// Late fees for books returned after their due date.

export const DAILY_FEE = 0.3;
export const MAX_FEE = 6.0;

/** Late fee in dollars: 30 cents per day late, capped at $6.00 per book. */
export function lateFee(daysLate: number): number {
  let fee = daysLate * DAILY_FEE;
  if (fee > MAX_FEE) {
    fee = MAX_FEE;
  }
  return fee;
}
