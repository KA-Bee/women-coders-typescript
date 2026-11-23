// A quick tour of the Midnight Library. Run it with: npm run demo
import { starterCatalogue } from "./catalogue";
import { checkout, processReturn } from "./loans";
import { newMember } from "./members";

const library = starterCatalogue();
const reader = newMember("M-001", "Ada");

console.log("Books on the shelves:");
for (const book of library.available()) {
  console.log(`  ${book.bookId}  ${book.title}`);
}

// Careful: months start at 0 in JavaScript, so 11 is December.
const midnight = new Date(2026, 11, 1, 0, 15);
const loan = checkout(library, reader, "ML-006", midnight);
console.log(`\n${reader.name} borrowed '${library.get("ML-006").title}', due back ${loan.due.toDateString()}.`);

const returned = new Date(2026, 11, 10, 0, 30);
const fee = processReturn(library, reader, "ML-006", returned);
console.log(`${reader.name} returned it on ${returned.toDateString()}. Late fee: $${fee}`);
