/**
 * classes.js - Renders class cards grid and handles the detail modal.
 * Used on classes.html and also by index.html (for latest 3 classes).
 *
 * THIS IS THE ENGINE (js/classes.js). It must NEVER contain "var CLASSES" —
 * the data lives only in data/classes.js.
 */

document.addEventListener("DOMContentLoaded", function () {
  var classesGrid = document.getElementById("classes-grid");
  if (classesGrid) {
    renderClassesGrid();
    initFilters();
    handleHashModal();
  }
});

function renderClassesGrid() {
  var grid = document.getElementById("classes-grid");
  if (!grid) return;

  var filterBar = document.querySelector(".filter-bar");

  /* Empty library (or data file missing) → friendly "coming soon" card */
  if (typeof CLASSES === "undefined" || !Array.isArray(CLASSES) || CLASSES.length === 0) {
    grid.innerHTML =
      '<div class="paid-notice-card fade-in" style="grid-column:1/-1;text-align:center;">' +
        '<h3>শীঘ্রই ক্লাস যোগ করা হবে</h3>' +
        '<p>আমাদের ক্লাস লাইব্রেরি এখন প্রস্তুত হচ্ছে — নতুন ক্লাস শীঘ্রই যোগ করা হবে।</p>' +
      '</div>';
    if (filterBar) filterBar.style.display = "none";
    if (typeof initFadeIn === "function") initFadeIn();
    return;
  }

  if (filterBar) filterBar.style.display = "";
  grid.innerHTML = "";
  CLASSES.forEach(function (cls) {
    grid.insertAdjacentHTML("beforeend", renderClassCard(cls));
  });
  grid.querySelectorAll(".class-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a") || e.target.closest("button")) return;
      openClassModal(card.getAttribute("data-id"));
    });
  });
  if (typeof initFadeIn === "function") initFadeIn();
}

function initFilters() {
  var buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      filterClasses(btn.getAttribute("data-filter"));
    });
  });
}

function filterClasses(filter) {
  var cards = document.querySelectorAll("#classes-grid .class-card");
  cards.forEach(function (card) {
    var subject = card.getAttribute("data-subject");
    var isFree = card.getAttribute("data-free") === "true";
    var show = false;
    if (filter === "all") show = true;
    else if (filter === "html") show = subject === "html";
    else if (filter === "c") show = subject === "c";
    else if (filter === "free") show = isFree;
    card.style.display = show ? "" : "none";
  });
}

function handleHashModal() {
  if (typeof CLASSES === "undefined" || !Array.isArray(CLASSES)) return;
  var hash = window.location.hash;
  if (hash && hash.startsWith("#")) {
    var classId = hash.substring(1);
    var exists = CLASSES.some(function (c) { return c.id === classId; });
    if (exists) openClassModal(classId);
    else showClassNotFound();
  }
  window.addEventListener("hashchange", function () {
    var h = window.location.hash;
    if (h && h.startsWith("#")) {
      var cid = h.substring(1);
      var found = CLASSES.some(function (c) { return c.id === cid; });
      if (found) openClassModal(cid);
      else { closeClassModal(); showClassNotFound(); }
    } else { closeClassModal(); hideClassNotFound(); }
  });
}

function openClassModal(classId) {
  var cls = CLASSES.find(function (c) { return c.id === classId; });
  if (!cls) return;
  var overlay = document.getElementById("class-modal-overlay");
  var modal = document.getElementById("class-modal");
  if (!overlay || !modal) return;

  var subjectBadgeClass = cls.subject === "html" ? "badge-html" : "badge-c";
  var subjectLabel = cls.subject === "html" ? "HTML" : "C";
  var freeBadge = cls.isFree ? '<span class="badge badge-free" style="margin-left:8px">\u09ab\u09cd\u09b0\u09bf \u09aa\u09cd\u09b0\u09bf\u09ad\u09bf\u09a8 \u09b8\u09be\u09aa\u09be\u0996\u09be</span>' : '';

  var topicList = cls.topics.map(function (t) { return "<li>" + escapeHTML(t) + "</li>"; }).join("");

  var videoSection = "";
  if (cls.embedUrl && cls.embedUrl.trim() !== "") {
    videoSection = '<div class="video-embed"><iframe src="' + escapeHTML(cls.embedUrl) + '" title="' + escapeHTML(cls.title) + '" loading="lazy" allowfullscreen></iframe></div>';
  } else {
    videoSection = '<div class="private-notice"><div class="icon">&#128274;</div><p>\u09ad\u09bf\u09a1\u09bf\u0993\u099f\u09bf \u09aa\u09cd\u09b0\u09be\u0987\u09ad\u09c7\u099f \u2014 YouTube \u09a4\u09c7 \u09a6\u09c7\u0996\u09c1\u09a8\u0964 \u0995\u09c7\u09a8\u09cd\u09a4\u09cd\u09b0\u09bf\u09a4 \u09b8\u09a6\u09b8\u09cd\u09af\u09cb\u09a6\u09c7\u09b0 Google \u0985\u09cd\u09af\u09be\u0995\u09be\u09a8\u09cd\u099f \u09a6\u09bf\u09af\u09bc\u09be \u0995\u09be\u099c\u09c7\u099b\u09c7\u0964</p><a href="' + escapeHTML(cls.youtubeUrl) + '" target="_blank" rel="noopener" class="btn btn-gold btn-small">&#9654; YouTube \u09a4\u09c7 \u09a6\u09c7\u0996\u09c1\u09a8</a></div>';
  }

  var html = '<button class="modal-close" aria-label="Close modal">&times;</button>' +
    '<h2>' + escapeHTML(cls.title) + freeBadge + '</h2>' +
    '<div class="class-meta"><span class="badge ' + subjectBadgeClass + '">' + subjectLabel + '</span><span>\u0995\u09cd\u09b2\u09be\u09b8 ' + padNumber(cls.number) + '</span><span>&#128197; ' + formatDate(cls.date) + '</span><span>&#9201; ' + escapeHTML(cls.duration) + '</span></div>' +
    videoSection +
    '<p class="class-desc">' + escapeHTML(cls.description) + '</p>' +
    '<div class="modal-topics"><h4>এই ক্লাসে যা যা শেখানো হয়েছে</h4><ul>' + topicList + '</ul></div>' +
    '<div class="modal-actions"><a href="' + escapeHTML(cls.youtubeUrl) + '" target="_blank" rel="noopener" class="btn btn-primary btn-small">&#9654; YouTube \u09a4\u09c7 \u09a6\u09c7\u0996\u09c1\u09a8</a><a href="' + escapeHTML(cls.pdfUrl) + '" target="_blank" rel="noopener" class="btn btn-outline btn-small">&#128196; PDF \u09a8\u09cb\u099f\u09b8 \u09a6\u09c7\u0996\u09c1\u09a8</a></div>';

  modal.innerHTML = html;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").addEventListener("click", closeClassModal);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeClassModal(); });
}

function closeClassModal() {
  var overlay = document.getElementById("class-modal-overlay");
  if (overlay) { overlay.classList.remove("open"); document.body.style.overflow = ""; }
}

document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeClassModal(); });

function showClassNotFound() {
  var overlay = document.getElementById("class-modal-overlay");
  var modal = document.getElementById("class-modal");
  if (!overlay || !modal) return;
  modal.innerHTML = '<button class="modal-close" aria-label="Close modal">&times;</button><div class="not-found"><h2>\u0995\u09cd\u09b2\u09be\u09b8 \u09aa\u09be\u0993\u09af\u09bc\u09be \u09af\u09be\u0993\u09a8\u09bf</h2><p>\u0986\u09aa\u09a8\u09be\u09b0 \u0996\u09c1\u0981\u099c\u09c7 \u09a5\u09be\u0995\u09be \u0995\u09cd\u09b2\u09be\u09b8\u099f\u09bf \u09ac\u09c0\u09a4\u09cd\u09a4 \u09a8\u09c7\u0987 \u09ac\u09be \u09ae\u09c1\u099b\u09c7 \u09ab\u09c7\u09b2\u09be\u09b9\u09be\u09b0\u09c7\u099b\u09c7\u0964</p><a href="classes.html" class="btn btn-primary mt-24">\u09b8\u09ac \u0995\u09cd\u09b2\u09be\u09b8 \u09a6\u09c7\u0996\u09c1\u09a8</a></div>';
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").addEventListener("click", closeClassModal);
}

function hideClassNotFound() { closeClassModal(); }

function renderLatestClasses(containerId, count) {
  var container = document.getElementById(containerId);
  if (!container || typeof CLASSES === "undefined") return;
  var sorted = CLASSES.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
  var latest = sorted.slice(0, count);
  container.innerHTML = "";
  latest.forEach(function (cls) { container.insertAdjacentHTML("beforeend", renderClassCard(cls)); });
  container.querySelectorAll(".class-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a") || e.target.closest("button")) return;
      openClassModal(card.getAttribute("data-id"));
    });
  });
  if (typeof initFadeIn === "function") initFadeIn();
}