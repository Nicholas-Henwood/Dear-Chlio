/* =========================================================================
   SETTINGS — change this one line.
   Put YOUR WhatsApp number here in full international format, digits only.
   e.g. South Africa 082 123 4567  ->  "27821234567"
   ========================================================================= */
const MY_WHATSAPP = "27000000000";

/* Auto-email delivery via Web3Forms — this key is safe to be public; your
   email address is NOT in the code, it's linked to the key on Web3Forms' side. */
const W3F_ACCESS_KEY = "7a72e783-27fd-4f4b-b787-cc1d9fb30cc1";
const HER_NAME = "Chlio";
/* ========================================================================= */

let animate;
try {
  ({ animate } = await import("https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm"));
} catch (e) {
  animate = (el, keyframes, opts = {}) =>
    el.animate(keyframes, { duration: (opts.duration || 0.4) * 1000, easing: "ease", fill: "both" });
}

const HEART_SVG =
  '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 21s-6.7-4.35-9.3-8.04C1 10.5 1.6 7.3 4.2 6.1c1.9-.9 4 .1 4.9 1.7l.9 1.5.9-1.5c.9-1.6 3-2.6 4.9-1.7 2.6 1.2 3.2 4.4 1.5 6.86C18.7 16.65 12 21 12 21z"/></svg>';

(function loadPhoto() {
  const img = document.getElementById("usPhoto");
  if (!img) return;
  const candidates = [
    "images/chlio.svg", "images/chlio.jpg", "images/chlio.jpeg", "images/chlio.png",
    "images/us.jpg", "images/us.jpeg", "images/us.png",
  ];
  let i = 0;
  img.onerror = () => {
    i++;
    if (i < candidates.length) img.src = candidates[i];
    else img.closest(".photo").style.display = "none";
  };
  img.src = candidates[0];
})();

(function floatingHearts() {
  const layer = document.getElementById("hearts");
  if (!layer) return;
  const COUNT = 14;
  for (let i = 0; i < COUNT; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.innerHTML = HEART_SVG;
    const size = 12 + Math.random() * 22;
    h.style.width = size + "px";
    h.style.height = size + "px";
    h.style.left = Math.random() * 100 + "vw";
    h.style.setProperty("--sway", (Math.random() * 60 - 30) + "px");
    h.style.setProperty("--peak", (0.25 + Math.random() * 0.4).toFixed(2));
    h.style.animationDuration = 9 + Math.random() * 11 + "s";
    h.style.animationDelay = -Math.random() * 18 + "s";
    layer.appendChild(h);
  }
})();

const plan = { date: "", activity: "", food: "" };
const steps = document.querySelectorAll(".step");

function goTo(name) {
  steps.forEach((s) => s.classList.remove("step--active"));
  const next = document.querySelector(`.step[data-step="${name}"]`);
  next.classList.add("step--active");
  animate(next, { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] },
          { duration: 0.5, easing: [0.22, 1, 0.36, 1] });
  document.getElementById("card").classList.toggle("is-date", name === "done");
  if (name === "done") { buildSummary(); celebrate(); sendPlanEmail(); }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

yesBtn.addEventListener("click", () => {
  heartBurst(yesBtn);
  yesBtn.style.visibility = "hidden";
  setTimeout(() => { yesBtn.remove(); goTo("date"); }, 260);
});

let yesScale = 1;
let noScale = 1;
let baseW = 0, baseH = 0;

function tempt() {
  if (!yesBtn.classList.contains("btn--escaped")) {
    const r = yesBtn.getBoundingClientRect();
    baseW = r.width; baseH = r.height;
    document.body.appendChild(yesBtn);
    yesBtn.classList.add("btn--escaped");
  }

  const vw = window.visualViewport?.width || window.innerWidth;
  const vh = window.visualViewport?.height || window.innerHeight;
  const maxScale = Math.min((vw * 0.94) / baseW, (vh * 0.92) / baseH);

  yesScale = Math.min(yesScale + 0.35, maxScale);
  noScale = Math.max(noScale - 0.07, 0.55);

  const yesT = `translate(-50%, -50%) scale(${yesScale})`;
  animate(yesBtn, { transform: yesT }, { duration: 0.3, easing: [0.34, 1.4, 0.64, 1] });
  animate(noBtn, { transform: `scale(${noScale})` }, { duration: 0.3, easing: [0.34, 1.4, 0.64, 1] });
  yesBtn.style.transform = yesT;
  noBtn.style.transform = `scale(${noScale})`;
}
noBtn.addEventListener("mouseover", tempt);
noBtn.addEventListener("click", (e) => { e.preventDefault(); tempt(); });

function heartBurst(originEl) {
  const r = originEl.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const N = 18;
  for (let i = 0; i < N; i++) {
    const s = document.createElement("span");
    s.className = "burst-heart";
    s.innerHTML = HEART_SVG;
    const size = 14 + Math.random() * 18;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = cx + "px";
    s.style.top = cy + "px";
    document.body.appendChild(s);

    const angle = (Math.PI * 2 * i) / N + Math.random() * 0.5;
    const dist = 90 + Math.random() * 140;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 60;

    animate(s,
      { transform: ["translate(-50%,-50%) scale(.4)", `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.1)`],
        opacity: [1, 0] },
      { duration: 0.9 + Math.random() * 0.4, easing: [0.2, 0.7, 0.3, 1] }
    );
    setTimeout(() => s.remove(), 1500);
  }
}

function celebrate() {
  const card = document.getElementById("card");
  setTimeout(() => heartBurst(card), 150);
}

const dateInput = document.getElementById("dateInput");
dateInput.min = new Date().toISOString().split("T")[0];

function wireChoices(gridId, otherInputId, key) {
  const grid = document.getElementById(gridId);
  const other = document.getElementById(otherInputId);
  grid.querySelectorAll(".choice").forEach((btn) => {
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".choice").forEach((b) => b.classList.remove("choice--selected"));
      btn.classList.add("choice--selected");
      animate(btn, { transform: ["scale(1)", "scale(1.06)", "scale(1)"] }, { duration: 0.32 });
      if (btn.dataset.value === "__other__") {
        other.classList.remove("field--hidden");
        other.focus();
        plan[key] = other.value.trim();
      } else {
        other.classList.add("field--hidden");
        plan[key] = btn.dataset.value;
      }
    });
  });
  other.addEventListener("input", () => { plan[key] = other.value.trim(); });
}
wireChoices("activityGrid", "activityOther", "activity");
wireChoices("foodGrid", "foodOther", "food");

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const need = btn.dataset.require;
    if (need === "date") {
      if (!dateInput.value) return nudge(btn);
      plan.date = dateInput.value;
    }
    if (need === "activity" && !plan.activity) return nudge(btn);
    if (need === "food" && !plan.food) return nudge(btn);
    goTo(btn.dataset.next);
  });
});
function nudge(btn) {
  animate(btn, { transform: ["translateX(0)", "translateX(-7px)", "translateX(7px)", "translateX(0)"] },
          { duration: 0.28 });
}

document.addEventListener("click", (e) => {
  const back = e.target.closest("[data-back]");
  if (back) { e.preventDefault(); goTo(back.dataset.back); }
});

function prettyDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function messageText() {
  return (
    `Hey, it's a yes! ♥\n` +
    `Our date plan:\n` +
    `📅 ${prettyDate(plan.date)}\n` +
    `🎯 ${plan.activity}\n` +
    `🍽️ ${plan.food}\n` +
    `— ${HER_NAME}`
  );
}

function buildSummary() {
  try { localStorage.setItem("chlio-date-plan", JSON.stringify(plan)); } catch (e) {}
  document.getElementById("summary").innerHTML =
    `📅 <span class="lbl">When</span> &nbsp;<b>${prettyDate(plan.date)}</b><br>` +
    `🎯 <span class="lbl">Doing</span> &nbsp;<b>${plan.activity}</b><br>` +
    `🍽️ <span class="lbl">Eating</span> &nbsp;<b>${plan.food}</b>`;
}

function sendPlanEmail() {
  const payload = {
    access_key: W3F_ACCESS_KEY,
    subject: `New date plan for ${HER_NAME}`,
    from_name: "Date Page",
    message: messageText(),
  };

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

const whatsappBtn = document.getElementById("whatsappBtn");
const copyBtn = document.getElementById("copyBtn");
const copiedMsg = document.getElementById("copiedMsg");

whatsappBtn.addEventListener("click", () => {
  const url = `https://wa.me/${MY_WHATSAPP}?text=${encodeURIComponent(messageText())}`;
  whatsappBtn.href = url;
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(messageText());
    copiedMsg.textContent = "Copied — send it over when you’re ready 💛";
  } catch (e) {
    copiedMsg.textContent = "Copy failed — you can still grab it from the screen.";
  }
});
