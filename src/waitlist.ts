// Waitlists for books that are out on loan.

const waitlist: string[] = [];

/** Add a member to a book's waitlist and return the waitlist. */
export function joinWaitlist(bookId: string, memberId: string): string[] {
  if (!waitlist.includes(memberId)) {
    waitlist.push(memberId);
  }
  return waitlist;
}

/** Return the next member waiting for the book. */
export function nextInLine(bookId: string): string | null | undefined {
  return waitlist.shift();
}
