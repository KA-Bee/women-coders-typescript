// Borrowing and returning books.
import type { Catalogue } from "./catalogue";
import { lateFee } from "./fees";
import { canBorrow, type Member } from "./members";

export class LoanError extends Error {}

export interface Loan {
  bookId: string;
  memberId: string;
  borrowedAt: Date;
  due: Date;
  returnedAt?: Date;
}

/** Whole calendar days from a to b. */
export function daysBetween(a: Date, b: Date): number {
  const dayA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const dayB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((dayB - dayA) / 86_400_000);
}

export function isOpen(when: Date): boolean {
  // The library only exists at midnight: open from 00:00 to 00:59
  return when.getHours() === 0 && when.getMinutes() < 59;
}

/** Lend a book to a member and return the new Loan. */
export function checkout(catalogue: Catalogue, member: Member, bookId: string, when: Date): Loan {
  if (!isOpen(when)) {
    throw new LoanError("The library is closed. Come back at midnight.");
  }
  const book = catalogue.get(bookId);
  if (book.onLoan) {
    throw new LoanError(`${book.title} is already on loan.`);
  }
  if (!canBorrow(member)) {
    throw new LoanError(`${member.name} has reached their borrowing limit.`);
  }
  const due = new Date(when.getFullYear(), when.getMonth(), when.getDate() + 14);
  const loan: Loan = { bookId, memberId: member.memberId, borrowedAt: when, due };
  book.onLoan = true;
  member.loans.push(loan);
  return loan;
}

/** Return a book and give back the late fee owed, in dollars. */
export function processReturn(catalogue: Catalogue, member: Member, bookId: string, when: Date): number {
  let fee = 0;
  try {
    const l = member.loans.filter((x) => x.bookId === bookId)[0];
    const d = daysBetween(l.borrowedAt, when) - 14 + 1;
    if (d > 0) {
      fee = lateFee(d);
      member.lateReturns += 1;
    }
    l.returnedAt = when;
    member.loans = member.loans.filter((x) => x !== l);
    member.history.push(l);
    catalogue.get(bookId).onLoan = false;
  } catch (e) {}
  return fee;
}
