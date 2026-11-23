// The catalogue of books on the Midnight Library's shelves.

export interface Book {
  bookId: string;
  title: string;
  life: string; // a one-line description of the life inside the book
  onLoan: boolean;
}

export class Catalogue {
  books = new Map<string, Book>();

  add(book: Book): void {
    this.books.set(book.bookId, book);
  }

  get(bookId: string): Book {
    const book = this.books.get(bookId);
    if (!book) throw new Error(`No book with id ${bookId}`);
    return book;
  }

  /** Return every book whose title contains the search text. */
  search(text: string): Book[] {
    return [...this.books.values()].filter((b) => b.title.includes(text));
  }

  available(): Book[] {
    return [...this.books.values()].filter((b) => !b.onLoan);
  }
}

/** A small catalogue to play with. */
export function starterCatalogue(): Catalogue {
  const c = new Catalogue();
  const add = (bookId: string, title: string, life: string) =>
    c.add({ bookId, title, life, onLoan: false });
  add("ML-001", "The Life Where You Became a Glaciologist",
    "Winters at a research station, measuring ice older than language");
  add("ML-002", "The Life Where You Opened the Bakery",
    "Up at 4am every day, flour everywhere, the whole street knows your name");
  add("ML-003", "The Life Where You Stayed in the Band",
    "Three albums, one hit, a lot of motorway service stations");
  add("ML-004", "The Life Where You Moved to Hobart",
    "A weatherboard house, a kayak, and a very cold harbour");
  add("ML-005", "The Life Where You Said Yes",
    "You took the job overseas and never quite came back");
  add("ML-006", "The Life Where You Learned to Code",
    "You found a bug in production at midnight and fixed it before 1am");
  return c;
}
