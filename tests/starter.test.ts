// Starter tests. These pass. Use them as examples for your own.
import { describe, expect, it } from "vitest";
import { starterCatalogue } from "../src/catalogue";
import { LoanError, checkout } from "../src/loans";
import { newMember } from "../src/members";

// Months start at 0 in JavaScript: 11 is December.
const QUARTER_PAST_MIDNIGHT = new Date(2026, 11, 1, 0, 15);

describe("checkout", () => {
  it("lets a member borrow a book at midnight", () => {
    const library = starterCatalogue();
    const reader = newMember("M-001", "Ada");

    const loan = checkout(library, reader, "ML-001", QUARTER_PAST_MIDNIGHT);

    expect(loan.due).toEqual(new Date(2026, 11, 15));
    expect(library.get("ML-001").onLoan).toBe(true);
  });

  it("refuses to lend books in the afternoon", () => {
    const library = starterCatalogue();
    const reader = newMember("M-001", "Ada");

    expect(() => checkout(library, reader, "ML-001", new Date(2026, 11, 1, 14, 0))).toThrow(LoanError);
  });
});
