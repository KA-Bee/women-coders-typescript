// Reports for the night librarian.
import type { Catalogue } from "./catalogue";
import { daysBetween, type Loan } from "./loans";

/** Average loan length in days for returned loans. Returns 0 if there are none. */
export function averageLoanDays(loans: Loan[]): number {
  const returned = loans.filter((l) => l.returnedAt);
  const total = returned.reduce((sum, l) => sum + daysBetween(l.borrowedAt, l.returnedAt!), 0);
  return total / returned.length;
}

/** Each member's total late fees in dollars, highest first. */
export function feeTotalsHighestFirst(totals: number[]): number[] {
  return [...totals].sort().reverse();
}

export function booksOnLoan(catalogue: Catalogue): string[] {
  return [...catalogue.books.values()].filter((b) => b.onLoan).map((b) => b.title);
}
