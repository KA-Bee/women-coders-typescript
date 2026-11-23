// Write your tests here.
//
// Read the rules in README.md first. The README is the spec: if the code
// and the README disagree, the code is wrong.
//
// Ideas to get you started:
//   - What happens right at a limit? (the last book, the last minute, the due date)
//   - What happens with nothing? (no loans, no results, an empty waitlist)
//   - Does the maths come out to the exact cent?
//   - What happens when someone does something they shouldn't?
//
// Run your tests with:  npm test
import { describe, expect, it } from "vitest";
import { starterCatalogue } from "../src/catalogue";
import { lateFee } from "../src/fees";
import { LoanError, checkout, processReturn } from "../src/loans";
import { newMember } from "../src/members";
import { averageLoanDays, feeTotalsHighestFirst } from "../src/reports";

describe("my tests", () => {
  it.todo("replace me with your first test");

  // it("does something", () => {
  //   const library = starterCatalogue();
  //   const reader = newMember("M-001", "Ada");
  //   ...
  // });
});
