/**
 * routine.js — Reads ROUTINE data and renders the weekly schedule table.
 * Handles both desktop table and mobile card views.
 */

document.addEventListener("DOMContentLoaded", function () {
  var routineBody = document.getElementById("routine-body");
  if (routineBody) {
    renderRoutine();
  }
});

/**
 * Renders the routine table from the ROUTINE array defined in data/routine.js.
 */
function renderRoutine() {
  var tbody = document.getElementById("routine-body");
  if (!tbody || typeof ROUTINE === "undefined") return;

  tbody.innerHTML = "";

  ROUTINE.forEach(function (item) {
    var subjectBadgeClass = item.subject === "html" ? "badge-html" : "badge-c";
    var subjectLabel = item.subject === "html" ? "HTML" : "C";

    // Determine zoom link or fallback text
    var zoomCell = "";
    if (item.zoomLink && item.zoomLink.trim() !== "") {
      zoomCell = '<a href="' + escapeHTML(item.zoomLink) + '" target="_blank" rel="noopener" class="btn btn-primary btn-small">Join Zoom</a>';
    } else {
      zoomCell = '<span class="no-link-text">Link will be shared before class</span>';
    }

    var row = '<tr>' +
      '<td data-label="Day">' + escapeHTML(item.day) + '</td>' +
      '<td data-label="Time">' + escapeHTML(item.time) + '</td>' +
      '<td data-label="Subject"><span class="badge ' + subjectBadgeClass + '">' + subjectLabel + '</span></td>' +
      '<td data-label="Topic">' + escapeHTML(item.topic) + '</td>' +
      '<td data-label="Join" class="zoom-link">' + zoomCell + '</td>' +
    '</tr>';

    tbody.insertAdjacentHTML("beforeend", row);
  });
}
