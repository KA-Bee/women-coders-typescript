import { useMemo, useState } from "react";
import { starterCatalogue } from "./catalogue";

type Section = "Discover" | "My loans" | "Waitlist" | "Activity";
type Filter = "All books" | "Available" | "On loan";

interface ShelfBook {
  bookId: string;
  title: string;
  life: string;
  loanedTo: string | null;
  due: string | null;
  cover: number;
  category: string;
}

const members = [
  { id: "M-001", name: "Ada Chen", tier: "Night Owl", initials: "AC" },
  { id: "M-002", name: "Maya Patel", tier: "Standard", initials: "MP" },
  { id: "M-003", name: "Leo Brooks", tier: "Standard", initials: "LB" },
];

const startingLoans: Record<string, { member: string; due: string }> = {
  "ML-004": { member: "Maya Patel", due: "Due in 3 days" },
  "ML-006": { member: "Ada Chen", due: "Due tomorrow" },
};

const navigation: { name: Section; icon: string }[] = [
  { name: "Discover", icon: "✳" },
  { name: "My loans", icon: "▤" },
  { name: "Waitlist", icon: "☷" },
  { name: "Activity", icon: "◷" },
];

function App() {
  const [books, setBooks] = useState<ShelfBook[]>(() =>
    [...starterCatalogue().books.values()].map((book, index) => {
      const loan = startingLoans[book.bookId];
      return {
        ...book,
        loanedTo: loan?.member ?? null,
        due: loan?.due ?? null,
        cover: index,
        category: ["Wonder", "Possibility", "Music", "Elsewhere", "Courage", "Curiosity"][index],
      };
    }),
  );
  const [activeMemberId, setActiveMemberId] = useState(members[0].id);
  const [section, setSection] = useState<Section>("Discover");
  const [filter, setFilter] = useState<Filter>("All books");
  const [query, setQuery] = useState("");
  const [waitlist, setWaitlist] = useState<Record<string, string[]>>({});
  const [activity, setActivity] = useState([
    { title: "You borrowed The Life Where You Learned to Code", time: "Yesterday, 12:18 am" },
    { title: "Maya returned The Life Where You Moved to Hobart", time: "Nov 22, 12:42 am" },
    { title: "A new life found its way onto the shelves", time: "Nov 21, 12:00 am" },
  ]);
  const [notice, setNotice] = useState("");

  const activeMember = members.find((member) => member.id === activeMemberId)!;
  const myLoans = books.filter((book) => book.loanedTo === activeMember.name);
  const myWaitlistCount = Object.values(waitlist).filter((names) => names.includes(activeMember.name)).length;
  const onLoanCount = books.filter((book) => book.loanedTo).length;
  const openNow = new Date().getHours() === 0;

  const visibleBooks = useMemo(() => {
    const text = query.trim().toLocaleLowerCase();
    return books.filter((book) => {
      const matchesSearch =
        !text ||
        book.title.toLocaleLowerCase().includes(text) ||
        book.life.toLocaleLowerCase().includes(text);
      const matchesFilter =
        section !== "Discover" ||
        filter === "All books" ||
        (filter === "Available" && !book.loanedTo) ||
        (filter === "On loan" && Boolean(book.loanedTo));
      const matchesSection =
        section === "My loans"
          ? book.loanedTo === activeMember.name
          : section === "Waitlist"
            ? Boolean(waitlist[book.bookId]?.includes(activeMember.name))
            : section === "Activity"
              ? false
              : true;
      return matchesSearch && matchesFilter && matchesSection;
    });
  }, [activeMember.name, books, filter, query, section, waitlist]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  function toggleLoan(book: ShelfBook) {
    if (book.loanedTo === activeMember.name) {
      setBooks((current) =>
        current.map((item) =>
          item.bookId === book.bookId ? { ...item, loanedTo: null, due: null } : item,
        ),
      );
      setActivity((current) => [
        { title: `You returned ${book.title}`, time: "Just now" },
        ...current,
      ]);
      showNotice("Book returned to the shelves. Thank you.");
      return;
    }

    if (book.loanedTo) {
      showNotice("This book is already away on another adventure.");
      return;
    }
    if (myLoans.length >= (activeMember.tier === "Night Owl" ? 5 : 3)) {
      showNotice("You’ve reached your borrowing limit. Return a book to borrow another.");
      return;
    }

    setBooks((current) =>
      current.map((item) =>
        item.bookId === book.bookId
          ? { ...item, loanedTo: activeMember.name, due: "Due in 14 days" }
          : item,
      ),
    );
    setActivity((current) => [
      { title: `You borrowed ${book.title}`, time: "Just now" },
      ...current,
    ]);
    showNotice("A new life is yours to borrow for 14 days.");
  }

  function joinWaitlist(book: ShelfBook) {
    const names = waitlist[book.bookId] ?? [];
    if (names.includes(activeMember.name)) {
      showNotice("You’re already waiting for this book.");
      return;
    }
    setWaitlist((current) => ({
      ...current,
      [book.bookId]: [...(current[book.bookId] ?? []), activeMember.name],
    }));
    showNotice("You’re on the list. We’ll save your place in line.");
  }

  const currentFilter: Filter = section === "My loans" ? "All books" : filter;
  const sectionTitle =
    section === "Discover" ? "A life is waiting for you." : section === "My loans" ? "Your borrowed lives." : section === "Waitlist" ? "Good things take time." : "A little after-hours history.";
  const sectionDescription =
    section === "Discover"
      ? "Every book is a door to the life you might have lived."
      : section === "My loans"
        ? "The stories you’ve taken with you into the night."
        : section === "Waitlist"
          ? "We’ll keep your place until a book finds its way home."
          : "Small moments from the shelves, after dark.";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="The Midnight Library home" onClick={() => setSection("Discover")}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 42 42" fill="none">
              <path d="M27.5 7.5a15 15 0 1 0 7 27.1A16.2 16.2 0 0 1 27.5 7.5Z" fill="currentColor" />
              <path d="m13 30 8-17 8 17m-13-6h10" stroke="#10182a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m31 8 .8 2.2L34 11l-2.2.8L31 14l-.8-2.2L28 11l2.2-.8L31 8Z" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>The Midnight</strong>
            <span>LIBRARY</span>
          </span>
        </a>

        <div className="sidebar-label">YOUR DESK</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item ${section === item.name ? "active" : ""}`}
              key={item.name}
              onClick={() => setSection(item.name)}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.name}</span>
              {item.name === "My loans" && <span className="nav-count">{myLoans.length}</span>}
              {item.name === "Waitlist" && myWaitlistCount > 0 && (
                <span className="nav-count">{myWaitlistCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="open-card">
            <span className="open-orbit" aria-hidden="true">☾</span>
            <div className="open-copy">
              <span>THE LIBRARY IS</span>
              <strong><i className={openNow ? "status-dot is-open" : "status-dot"} />{openNow ? "Open tonight" : "Quiet for now"}</strong>
              <small>Every night · 12:00 – 1:00 am</small>
            </div>
          </div>
          <button className="help-link" onClick={() => showNotice("The library opens for checkout every night at midnight.")}>
            <span className="help-icon">?</span> A little help
            <span className="help-arrow">↗</span>
          </button>
          <div className="sidebar-footer">A place for all the lives you could live.</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>THE MIDNIGHT LIBRARY</span><b>/</b><strong>{section.toUpperCase()}</strong></div>
          <div className="topbar-actions">
            <label className="member-select-wrap">
              <span className="avatar">{activeMember.initials}</span>
              <select
                aria-label="Active library member"
                value={activeMember.id}
                onChange={(event) => setActiveMemberId(event.target.value)}
              >
                {members.map((member) => (
                  <option value={member.id} key={member.id}>{member.name}</option>
                ))}
              </select>
              <span className="select-chevron">⌄</span>
            </label>
            <button className="notification-button" aria-label="Notifications" onClick={() => showNotice("You’re all caught up. Nothing new after midnight.")}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 13h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <i />
            </button>
          </div>
        </header>

        <section className="welcome-row">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-star">✳</span> YOUR AFTER-HOURS READING ROOM</div>
            <h1>{sectionTitle}</h1>
            <p>{sectionDescription}</p>
          </div>
          <div className="date-note">
            <div className="date-moon">☾</div>
            <div><span>THE NIGHT IS YOUNG</span><strong>Take your time.</strong></div>
          </div>
        </section>

        {section === "Activity" ? (
          <section className="activity-page">
            <div className="section-heading">
              <div><h2>Recent moments</h2><p>A few things that happened while the world was asleep.</p></div>
              <span className="activity-count">{activity.length} moments</span>
            </div>
            <div className="activity-list">
              {activity.map((item, index) => (
                <article className="activity-row" key={`${item.title}-${index}`}>
                  <span className="activity-icon">{index === 0 ? "✦" : "↗"}</span>
                  <div><strong>{item.title}</strong><span>{item.time}</span></div>
                  <span className="activity-chevron">↗</span>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="shelf-toolbar">
              <div className="section-heading">
                <div>
                  <h2>{section === "My loans" ? "On your nightstand" : section === "Waitlist" ? "Books you’re waiting for" : "From the shelves"}</h2>
                  <p>{section === "My loans" ? `${myLoans.length} of ${activeMember.tier === "Night Owl" ? 5 : 3} books borrowed` : section === "Waitlist" ? "Your place in line, whenever you need it." : "A small collection of very different lives."}</p>
                </div>
                <div className="shelf-count"><span>{section === "Waitlist" ? myWaitlistCount : section === "My loans" ? myLoans.length : books.length}</span><small>{section === "Waitlist" ? "WAITING" : section === "My loans" ? "BORROWED" : "BOOKS"}</small></div>
              </div>

              {section !== "Waitlist" && (
                <div className="toolbar-controls">
                  <div className="filter-tabs" role="group" aria-label="Filter books">
                    {(["All books", "Available", "On loan"] as Filter[]).map((option) => (
                      <button
                        key={option}
                        className={currentFilter === option ? "selected" : ""}
                        onClick={() => { setSection("Discover"); setFilter(option); }}
                      >
                        {option}{option === "Available" && <span className="available-tiny" />}
                      </button>
                    ))}
                  </div>
                  <label className="search-box">
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.5" /><path d="m13.2 13.2 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a life..." aria-label="Search books" />
                    {query && <button aria-label="Clear search" onClick={() => setQuery("")}>×</button>}
                  </label>
                </div>
              )}
            </section>

            {visibleBooks.length ? (
              <section className="book-grid" aria-label="Books">
                {visibleBooks.map((book) => {
                  const isMine = book.loanedTo === activeMember.name;
                  const isAvailable = !book.loanedTo;
                  const waitingNames = waitlist[book.bookId] ?? [];
                  return (
                    <article className={`book-card ${!isAvailable ? "is-loaned" : ""}`} key={book.bookId}>
                      <div className={`book-cover cover-${book.cover + 1}`}>
                        <div className="cover-topline"><span>MIDNIGHT LIBRARY</span><span>{String(book.cover + 1).padStart(2, "0")}</span></div>
                        <div className="cover-art" aria-hidden="true">
                          <span className="cover-halo" />
                          <span className="cover-shape shape-one" />
                          <span className="cover-shape shape-two" />
                          <span className="cover-shape shape-three" />
                          <span className="cover-stars">✦　·　✧<br />　·　✦</span>
                        </div>
                        <div className="cover-title">{book.title.replace("The Life Where ", "").replace("You ", "")}</div>
                        <div className="cover-author">A LIFE, SOMEWHERE</div>
                        <span className="cover-spine" />
                      </div>
                      <div className="book-info">
                        <div className="book-meta"><span>{book.category}</span><span className={isAvailable ? "availability" : "borrowed-status"}><i />{isAvailable ? "On the shelf" : isMine ? "Your book" : "Out exploring"}</span></div>
                        <h3>{book.title}</h3>
                        <p>{book.life}</p>
                        {!isAvailable && book.due && (
                          <div className="due-note"><span>◷</span>{isMine ? book.due : `With ${book.loanedTo}`}<span className="due-separator">·</span>{isMine ? "Return any time" : "On loan"}</div>
                        )}
                        {isAvailable ? (
                          <button className="book-action borrow-action" onClick={() => toggleLoan(book)}>
                            <span>Borrow this life</span><span className="action-arrow">↗</span>
                          </button>
                        ) : isMine ? (
                          <button className="book-action return-action" onClick={() => toggleLoan(book)}>
                            <span>Return to shelf</span><span className="action-arrow">↙</span>
                          </button>
                        ) : (
                          <button className={`book-action wait-action ${waitingNames.includes(activeMember.name) ? "is-waiting" : ""}`} onClick={() => joinWaitlist(book)}>
                            <span>{waitingNames.includes(activeMember.name) ? "You’re on the list" : "Join the waitlist"}</span><span className="action-arrow">↗</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : (
              <div className="empty-state">
                <span>☾</span>
                <h3>{section === "Waitlist" ? "No waiting lists just yet" : section === "My loans" ? "Your nightstand is clear" : "No lives found"}</h3>
                <p>{section === "Waitlist" ? "Join a book’s waitlist and it’ll find a place here." : "Try another search, or wander through all the shelves."}</p>
                <button onClick={() => { setSection("Discover"); setFilter("All books"); setQuery(""); }}>Explore the shelves <span>↗</span></button>
              </div>
            )}
          </>
        )}

        <footer className="main-footer"><span>✦</span> There are more lives than there are nights. <span>✦</span></footer>
      </main>

      <aside className="right-rail">
        <div className="rail-heading"><span>YOUR LITTLE CORNER</span><button aria-label="More options" onClick={() => showNotice("Your library is looking lovely tonight.")}>···</button></div>
        <section className="member-card">
          <div className="member-card-top"><div className="member-avatar">{activeMember.initials}</div><span className="tier-badge">{activeMember.tier === "Night Owl" ? "✦ " : ""}{activeMember.tier}</span></div>
          <h2>{activeMember.name}</h2>
          <p>Reader since November 2026</p>
          <div className="member-stats">
            <div><strong>{myLoans.length}<span>/{activeMember.tier === "Night Owl" ? 5 : 3}</span></strong><small>BOOKS OUT</small></div>
            <div><strong>{myWaitlistCount}</strong><small>ON WAITLIST</small></div>
            <div><strong>0</strong><small>LATE FEES</small></div>
          </div>
          <div className="loan-progress"><span style={{ width: `${Math.min(100, (myLoans.length / (activeMember.tier === "Night Owl" ? 5 : 3)) * 100)}%` }} /></div>
          <div className="progress-caption"><span>Borrowing limit</span><span>{Math.max(0, (activeMember.tier === "Night Owl" ? 5 : 3) - myLoans.length)} left</span></div>
        </section>

        <section className="rail-section">
          <div className="rail-section-title"><h3>Your nightstand</h3><button onClick={() => setSection("My loans")}>See all <span>↗</span></button></div>
          {myLoans.length ? (
            <div className="nightstand-list">
              {myLoans.slice(0, 3).map((book) => (
                <button className="nightstand-item" key={book.bookId} onClick={() => { setSection("My loans"); setFilter("All books"); }}>
                  <span className={`mini-cover mini-${book.cover + 1}`}><i /></span>
                  <span className="nightstand-copy"><strong>{book.title.replace("The Life Where ", "")}</strong><small>{book.due}</small></span>
                  <span className="nightstand-arrow">↗</span>
                </button>
              ))}
            </div>
          ) : <p className="rail-empty">Nothing borrowed yet. The shelves are waiting.</p>}
        </section>

        <section className="midnight-note">
          <div className="note-stars">✦ <span>·</span> ✧</div>
          <span className="note-label">A NOTE FROM THE LIBRARIAN</span>
          <p>“You don’t have to understand your life. You just have to live it.”</p>
          <small>— A quiet reminder</small>
          <div className="note-moon">☾</div>
        </section>

        <section className="rail-section activity-preview">
          <div className="rail-section-title"><h3>After hours</h3><button onClick={() => setSection("Activity")}>All activity <span>↗</span></button></div>
          <div className="mini-activity"><span className="activity-dot" /><div><strong>{activity[0]?.title ?? "The library is quiet"}</strong><small>{activity[0]?.time ?? "A moment ago"}</small></div></div>
          <div className="mini-activity"><span className="activity-dot muted" /><div><strong>{onLoanCount} books are out living their stories</strong><small>Across the library</small></div></div>
        </section>
        <div className="rail-footer"><span>⌘</span> Made for the in-between hours</div>
      </aside>

      {notice && <div className="toast" role="status"><span>✦</span>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification">×</button></div>}
    </div>
  );
}

export default App;
