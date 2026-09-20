/**
 * main.js — Shared utilities for all pages
 * Handles: navbar toggle, footer injection, fade-in animations,
 * active nav link highlighting, and shared class card rendering.
 *
 * IMPORTANT: The navbar HTML must stay identical across all 7 pages.
 * See README.md for the required navbar markup.
 */

/* ============================================
   NAVBAR — Mobile Hamburger Toggle
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });

    // Close menu when a link is clicked (mobile UX)
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Highlight active nav link based on current page
  highlightActiveLink();

  // Inject shared footer
  injectFooter();

  // Initialize fade-in animations
  initFadeIn();
});

/**
 * Highlights the current page's nav link by comparing href filename.
 */
function highlightActiveLink() {
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === currentPage) {
      a.classList.add("active");
    }
  });
}

/**
 * Injects the shared footer into every page.
 * The <footer> element should exist in the HTML with id="footer-placeholder".
 */
function injectFooter() {
  var placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) return;

  placeholder.innerHTML = '<div class="container">' +
    '<div class="footer-grid">' +
      '<div class="footer-brand">' +
        '<h3>Millat Programmer Association</h3>' +
        '<p style="margin-top:8px">\u09ae\u09be\u09a6\u09cd\u09b0\u09be\u09b8\u09be \u099b\u09be\u09a4\u09cd\u09b0\u09a6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u098f\u0995\u099f\u09bf \u09aa\u09cd\u09b0\u09cb\u0997\u09cd\u09b0\u09be\u09ae\u09bf\u0982 \u0995\u09cd\u09b2\u09be\u09ac \u2014 HTML \u0993 C \u098f\u0995\u09b8\u09be\u09a5\u09c7 \u09b6\u09bf\u0996\u09c1\u09a8\u0964</p>' +
      '</div>' +
      '<div class="footer-links">' +
        '<h4>\u09a6\u09cd\u09b0\u09c1\u09a4 \u09b2\u09bf\u0999\u09cd\u0995</h4>' +
        '<ul>' +
          '<li><a href="index.html">\u09b9\u09cb\u09ae</a></li>' +
          '<li><a href="about.html">\u0986\u09ae\u09be\u09a6\u09c7\u09b0 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995\u09c7</a></li>' +
          '<li><a href="routine.html">\u09b0\u09c1\u099f\u09bf\u09a8</a></li>' +
          '<li><a href="classes.html">\u0995\u09cd\u09b2\u09be\u09b8 \u09b8\u09cd\u099f\u09cb\u09b0</a></li>' +
          '<li><a href="resources.html">\u09b0\u09bf\u09b8\u09cb\u09b0\u09cd\u09b8</a></li>' +
          '<li><a href="enroll.html">\u09ad\u09b0\u09cd\u09a4\u09bf</a></li>' +
          '<li><a href="register.html">\u09b0\u09c7\u099c\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09c7\u09b6\u09a8</a></li>' +
        '</ul>' +
      '</div>' +
      '<div class="footer-contact">' +
        '<h4>\u09af\u09cb\u0997\u09be\u09af\u09cb\u0997</h4>' +
        '<ul>' +
          '<li><a href="https://wa.me/8801870746153" target="_blank" rel="noopener">WhatsApp: +8801870746153</a></li>' +
          '<li><a href="mailto:shafayatamin0010@gmail.com">\u0987\u09ae\u09c7\u0987\u09b2: shafayatamin0010@gmail.com</a></li>' +
          '<li><a href="https://www.facebook.com/shafu0010" target="_blank" rel="noopener">Facebook: shafu0010</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<p>&copy; 2026 Millat Programmer Association. <a href="https://github.com/ShafayatAmin" target="_blank" rel="noopener">\u0993\u09aa\u09c7\u09a8 \u09b8\u09cb\u09b0\u09cd\u09b8 \u2014 GitHub</a></p>' +
    '</div>' +
  '</div>';
}

/* ============================================
   FADE-IN ON SCROLL - IntersectionObserver
   ============================================ */
function initFadeIn() {
  var elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach(function (el) { el.classList.add("visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function (el) { observer.observe(el); });
}

/* ============================================
   SHARED: Render Class Card HTML
   Reused by index.html and classes.html
   ============================================ */
function renderClassCard(cls) {
  var subjectBadgeClass = cls.subject === "html" ? "badge-html" : "badge-c";
  var subjectLabel = cls.subject === "html" ? "HTML" : "C";
  var freeBadge = cls.isFree ? '<span class="badge badge-free">\u09ab\u09cd\u09b0\u09bf \u09aa\u09cd\u09b0\u09bf\u09ad\u09bf\u09a8 \u09b8\u09be\u09aa\u09be\u0993\u09b9\u09be</span>' : '';
  var lockIcon = cls.isFree
    ? ''
    : '<div class="lock-notice">&#128274; \u0995\u09c7\u09a8\u09cd\u09a4\u09cd\u09b0\u09bf\u09a4 \u09b8\u09a6\u09b8\u09cd\u09af\u09cb\u09a6\u09c7\u09b0 \u099c\u09a8\u09cd\u09af</div>';

  var topicList = cls.topics.map(function (t) {
    return "<li>" + escapeHTML(t) + "</li>";
  }).join("");

  return '<div class="card class-card fade-in" data-id="' + cls.id + '" data-subject="' + cls.subject + '" data-free="' + cls.isFree + '">' +
    '<div class="class-card-header">' +
      '<span class="class-number">\u0995\u09cd\u09b2\u09be\u09b8 ' + padNumber(cls.number) + '</span>' +
      '<span class="badge ' + subjectBadgeClass + '">' + subjectLabel + '</span>' +
      freeBadge +
    '</div>' +
    '<h3>' + escapeHTML(cls.title) + '</h3>' +
    '<div class="class-meta">' +
      '<span>&#128197; ' + formatDate(cls.date) + '</span>' +
      '<span>&#9201; ' + escapeHTML(cls.duration) + '</span>' +
    '</div>' +
    '<p class="class-desc">' + escapeHTML(cls.description) + '</p>' +
    '<div class="class-actions">' +
      '<a href="' + escapeHTML(cls.youtubeUrl) + '" target="_blank" rel="noopener" class="btn btn-primary btn-small">&#9654; YouTube \u09a6\u09c7\u0996\u09c1\u09a8</a>' +
      '<a href="' + escapeHTML(cls.pdfUrl) + '" target="_blank" rel="noopener" class="btn btn-outline btn-small">&#128196; PDF \u09a8\u09cb\u099f\u09b8 \u09a6\u09c7\u0996\u09c1\u09a8</a>' +
    '</div>' +
    lockIcon +
  '</div>';
}

function formatDate(dateStr) {
  var parts = dateStr.split("-");
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[parseInt(parts[1], 10) - 1] + " " + parseInt(parts[2], 10) + ", " + parts[0];
}

function padNumber(n) {
  return n < 10 ? "0" + n : "" + n;
}

function escapeHTML(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
