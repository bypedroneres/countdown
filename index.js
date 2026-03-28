const DEFAULT_CONFIG = {
  targetDate: "2026-12-31T23:59",
  backgroundColor: "#000000",
  fontColor: "#ffffff"
};

const THEMES = {
  black: { backgroundColor: "#000000", fontColor: "#fff" },
  bubblegum: { backgroundColor: "#f7a1c4", fontColor: "#fff" },
  lofi: { backgroundColor: "#b8a1d9", fontColor: "#fff" },
  aqua: { backgroundColor: "#9ec3da", fontColor: "#fff" },
  mint: { backgroundColor: "#9fd3c7", fontColor: "#fff" },
  brasil: { backgroundColor: "#285f22", fontColor: "#ffdd00" },
  white: { backgroundColor: "#fff", fontColor: "#000" }
};

let CONFIG = JSON.parse(localStorage.getItem("countdown-config")) || DEFAULT_CONFIG;

/* APPLY STYLES */
function applyStyles() {
  document.body.style.background = CONFIG.backgroundColor;
  document.querySelector(".app").style.color = CONFIG.fontColor;

  document.getElementById("bg-preview").style.background = CONFIG.backgroundColor;
  document.getElementById("font-preview").style.background = CONFIG.fontColor;
}

applyStyles();

/* HELPERS */
function pad(n) {
  return String(n).padStart(2, "0");
}

/* COUNTDOWN (NOW ALSO COUNTS UP AFTER ZERO) */
function update() {
  const now = new Date();
  const target = new Date(CONFIG.targetDate + ":00");

  let diff = target - now;
  const isPast = diff < 0;

  // convert to positive so math works both ways
  diff = Math.abs(diff);

  const total = Math.floor(diff / 1000);

  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  document.getElementById("days").innerText = pad(days);
  document.getElementById("hours").innerText = pad(hours);
  document.getElementById("minutes").innerText = pad(minutes);
  document.getElementById("seconds").innerText = pad(seconds);

  // OPTIONAL label (add <div id="label"></div> in HTML if you want this)
  const label = document.getElementById("label");
  if (label) {
    label.innerText = isPast ? "ago" : "left";
  }

  // OPTIONAL: trigger once when it passes zero
  if (!window.hasPassed && isPast) {
    window.hasPassed = true;
    console.log("Reached target date");
  }
}

setInterval(update, 1000);
update();

/* SETTINGS */
const btn = document.getElementById("settings-btn");
const panel = document.getElementById("settings-panel");

let hideTimeout;
let isPanelOpen = false;

function showUI() {
  btn.classList.add("visible");
  if (isPanelOpen) return;

  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => btn.classList.remove("visible"), 5000);
}

function hideUI() {
  if (!isPanelOpen) btn.classList.remove("visible");
}

document.addEventListener("click", (e) => {
  if (panel.contains(e.target) || btn.contains(e.target)) return;

  btn.classList.contains("visible") ? hideUI() : showUI();

  if (isPanelOpen) closePanel();
});

btn.addEventListener("click", (e) => {
  e.stopPropagation();
  isPanelOpen ? closePanel() : openPanel();
});

function openPanel() {
  panel.classList.add("visible");
  btn.classList.add("visible");
  isPanelOpen = true;
  clearTimeout(hideTimeout);
}

function closePanel() {
  panel.classList.remove("visible");
  isPanelOpen = false;
  showUI();
}

panel.addEventListener("click", (e) => e.stopPropagation());

/* INPUTS */
const bgInput = document.getElementById("input-bg-color");
const fontInput = document.getElementById("input-font-color");

bgInput.value = CONFIG.backgroundColor;
fontInput.value = CONFIG.fontColor;
document.getElementById("input-date").value = CONFIG.targetDate;

/* COLOR PICKER POSITION */
function openColorPicker(input, e) {
  input.style.position = "fixed";
  input.style.left = `${e.clientX - 20}px`;
  input.style.top = `${e.clientY - 20}px`;
  input.click();
}

document.getElementById("bg-row").addEventListener("click", (e) => {
  openColorPicker(bgInput, e);
});

document.getElementById("font-row").addEventListener("click", (e) => {
  openColorPicker(fontInput, e);
});

/* LIVE UPDATE */
bgInput.addEventListener("input", (e) => {
  CONFIG.backgroundColor = e.target.value;
  applyStyles();
});

fontInput.addEventListener("input", (e) => {
  CONFIG.fontColor = e.target.value;
  applyStyles();
});

/* THEMES */
document.querySelectorAll(".theme").forEach(el => {
  el.onclick = () => {
    const theme = THEMES[el.dataset.theme];
    if (!theme) return;

    CONFIG.backgroundColor = theme.backgroundColor;
    CONFIG.fontColor = theme.fontColor;

    bgInput.value = theme.backgroundColor;
    fontInput.value = theme.fontColor;

    applyStyles();
    localStorage.setItem("countdown-config", JSON.stringify(CONFIG));
  };
});

/* SAVE */
document.getElementById("save-btn").onclick = () => {
  const dateValue = document.getElementById("input-date").value;
  if (dateValue) CONFIG.targetDate = dateValue;

  localStorage.setItem("countdown-config", JSON.stringify(CONFIG));
  closePanel();
};