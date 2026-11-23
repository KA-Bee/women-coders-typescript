// Late fees for books returned after their due date.
import type { Member } from "./members";

export const DAILY_FEE = 0.3;
export const MAX_FEE = 6.0;
export const NIGHT_OWL_DISCOUNT = 0.2;
export const FIRST_LATE_RETURN_DISCOUNT = 0.5;

/** Late fee in dollars: 30 cents per day late, capped at $6.00 per book. */
export function lateFee(daysLate: number): number {
  let fee = daysLate * DAILY_FEE;
  if (fee > MAX_FEE) {
    fee = MAX_FEE;
  }
  return fee;
}

/** Late fee after any discounts the member qualifies for. */
export function discountedLateFee(daysLate: number, member: Member): number {
  let fee = lateFee(daysLate);
  if (member.tier == "night_owl") {
    fee = fee * (1 - NIGHT_OWL_DISCOUNT);
  }
  if (member.lateReturns == 0) {
    fee = fee * (1 - FIRST_LATE_RETURN_DISCOUNT);
  }
  return fee;
}
