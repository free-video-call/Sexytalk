/* ============================================================
   script.js
   -------------------------------------------------------------
   Behavior only. Reads the global APP object defined in
   app-config.js and renders every piece of content from it.
   Never hardcode app data here — edit app-config.js instead.
   ============================================================ */

(function () {
  "use strict";

  // Bail out safely if app-config.js wasn't loaded for some reason.
  if (typeof APP === "undefined") {
    console.error("APP config not found. Make sure app-config.js is loaded before script.js.");
    return;
  }

  /* ---------- Small helpers ---------- */

  // Build an inline star SVG, reused wherever a filled star is needed.
  function starSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.innerHTML =
      '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
    return svg;
  }

  // Checkmark / warning icons for the Data Safety list.
  function safetyIcon(safe) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("safety-icon", safe ? "safe" : "unsafe");
    svg.innerHTML = safe
      ? '<path d="M20 6 9 17l-5-5"/>'                                   // check
      : '<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'; // warning triangle
    return svg;
  }

  /* ---------- Render: header / identity ---------- */

  function renderIdentity(app) {
    document.title = app.name + " — " + app.developer;

    const icon = document.getElementById("appIcon");
    icon.src = app.icon;
    icon.alt = app.name + " app icon";

    document.getElementById("appName").textContent = app.name;

    const dev = document.getElementById("appDev");
    dev.textContent = app.developer;
    dev.setAttribute("aria-label", "Developer: " + app.developer);

    document.getElementById("appCategory").textContent = app.category;
  }

  /* ---------- Render: stats row ---------- */

  function renderStats(app) {
    document.getElementById("statRating").textContent = app.rating;
    document.getElementById("statReviews").textContent = app.reviews + " reviews";
    document.getElementById("statDownloads").textContent = app.downloads;
    document.getElementById("statAge").textContent = app.age;
    document.getElementById("statSize").textContent = app.size;
  }

  /* ---------- Render: install button ---------- */

  function renderInstall(app) {
    const btn = document.getElementById("installBtn");
    btn.textContent = app.installText;
    btn.href = app.installUrl;
    btn.setAttribute("aria-label", app.installText + " " + app.name);
  }

  /* ---------- Render: screenshots (exactly 4) ---------- */

  function renderScreenshots(app) {
    const scroller = document.getElementById("shotsScroller");
    scroller.innerHTML = "";

    app.screenshots.slice(0, 4).forEach(function (src, i) {
      const card = document.createElement("div");
      card.className = "shot-card";

      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = app.name + " screenshot " + (i + 1);
      // Broken image paths shouldn't crash the layout — just fade the tile.
      img.onerror = function () {
        card.style.opacity = "0.35";
      };

      card.appendChild(img);
      scroller.appendChild(card);
    });
  }

  /* ---------- Render: about ---------- */

  function renderAbout(app) {
    const textEl = document.getElementById("aboutText");
    const toggleBtn = document.getElementById("aboutToggle");
    textEl.textContent = app.description;

    // Only show the "Read more" toggle if the text actually overflows
    // the 4-line clamp once it's laid out.
    requestAnimationFrame(function () {
      const overflowing = textEl.scrollHeight > textEl.clientHeight + 1;
      toggleBtn.style.display = overflowing ? "inline-block" : "none";
    });

    toggleBtn.addEventListener("click", function () {
      const expanded = textEl.classList.toggle("expanded");
      toggleBtn.textContent = expanded ? "Read less" : "Read more";
    });
  }

  /* ---------- Render: data safety ---------- */

  function renderDataSafety(app) {
    const list = document.getElementById("safetyList");
    list.innerHTML = "";

    (app.dataSafety || []).forEach(function (item) {
      const li = document.createElement("li");
      li.className = "safety-item";

      const icon = safetyIcon(item.safe);
      const label = document.createElement("span");
      label.textContent = item.label;

      li.appendChild(icon);
      li.appendChild(label);
      list.appendChild(li);
    });
  }

  /* ---------- Render: ratings & reviews ---------- */

  function renderRatings(app) {
    document.getElementById("ratingBigNum").textContent = app.rating;
    document.getElementById("ratingBigCount").textContent = app.reviews + " reviews";

    const starsWrap = document.getElementById("ratingStars");
    starsWrap.innerHTML = "";
    const filled = Math.round(parseFloat(app.rating) || 0);
    for (let i = 0; i < 5; i++) {
      const s = starSvg();
      s.style.opacity = i < filled ? "1" : "0.25";
      starsWrap.appendChild(s);
    }

    const barsWrap = document.getElementById("ratingBars");
    barsWrap.innerHTML = "";
    const breakdown = app.ratingBreakdown || [0, 0, 0, 0, 0];

    for (let star = 5; star >= 1; star--) {
      const pct = breakdown[5 - star] || 0;

      const row = document.createElement("div");
      row.className = "bar-row";

      const label = document.createElement("span");
      label.textContent = String(star);

      const track = document.createElement("span");
      track.className = "bar-track";

      const fill = document.createElement("span");
      fill.className = "bar-fill";
      track.appendChild(fill);

      row.appendChild(label);
      row.appendChild(track);
      barsWrap.appendChild(row);

      // Animate the bar fill in on the next frame rather than at 0/100
      // instantly, matching the "smooth animation" requirement.
      requestAnimationFrame(function () {
        fill.style.width = pct + "%";
      });
    }
  }

  /* ---------- Sticky header shadow on scroll ---------- */

  function bindHeaderScroll() {
    const header = document.getElementById("appHeader");
    window.addEventListener(
      "scroll",
      function () {
        header.classList.toggle("scrolled", window.scrollY > 4);
      },
      { passive: true }
    );
  }

  /* ---------- Boot ---------- */

  function init() {
    renderIdentity(APP);
    renderStats(APP);
    renderInstall(APP);
    renderScreenshots(APP);
    renderAbout(APP);
    renderDataSafety(APP);
    renderRatings(APP);
    bindHeaderScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
