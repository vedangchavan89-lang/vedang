/* =========================================
   DIGITAL NOTICE BOARD - script.js
   ========================================= */

// 1. SAMPLE NOTICE DATA
const notices = [
  {
    id: 1,
    title: "Semester Examination Timetable Released",
    category: "Examinations",
    description:
      "The timetable for the upcoming semester examinations has been released. Students should check the examination schedule and prepare accordingly. Contact the examination department if you find any discrepancy.",
    date: "2026-10-15",
    priority: "high",
    pinned: true,
    deadline: "2026-10-25"
  },
  {
    id: 2,
    title: "Annual College Festival Registration",
    category: "Events",
    description:
      "Registration is now open for the annual college festival. Students can participate in cultural activities, music, dance, art and various competitions. Register before the deadline.",
    date: "2026-10-14",
    priority: "normal",
    pinned: true,
    deadline: "2026-10-28"
  },
  {
    id: 3,
    title: "Campus Placement Drive",
    category: "Placements",
    description:
      "Eligible students are invited to participate in the upcoming campus placement drive. Keep your updated resume ready and check the eligibility criteria before applying.",
    date: "2026-10-12",
    priority: "high",
    pinned: true,
    deadline: "2026-10-22"
  },
  {
    id: 4,
    title: "Assignment Submission Guidelines",
    category: "Academics",
    description:
      "Students must submit their assignments according to the instructions provided by their respective faculty members. Late submissions may be subject to departmental rules.",
    date: "2026-10-10",
    priority: "normal",
    pinned: false,
    deadline: "2026-10-24"
  },
  {
    id: 5,
    title: "College Holiday Announcement",
    category: "Holidays",
    description:
      "Please refer to the official academic calendar for the upcoming college holiday. Students should check departmental announcements for any changes to scheduled activities.",
    date: "2026-10-08",
    priority: "normal",
    pinned: false,
    deadline: ""
  },
  {
    id: 6,
    title: "Library Timings Updated",
    category: "General",
    description:
      "The library operating schedule has been updated. Students are requested to check the new timings before planning their visits and to follow all library rules.",
    date: "2026-10-06",
    priority: "normal",
    pinned: false,
    deadline: ""
  },
  {
    id: 7,
    title: "Workshop on Artificial Intelligence",
    category: "Events",
    description:
      "Join an introductory workshop on Artificial Intelligence and Machine Learning. The session will cover basic concepts, real-world applications and learning opportunities.",
    date: "2026-10-04",
    priority: "normal",
    pinned: false,
    deadline: "2026-10-30"
  },
  {
    id: 8,
    title: "Internal Assessment Instructions",
    category: "Academics",
    description:
      "Students should check their subject-wise internal assessment schedule and confirm any submission requirements with their respective faculty members.",
    date: "2026-10-02",
    priority: "high",
    pinned: false,
    deadline: "2026-10-20"
  }
];


// 2. SELECT HTML ELEMENTS
const noticeGrid = document.getElementById("noticeGrid");
const pinnedNotices = document.getElementById("pinnedNotices");
const noticeSearch = document.getElementById("noticeSearch");
const heroSearch = document.getElementById("heroSearch");
const heroSearchForm = document.getElementById("heroSearchForm");
const categoryFilter = document.getElementById("categoryFilter");
const sortNotices = document.getElementById("sortNotices");
const filterPills = document.getElementById("filterPills");
const emptyState = document.getElementById("emptyState");
const clearFilters = document.getElementById("clearFilters");
const loadMore = document.getElementById("loadMore");
const noticeDialog = document.getElementById("noticeDialog");
const dialogContent = document.getElementById("dialogContent");
const dialogClose = document.getElementById("dialogClose");


// 3. FILTER AND DISPLAY SETTINGS
let selectedCategory = "All";
let visibleCount = 6;
let showAllNotices = false;


// 4. FORMAT DATES
function formatDate(dateString) {
  if (!dateString) return "No deadline";

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}


// 5. SAFELY DISPLAY TEXT IN HTML
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}


// 6. CREATE A NOTICE CARD
function createNoticeCard(notice) {
  const priorityClass =
    notice.priority === "high" ? "urgent" : "";

  const priorityLabel =
    notice.priority === "high" ? "Important" : "Notice";

  const deadlineHTML = notice.deadline
    ? `<span class="deadline">Deadline: ${formatDate(notice.deadline)}</span>`
    : "";

  return `
    <article class="notice-card">
      <div class="notice-topline">
        <span class="tag ${priorityClass}">
          ${priorityLabel}
        </span>

        <span class="notice-date">
          ${formatDate(notice.date)}
        </span>
      </div>

      <span class="notice-category">
        ${escapeHTML(notice.category)}
      </span>

      <h3>${escapeHTML(notice.title)}</h3>

      <p>
        ${escapeHTML(notice.description)}
      </p>

      <div class="card-bottom">
        ${deadlineHTML}

        <button
          class="read-link"
          type="button"
          data-notice-id="${notice.id}"
        >
          Read details →
        </button>
      </div>
    </article>
  `;
}


// 7. DISPLAY IMPORTANT / PINNED NOTICES
function renderPinnedNotices() {
  if (!pinnedNotices) return;

  const pinned = notices.filter(notice => notice.pinned);

  pinnedNotices.innerHTML = pinned.length
    ? pinned.map(createNoticeCard).join("")
    : "<p>No pinned notices available.</p>";
}


// 8. FILTER NOTICES
function getFilteredNotices() {
  const searchText = noticeSearch
    ? noticeSearch.value.trim().toLowerCase()
    : "";

  let filtered = notices.filter(notice => {
    const matchesSearch = [
      notice.title,
      notice.category,
      notice.description
    ].some(value => value.toLowerCase().includes(searchText));

    const matchesCategory =
      selectedCategory === "All" ||
      notice.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort the filtered notices.
  if (sortNotices) {
    switch (sortNotices.value) {
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        break;

      case "priority":
        filtered.sort((a, b) => {
          if (a.priority === b.priority) {
            return new Date(b.date) - new Date(a.date);
          }

          return a.priority === "high" ? -1 : 1;
        });
        break;

      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
    }
  }

  return filtered;
}


// 9. DISPLAY FILTERED NOTICES
function renderNotices() {
  if (!noticeGrid) return;

  const filtered = getFilteredNotices();

  const displayed = showAllNotices
    ? filtered
    : filtered.slice(0, visibleCount);

  noticeGrid.innerHTML = displayed.length
    ? displayed.map(createNoticeCard).join("")
    : "";

  // Show or hide the empty-state message.
  if (emptyState) {
    emptyState.hidden = filtered.length > 0;
  }

  // Show the Load More button only when needed.
  if (loadMore) {
    const hasMore = filtered.length > visibleCount;

    loadMore.hidden = !hasMore && !showAllNotices;

    loadMore.textContent = showAllNotices
      ? "Show Less"
      : "Load More Notices";
  }

  updateFilterPills();
}


// 10. KEEP CATEGORY FILTERS IN SYNC
function updateFilterPills() {
  if (!filterPills) return;

  filterPills.querySelectorAll("[data-filter]").forEach(button => {
    const category = button.dataset.filter;

    const isActive = category === selectedCategory;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (categoryFilter) {
    categoryFilter.value = selectedCategory;
  }
}


// 11. CHANGE CATEGORY
function setCategory(category) {
  selectedCategory = category;
  showAllNotices = false;

  renderNotices();
}


// 12. SEARCH FROM THE HERO SECTION
if (heroSearchForm) {
  heroSearchForm.addEventListener("submit", event => {
    event.preventDefault();

    if (noticeSearch && heroSearch) {
      noticeSearch.value = heroSearch.value;
    }

    showAllNotices = false;
    renderNotices();

    document.getElementById("notices")?.scrollIntoView({
      behavior: "smooth"
    });
  });
}


// 13. LIVE SEARCH
if (noticeSearch) {
  noticeSearch.addEventListener("input", () => {
    if (heroSearch) {
      heroSearch.value = noticeSearch.value;
    }

    showAllNotices = false;
    renderNotices();
  });
}


// 14. CATEGORY DROPDOWN
if (categoryFilter) {
  categoryFilter.addEventListener("change", () => {
    setCategory(categoryFilter.value);
  });
}


// 15. CATEGORY PILLS
if (filterPills) {
  filterPills.addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    setCategory(button.dataset.filter);
  });
}


// 16. CATEGORY CARDS
document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);

    document.getElementById("notices")?.scrollIntoView({
      behavior: "smooth"
    });
  });
});


// 17. SORT NOTICES
if (sortNotices) {
  sortNotices.addEventListener("change", () => {
    showAllNotices = false;
    renderNotices();
  });
}


// 18. CLEAR ALL FILTERS
if (clearFilters) {
  clearFilters.addEventListener("click", () => {
    selectedCategory = "All";
    showAllNotices = false;

    if (noticeSearch) noticeSearch.value = "";
    if (heroSearch) heroSearch.value = "";
    if (sortNotices) sortNotices.value = "newest";

    renderNotices();
  });
}


// 19. LOAD MORE / SHOW LESS
if (loadMore) {
  loadMore.addEventListener("click", () => {
    showAllNotices = !showAllNotices;
    renderNotices();
  });
}


// 20. OPEN NOTICE DETAILS
document.addEventListener("click", event => {
  const button = event.target.closest("[data-notice-id]");

  if (!button) return;

  const noticeId = Number(button.dataset.noticeId);
  const notice = notices.find(item => item.id === noticeId);

  if (!notice || !dialogContent || !noticeDialog) return;

  dialogContent.innerHTML = `
    <span class="tag ${notice.priority === "high" ? "urgent" : ""}">
      ${notice.priority === "high" ? "Important Notice" : "Notice"}
    </span>

    <p class="notice-category">
      ${escapeHTML(notice.category)}
    </p>

    <h2>${escapeHTML(notice.title)}</h2>

    <p class="notice-date">
      Published: ${formatDate(notice.date)}
    </p>

    <p>${escapeHTML(notice.description)}</p>

    ${
      notice.deadline
        ? `<p><strong>Deadline:</strong> ${formatDate(notice.deadline)}</p>`
        : ""
    }
  `;

  if (typeof noticeDialog.showModal === "function") {
    noticeDialog.showModal();
  } else {
    noticeDialog.setAttribute("open", "");
  }
});


// 21. CLOSE NOTICE DIALOG
if (dialogClose && noticeDialog) {
  dialogClose.addEventListener("click", () => {
    if (typeof noticeDialog.close === "function") {
      noticeDialog.close();
    } else {
      noticeDialog.removeAttribute("open");
    }
  });
}


// 22. MOBILE NAVIGATION MENU
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// 23. AUTOMATICALLY UPDATE COPYRIGHT YEAR
const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


// 24. INITIALIZE THE WEBSITE
renderPinnedNotices();
renderNotices();
