/**
 * paid.js — Renders the "Paid Students" status board.
 *
 * Week logic (computed in visitor's browser):
 *   - Parse PAID_WEEK.weekStart as LOCAL midnight.
 *   - weekEnd = weekStart + 7 days (exclusive).
 *   - today ∈ [weekStart, weekEnd)  → active week with table.
 *   - today < weekStart             → "not started yet" notice.
 *   - today >= weekEnd              → "week ended" notice.
 *
 * HARDENED: missing/bad data shows a visible notice card instead of a
 * blank page. Helper names are prefixed with "paid" so they can never
 * collide with globals from js/main.js on this page.
 */

document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("paid-content");
  if (!container) return;

  /* ---------- safety checks: never render a blank page ---------- */
  if (typeof PAID_WEEK === "undefined" || !PAID_WEEK) {
    container.innerHTML =
      '<div class="paid-notice-card paid-notice-ended">' +
        '<h3>ডেটা লোড হয়নি</h3>' +
        '<p>data/paid-students.js ফাইলটি সঠিক ফরম্যাটে নেই। tools/admin.html ' +
        '(💰 পেইড স্টুডেন্ট ট্যাব) দিয়ে ডেটা বানিয়ে সেভ করুন।</p>' +
      '</div>';
    return;
  }

  var ws = PAID_WEEK.weekStart;
  if (typeof ws !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(ws)) {
    container.innerHTML =
      '<div class="paid-notice-card paid-notice-ended">' +
        '<h3>weekStart সঠিক নয়</h3>' +
        '<p>data/paid-students.js এ weekStart দিতে হবে (YYYY-MM-DD ফরম্যাটে)। ' +
        'tools/admin.html দিয়ে ডেটা সেভ করলে এটি অটোমেটিক ঠিক হয়ে যায়।</p>' +
      '</div>';
    return;
  }

  // Parse weekStart as LOCAL date (midnight)
  var parts = ws.split("-");
  var startDate = new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );

  // weekEnd = weekStart + 7 days (exclusive)
  var endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7);

  // Today at local midnight
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Format date range display
  var rangeStr = formatPaidDate(startDate) + " — " +
    formatPaidDate(new Date(endDate.getTime() - 86400000));

  // CASE 1: Today is BEFORE weekStart
  if (today < startDate) {
    container.innerHTML =
      '<div class="paid-notice-card fade-in">' +
        '<h3>নতুন সপ্তাহ শুরু হয়নি</h3>' +
        '<p>শীঘ্রই আসছে</p>' +
        '<div class="paid-range">' + rangeStr + '</div>' +
      '</div>';
    initPaidFadeIn(container);
    return;
  }

  // CASE 2: Today is ON or AFTER weekEnd — week has ended
  if (today >= endDate) {
    container.innerHTML =
      '<div class="paid-notice-card paid-notice-ended fade-in">' +
        '<h3>এই সপ্তাহ শেষ হয়ে গেছে</h3>' +
        '<p>নতুন সপ্তাহের তালিকা শীঘ্রই আপডেট হবে — আমাদের সাথে যুক্ত থাকুন।</p>' +
      '</div>';
    initPaidFadeIn(container);
    return;
  }

  // CASE 3: Active week — today is within [weekStart, weekEnd)
  var daysRemaining = Math.ceil((endDate - today) / 86400000);
  var badgeText;
  if (daysRemaining <= 0) {
    badgeText = "আজ শেষ দিন";
  } else if (daysRemaining === 1) {
    badgeText = "সপ্তাহ চলছে — আরও ১ দিন বাকি";
  } else {
    badgeText = "সপ্তাহ চলছে — আরও " + daysRemaining + " দিন বাকি";
  }

  var html = "";
  html += '<div class="paid-week-badge fade-in">' + badgeText + '</div>';
  html += '<div class="paid-range fade-in">' + rangeStr + '</div>';

  var students = Array.isArray(PAID_WEEK.students) ? PAID_WEEK.students : [];

  if (students.length === 0) {
    html +=
      '<div class="paid-notice-card fade-in">' +
        '<p>এই সপ্তাহে এখনো কোনো সদস্য পেমেন্ট করেননি।</p>' +
      '</div>';
    container.innerHTML = html;
    initPaidFadeIn(container);
    return;
  }

  html +=
    '<div class="paid-table-wrap fade-in">' +
      '<table class="paid-table">' +
        '<thead>' +
          '<tr>' +
            '<th>Reg ID</th>' +
            '<th>নাম</th>' +
            '<th>রোল</th>' +
            '<th>শ্রেণি</th>' +
            '<th>বিভাগ</th>' +
            '<th>শাখা</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>';

  for (var i = 0; i < students.length; i++) {
    var s = students[i];
    html +=
      '<tr>' +
        '<td data-label="Reg ID">' + escapePaidHtml(s.regId) + '</td>' +
        '<td data-label="নাম">' + escapePaidHtml(s.name) + '</td>' +
        '<td data-label="রোল">' + (s.roll === undefined || s.roll === null ? "" : s.roll) + '</td>' +
        '<td data-label="শ্রেণি">' + escapePaidHtml(s.klass) + '</td>' +
        '<td data-label="বিভাগ">' + escapePaidHtml(s.dept) + '</td>' +
        '<td data-label="শাখা">' + escapePaidHtml(s.section) + '</td>' +
      '</tr>';
  }

  html += '</tbody></table></div>';
  html += '<div class="paid-summary fade-in">মোট সদস্য: ' + students.length + ' জন</div>';

  container.innerHTML = html;
  initPaidFadeIn(container);
});

/* ============================================
   HELPERS (prefixed with "paid" — these names
   must NEVER match globals in js/main.js)
   ============================================ */

function formatPaidDate(d) {
  var months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
}

function escapePaidHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initPaidFadeIn(container) {
  var fadeEls = container.querySelectorAll(".fade-in");
  if (!fadeEls.length) return;

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }
}