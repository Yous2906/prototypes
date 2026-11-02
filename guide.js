/* Guided tour for the portfolio prototypes.
   Highlights the next thing to click with an amber ring and explains it in a small card.
   Each prototype's steps are keyed by its file name. */
(function () {
  "use strict";

  // ---------- helpers ----------
  function vis(e) {
    if (!e) return false;
    var r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    var s = getComputedStyle(e);
    return s.visibility !== "hidden" && s.display !== "none";
  }
  function q(sel, text) {
    var all = document.querySelectorAll(sel);
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (vis(e) && (!text || e.textContent.indexOf(text) !== -1)) return e;
    }
    return null;
  }
  function startsWith(sel, prefix) {
    var all = document.querySelectorAll(sel);
    for (var i = 0; i < all.length; i++) {
      if (vis(all[i]) && all[i].textContent.trim().indexOf(prefix) === 0) return all[i];
    }
    return null;
  }
  function h1Has(text) {
    var h = document.querySelector("h1");
    return !!h && h.textContent.indexOf(text) !== -1;
  }
  function inOpen(modalSel, pick) {
    var m = document.querySelector(modalSel);
    if (!m || !vis(m)) return null;
    var buttons = Array.prototype.filter.call(m.querySelectorAll("button"), vis);
    return pick(buttons);
  }

  // ---------- tours ----------
  var TOURS = {
    "carrier-payables-workspace": [
      { target: function () { return q("tr", "Invoice vs Rate Con"); },
        text: "Start with a flagged shipment. Click the highlighted row: the trucking company billed $400 more than the agreed rate." },
      { target: function () { return q("button.dtab", "Invoice"); },
        text: "The paperwork sits right next to the comparison, so a clerk never leaves the screen. Open the carrier's invoice." },
      { target: function () { return q("#dsBtn"); },
        text: "Found the overcharge. Click Dispute to send it back to the carrier." },
      { target: function () {
          return inOpen("#ismo", function (b) {
            return b.filter(function (x) { return /cancel|close|×|✕/i.test(x.textContent); })[0] || b[b.length - 1];
          });
        },
        done: function () { var m = document.querySelector("#ismo"); return !m || !m.classList.contains("open"); },
        clickAdvances: false,
        text: "This is the dispute the carrier receives. Close it to carry on." },
      { target: function () { return q("button.ptab", "Disputes"); },
        text: "Every open dispute is tracked in one place. Open the Disputes tab." },
      { target: function () { return q("button.uname"); },
        text: "Now the part users asked for: rules they can change themselves. Open the account menu." },
      { target: function () { return q('[onclick^="goSettings"]'); },
        text: "Choose Settings." },
      { target: function () { return q("[onclick*=\"settingsTab(this,'rules')\"]"); },
        text: "Open Rules Orchestration. Clerks set their own checking rules here, without contacting us." },
      { target: function () { return q("[onclick=\"openRuleModal('profiles')\"]"); },
        text: "Start from a ready-made template for the kind of freight you handle." },
      { final: true,
        text: "That's the core loop: spot the problem, check the paperwork, dispute it, and tune the rules yourself." }
    ],

    "certificates-workspace": [
      { target: function () { return q('.cert[data-cert="c2"]'); },
        text: "Each card is a supplier certificate the AI has already read. Open one." },
      { target: function () { return q('.vtab[data-view="multi"]'); },
        text: "The quality team works in tables, so this does too. Switch to Multi Lot View to compare lots side by side." },
      { target: function () { return q("#pushBtn"); },
        text: "Their job is done when the numbers are in their own system. Click Push to ERP." },
      { target: function () {
          return inOpen("#pushModal", function (b) {
            return b.filter(function (x) { return /push|confirm/i.test(x.textContent); }).pop() || b[b.length - 1];
          });
        },
        text: "One last check before anything is sent, because a wrong figure here is costly. Confirm the push." },
      { target: function () { return q('.vtab[data-view="erp"]'); },
        text: "Open ERP Upload to see exactly where each value landed." },
      { final: true,
        text: "Read the certificate, compare lots, check, push, and keep a record of where everything went." }
    ],

    "operations-dashboard": [
      { target: function () { return q(".phase-card"); },
        text: "The rollout is split into three phases that each pay off on their own. Open phase 1, the freight audit." },
      { target: function () { return q(".nav-item", "Home"); },
        text: "Head back to the overview." },
      { target: function () { return q(".phase-card", "Warehouse"); },
        text: "Phase 2 brings in the warehouse numbers. Open it." },
      { target: function () { return q(".nav-item", "Workforce"); },
        text: "Staffing runs off the same data. Open Workforce." },
      { target: function () { return q(".nav-item", "Client Portal"); },
        text: "Phase 3 gives their own customers a view. Open Client Portal." },
      { final: true,
        text: "Each phase shows value before the next one starts, so the customer never commits to a long rollout up front." }
    ],

    "dual-signup-flow": [
      { target: function () { return q("button.btn-primary", "Create account"); },
        text: "This is what someone trying us out sees, with no invite code in the way. Click Create account." },
      { target: function () { return startsWith("button", "5."); },
        text: "They land in a trial workspace with the full product and a usage meter. Now jump to what happens at the limit." },
      { target: function () { return startsWith("button", "3."); },
        text: "A call booking, not a paywall, and their work carries over. Now the other path: a teammate arriving from an invite link." },
      { final: true,
        text: "One link, two paths. The notes on screen explain each choice, and the Annotations button turns them off." }
    ],

    "teach-an-agent": [
      { target: function () { return q(".start-card.primary"); },
        text: "Instead of integrating with old software, the user shows the agent the job once. Click Record." },
      { target: function () { return q(".rec-stop"); },
        done: function () { return h1Has("A few quick things"); },
        clickAdvances: false,
        text: "The agent says what it is learning as it watches. Let it finish, or click Stop to skip ahead." },
      { target: function () {
          var more = q("button", "everything");
          if (more) return more;
          var msgs = document.querySelectorAll(".chat > .msg:not(.user)");
          var last = msgs[msgs.length - 1];
          if (!last) return null;
          return Array.prototype.filter.call(last.querySelectorAll(".qr"), function (x) {
            return vis(x) && !x.classList.contains("picked");
          })[0] || null;
        },
        done: function () { return !!q("button", "Show me what you learned"); },
        clickAdvances: false,
        text: "It only asks about judgment calls. Pick an answer to each question." },
      { target: function () { return q("button", "Show me what you learned"); },
        text: "See the whole agent summed up in one paragraph." },
      { target: function () { return q(".judgment"); },
        text: "The yellow parts are judgment calls you can change. Click one." },
      { target: function () { return q(".pop .ch"); },
        done: function () { return !q(".pop"); },
        text: "Pick an option." },
      { target: function () { return q("button", "Watch it do one"); },
        text: "Before it goes live, watch it do one real run." },
      { target: function () { return q("button", "Go ahead"); },
        text: "It stops before anything permanent and waits for your OK. Approve it when the button appears." },
      { target: function () { return q("button", "Turn the agent on"); },
        text: "Switch the agent on." },
      { final: true,
        text: "Show it once, answer a few questions, watch one run, then let it work, with a person in control throughout." }
    ]
  };

  var key = location.pathname.split("/").pop().replace(".html", "");
  var steps = TOURS[key];
  if (!steps) return;

  // ---------- UI ----------
  var css = "" +
    ".pg-ring{position:fixed;pointer-events:none;z-index:2147483646;border:3px solid #f59e0b;border-radius:9px;" +
    "box-shadow:0 0 0 4px rgba(245,158,11,.22),0 0 22px rgba(245,158,11,.55);transition:all .18s ease;animation:pgpulse 1.5s ease-in-out infinite}" +
    "@keyframes pgpulse{0%,100%{box-shadow:0 0 0 4px rgba(245,158,11,.22),0 0 18px rgba(245,158,11,.45)}50%{box-shadow:0 0 0 9px rgba(245,158,11,.10),0 0 28px rgba(245,158,11,.7)}}" +
    ".pg-card{position:fixed;bottom:20px;left:20px;width:320px;z-index:2147483647;background:#14161c;color:#f4f4f5;" +
    "border-radius:12px;padding:14px 16px 12px;box-shadow:0 12px 32px rgba(0,0,0,.28);" +
    "font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;transition:left .2s,right .2s}" +
    ".pg-card.pg-right{left:auto;right:20px}" +
    ".pg-step{font-size:11px;font-weight:700;letter-spacing:.06em;color:#fbbf24;margin-bottom:4px;text-transform:uppercase}" +
    ".pg-text{margin:0 0 10px}" +
    ".pg-wait{font-size:12px;color:#a1a1aa;margin:-4px 0 10px}" +
    ".pg-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}" +
    ".pg-btn{all:unset;cursor:pointer;font-size:12.5px;padding:5px 10px;border-radius:6px;background:#27272a;color:#e4e4e7}" +
    ".pg-btn:hover{background:#3f3f46}" +
    ".pg-btn.pg-main{background:#f59e0b;color:#111}" +
    ".pg-btn.pg-main:hover{background:#fbbf24}" +
    ".pg-link{margin-left:auto;font-size:12px;color:#a1a1aa;text-decoration:underline;cursor:pointer}" +
    ".pg-show{all:unset;position:fixed;bottom:20px;left:20px;z-index:2147483647;cursor:pointer;background:#f59e0b;color:#111;" +
    "font:600 13px -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:8px 14px;border-radius:999px;box-shadow:0 6px 18px rgba(0,0,0,.2)}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var ring = document.createElement("div");
  ring.className = "pg-ring";
  var card = document.createElement("div");
  card.className = "pg-card";
  var show = document.createElement("button");
  show.className = "pg-show";
  show.textContent = "Show guided tour";
  show.style.display = "none";

  var idx = 0, hidden = false, scrolledFor = -1, current = null;

  function render() {
    var s = steps[idx];
    var total = steps.length - 1;
    var html = "";
    if (s.final) {
      html += '<div class="pg-step">Tour complete</div><p class="pg-text">' + s.text + "</p>" +
        '<div class="pg-row"><button class="pg-btn pg-main" data-a="back">Back to all prototypes</button>' +
        '<button class="pg-btn" data-a="restart">Start again</button>' +
        '<span class="pg-link" data-a="hide">Close</span></div>';
    } else {
      html += '<div class="pg-step">Guided tour · Step ' + (idx + 1) + " of " + total + "</div>" +
        '<p class="pg-text">' + s.text + "</p>" +
        '<div class="pg-wait" id="pgWait" style="display:none">The highlighted button appears in a moment.</div>' +
        '<div class="pg-row"><button class="pg-btn" data-a="skip">Skip this step</button>' +
        '<span class="pg-link" data-a="hide">Hide tour</span></div>';
    }
    card.innerHTML = html;
  }

  function go(i) {
    idx = Math.max(0, Math.min(i, steps.length - 1));
    scrolledFor = -1;
    render();
  }

  card.addEventListener("click", function (e) {
    var a = e.target.getAttribute && e.target.getAttribute("data-a");
    if (!a) return;
    e.stopPropagation();
    if (a === "skip") go(idx + 1);
    if (a === "restart") { location.reload(); }
    if (a === "back") { location.href = "./"; }
    if (a === "hide") { hidden = true; card.style.display = "none"; ring.style.display = "none"; show.style.display = "block"; }
  });
  show.addEventListener("click", function (e) {
    e.stopPropagation();
    hidden = false; card.style.display = ""; show.style.display = "none";
  });

  // Advance when the highlighted element is clicked.
  document.addEventListener("click", function (e) {
    if (card.contains(e.target) || e.target === show) return;
    var s = steps[idx];
    if (s.final || s.clickAdvances === false || !current) return;
    if (current === e.target || current.contains(e.target)) {
      var at = idx;
      setTimeout(function () { if (idx === at) go(idx + 1); }, 350);
    }
  }, true);

  function tick() {
    var s = steps[idx];
    if (!s.final && s.done && s.done()) { go(idx + 1); s = steps[idx]; }
    current = (!s.final && s.target) ? s.target() : null;
    var wait = document.getElementById("pgWait");
    if (wait) wait.style.display = (!s.final && !current) ? "block" : "none";
    if (hidden || !current) { ring.style.display = "none"; return; }
    if (scrolledFor !== idx) {
      // "nearest" also scrolls inner panels (tables, lists), not just the page.
      scrolledFor = idx;
      current.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    var r = current.getBoundingClientRect();
    ring.style.display = "block";
    ring.style.left = (r.left - 5) + "px";
    ring.style.top = (r.top - 5) + "px";
    ring.style.width = (r.width + 10) + "px";
    ring.style.height = (r.height + 10) + "px";
    // Keep the card from covering the target.
    var nearLeftBottom = r.left < 380 && r.bottom > innerHeight - 220;
    card.classList.toggle("pg-right", nearLeftBottom);
  }

  function start() {
    document.body.appendChild(ring);
    document.body.appendChild(card);
    document.body.appendChild(show);
    render();
    // Update on any page change or click as well as on a timer, because browsers slow timers on background tabs.
    var queued = false;
    function soon() {
      if (queued) return;
      queued = true;
      Promise.resolve().then(function () { queued = false; tick(); });
    }
    function ours(n) { return n === ring || n === show || card.contains(n); }
    new MutationObserver(function (records) {
      // Ignore the guide's own updates, or it would trigger itself forever.
      for (var i = 0; i < records.length; i++) { if (!ours(records[i].target)) { soon(); return; } }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    document.addEventListener("click", function () { setTimeout(tick, 60); setTimeout(tick, 420); });
    setInterval(tick, 200);
    addEventListener("scroll", tick, true);
    addEventListener("resize", tick);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
