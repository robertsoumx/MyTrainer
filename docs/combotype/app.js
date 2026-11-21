"use strict";

const $ = selector => document.querySelector(selector);
const editor = $("#editor");
const worker = new Worker("worker.js");
const pending = new Map();
let sequence = 0;
let ready = false;
let releaseReady;
let rejectReady;
const whenReady = new Promise((resolve, reject) => {
  releaseReady = resolve;
  rejectReady = reject;
});
const options = {
  enabled: true,
  spacing: true,
  capitals: true,
  doubleSpace: true,
  arm: 185,
  gap: 450,
  accent: "#bd3069",
  motion: true,
};
try {
  const saved = JSON.parse(localStorage.getItem("combotype.settings") || "{}");
  for (const key of Object.keys(options)) {
    if (typeof saved[key] === typeof options[key]) options[key] = saved[key];
  }
} catch {
  // Browser storage can be disabled independently of the demo.
}

let engine = { active: false, armed: false };
let writing = {};
let words = [];
let page = 0;
let chain = Promise.resolve();
let generation = 0;
const held = new Set();
let tickPending = false;
let pointerLetter = null;

function showError(error) {
  const label = $("#error");
  label.textContent = error.message || String(error);
  label.hidden = false;
  $("#status").textContent = "Engine unavailable";
}

worker.onmessage = ({ data }) => {
  if (data.ready) {
    ready = true;
    $("#status").textContent = "Ready";
    releaseReady();
    configure().catch(showError);
    return;
  }
  if (data.id) {
    const request = pending.get(data.id);
    pending.delete(data.id);
    if (!request) return;
    if (data.error) request.reject(new Error(data.error));
    else request.resolve(data);
  } else if (data.error) {
    rejectReady(new Error(data.error));
    showError(new Error(data.error));
  }
};
worker.onerror = error => showError(new Error(error.message || "The writing engine could not start."));

async function core(request) {
  await whenReady;
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    worker.postMessage({ id, request });
  });
}

function queue(action) {
  const revision = generation;
  chain = chain.then(() => revision === generation ? action() : undefined).catch(showError);
  return chain;
}

function context() {
  return {
    before: editor.value.slice(0, editor.selectionStart),
    after: editor.value.slice(editor.selectionEnd),
  };
}

function apply(edit) {
  if (!edit) return;
  let start = editor.selectionStart;
  for (let count = 0; count < edit.delete && start > 0; count++) {
    start--;
    if (start > 0 && /[\uDC00-\uDFFF]/.test(editor.value[start])) start--;
  }
  editor.setRangeText(edit.text, start, editor.selectionEnd, "end");
  editor.dispatchEvent(new Event("input", { bubbles: true }));
}

async function typeText(text, revision = generation) {
  const response = await core({
    op: "typed",
    text,
    context: context(),
    state: writing,
    rules: options,
    now: Date.now(),
  });
  if (revision !== generation) return;
  writing = response.state;
  apply(response.edit);
}

async function replay(event, revision) {
  if (event.up) return;
  if (event.vk >= 65 && event.vk <= 90) {
    let letter = String.fromCharCode(event.vk);
    if (Boolean(event.shift) !== Boolean(event.caps)) letter = letter.toUpperCase();
    else letter = letter.toLowerCase();
    await typeText(letter, revision);
  } else if (event.vk === 32) {
    await typeText(" ", revision);
  } else if (event.vk === 13) {
    await typeText("\n", revision);
  }
}

function drawTrail(points) {
  const canvas = $("#trail");
  const rect = canvas.getBoundingClientRect();
  const ratio = devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  if (!options.motion || !points?.length) return;
  const keyboard = $("#keyboard").getBoundingClientRect();
  const row = $(".key-row").getBoundingClientRect();
  const first = $(".key").getBoundingClientRect();
  const unit = row.width / 10;
  const point = ([x, y]) => [
    keyboard.left - rect.left + unit * (x + 0.5),
    first.top - rect.top + first.height / 2 + y * (first.height + 5),
  ];
  ctx.strokeStyle = options.accent;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  points.forEach((position, i) => {
    const [x, y] = point(position);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  const [x, y] = point(points[points.length - 1]);
  ctx.fillStyle = options.accent;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function renderChoices() {
  const list = $("#choices");
  list.replaceChildren();
  for (const [index, word] of words.slice(page * 9, page * 9 + 9).entries()) {
    const button = document.createElement("button");
    button.className = "choice";
    button.setAttribute("role", "listitem");
    const number = document.createElement("span");
    number.className = "number";
    number.textContent = index + 1;
    const label = document.createElement("span");
    label.textContent = word;
    button.append(number, label);
    button.addEventListener("pointerdown", event => event.preventDefault());
    button.addEventListener("click", () => choose(index));
    list.append(button);
  }
  $("#paging").hidden = words.length <= 9;
  $("#page-number").textContent = `${page + 1} / ${Math.ceil(words.length / 9)}`;
  $("#choice-hint").textContent = words.length
    ? "Choose the word you meant."
    : "Pause after gliding to see suggestions.";
}

function updateCapture(response) {
  engine = response;
  $("#finish").disabled = !response.armed;
  $("#cancel").disabled = !response.active && !words.length;
  $("#status").textContent = response.armed
    ? "Gliding"
    : response.active
      ? "Hold to start"
      : words.length
        ? "Choose a word"
        : "Ready";
  drawTrail(response.trail);
}

async function process(response, revision) {
  if (revision !== generation) return;
  for (const event of response.raw || []) {
    await replay(event, revision);
  }
  if (revision !== generation) return;
  if (response.words?.length) {
    words = response.words;
    page = 0;
    renderChoices();
  }
  updateCapture(response);
}

async function eventKey(vk, up, extra = {}) {
  const revision = generation;
  const response = await core({
    op: "event",
    vk,
    up,
    now: Date.now(),
    enabled: options.enabled,
    ...extra,
  });
  await process(response, revision);
  if (!response.used && !up && revision === generation) {
    await replay({ vk, up, ...extra }, revision);
  }
}

function choose(index) {
  const word = words[page * 9 + index];
  if (!word) return;
  words = [];
  renderChoices();
  queue(async () => {
    const revision = generation;
    const response = await core({
      op: "word",
      text: word,
      context: context(),
      rules: options,
      state: writing,
      caps: false,
    });
    if (revision !== generation) return;
    writing = response.state;
    apply(response.edit);
    $("#status").textContent = "Ready";
    $("#cancel").disabled = true;
    editor.focus();
  });
}

function changePage(direction) {
  if (!words.length) return;
  const pages = Math.ceil(words.length / 9);
  page = (page + direction + pages) % pages;
  renderChoices();
}

function cancel() {
  generation++;
  engine = { active: false, armed: false };
  words = [];
  held.clear();
  renderChoices();
  drawTrail([]);
  $("#status").textContent = ready ? "Ready" : "Loading the writing engine…";
  $("#finish").disabled = true;
  $("#cancel").disabled = true;
  queue(() => core({ op: "reset" }));
}

editor.addEventListener("keydown", event => {
  if (!ready || event.isComposing) return;
  if (event.ctrlKey || event.metaKey || event.altKey) {
    cancel();
    writing = {};
    return;
  }
  if (words.length) {
    if (/^[1-9]$/.test(event.key)) {
      event.preventDefault();
      choose(Number(event.key) - 1);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      choose(0);
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      changePage(event.shiftKey ? -1 : 1);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
      return;
    }
    words = [];
    renderChoices();
  }
  if (event.key === "Escape") {
    event.preventDefault();
    cancel();
    return;
  }
  const letter = /^[a-z]$/i.test(event.key);
  if ((letter && !event.shiftKey && options.enabled) || engine.active) {
    const vk = letter ? event.key.toUpperCase().charCodeAt(0)
      : ({ Enter: 13, Escape: 27, " ": 32 })[event.key];
    if (vk) {
      event.preventDefault();
      held.add(event.code);
      queue(() => eventKey(vk, false, {
        repeat: event.repeat,
        shift: event.shiftKey,
        caps: event.getModifierState("CapsLock"),
      }));
      return;
    }
  }
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown", "Tab", "Backspace", "Delete"].includes(event.key)) {
    cancel();
    writing = {};
  }
});

editor.addEventListener("keyup", event => {
  if (!held.delete(event.code)) return;
  event.preventDefault();
  const vk = /^[a-z]$/i.test(event.key)
    ? event.key.toUpperCase().charCodeAt(0)
    : ({ Enter: 13, Escape: 27, " ": 32 })[event.key];
  if (vk) queue(() => eventKey(vk, true));
});

editor.addEventListener("beforeinput", event => {
  if (!ready || event.isComposing) return;
  if (event.inputType === "insertText" && event.data) {
    event.preventDefault();
    queue(() => typeText(event.data));
  } else if (["insertLineBreak", "insertParagraph"].includes(event.inputType)) {
    event.preventDefault();
    queue(() => typeText("\n"));
  } else {
    writing = {};
  }
});

editor.addEventListener("blur", () => {
  cancel();
  writing = {};
});
editor.addEventListener("pointerdown", () => {
  cancel();
  writing = {};
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancel();
});

setInterval(() => {
  if (!ready || !engine.active || tickPending) return;
  tickPending = true;
  queue(async () => {
    try {
      const revision = generation;
      await process(await core({ op: "tick", now: Date.now() }), revision);
    } finally {
      tickPending = false;
    }
  });
}, 35);

$("#previous").addEventListener("pointerdown", event => event.preventDefault());
$("#next").addEventListener("pointerdown", event => event.preventDefault());
$("#previous").addEventListener("click", () => changePage(-1));
$("#next").addEventListener("click", () => changePage(1));
$("#finish").addEventListener("pointerdown", event => event.preventDefault());
$("#cancel").addEventListener("pointerdown", event => event.preventDefault());
$("#finish").addEventListener("click", () => queue(async () => {
  await eventKey(13, false);
  await eventKey(13, true);
}));
$("#cancel").addEventListener("click", cancel);
$("#clear").addEventListener("click", () => {
  cancel();
  editor.value = "";
  writing = {};
  editor.focus();
});

for (const letters of ["qwertyuiop", "asdfghjkl", "zxcvbnm"]) {
  const row = document.createElement("div");
  row.className = "key-row";
  for (const letter of letters) {
    const key = document.createElement("button");
    key.className = "key";
    key.dataset.letter = letter;
    key.textContent = letter.toUpperCase();
    row.append(key);
  }
  $("#keyboard").append(row);
}

function contact(letter, down) {
  if (!letter) return;
  const key = document.querySelector(`[data-letter="${letter}"]`);
  key?.classList.toggle("active", down);
  queue(() => eventKey(letter.toUpperCase().charCodeAt(0), !down));
}

const keyboard = $(".keyboard-wrap");
keyboard.addEventListener("pointerdown", event => {
  const letter = event.target.closest("[data-letter]")?.dataset.letter;
  if (!letter || !ready) return;
  event.preventDefault();
  editor.focus();
  keyboard.setPointerCapture(event.pointerId);
  pointerLetter = letter;
  contact(letter, true);
});
keyboard.addEventListener("pointermove", event => {
  if (!keyboard.hasPointerCapture(event.pointerId)) return;
  const letter = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-letter]")?.dataset.letter || null;
  if (letter === pointerLetter) return;
  contact(pointerLetter, false);
  pointerLetter = letter;
  contact(letter, true);
});
function endPointer(event) {
  if (!keyboard.hasPointerCapture(event.pointerId)) return;
  contact(pointerLetter, false);
  pointerLetter = null;
  keyboard.releasePointerCapture(event.pointerId);
}
keyboard.addEventListener("pointerup", endPointer);
keyboard.addEventListener("pointercancel", event => {
  endPointer(event);
  cancel();
});

function save() {
  try {
    localStorage.setItem("combotype.settings", JSON.stringify(options));
  } catch {
    // The controls remain usable when local storage is unavailable.
  }
}

function color(value) {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return;
  options.accent = value;
  document.documentElement.style.setProperty("--accent", value);
  const rgb = value.slice(1).match(/../g).map(x => parseInt(x, 16));
  const blend = weight => `rgb(${rgb.map(v => Math.round(v * weight + 255 * (1 - weight))).join(" ")})`;
  document.documentElement.style.setProperty("--tint", blend(0.10));
  document.documentElement.style.setProperty("--line", blend(0.23));
  $("#accent").value = value;
  document.querySelectorAll("[data-color]").forEach(button =>
    button.classList.toggle("selected", button.dataset.color === value));
  save();
}

for (const key of ["enabled", "spacing", "capitals", "doubleSpace", "motion"]) {
  $("#" + key).checked = options[key];
  $("#" + key).addEventListener("change", event => {
    options[key] = event.target.checked;
    writing = {};
    save();
    if (key === "enabled") cancel();
  });
}
async function configure() {
  await core({ op: "configure", armMS: options.arm, gapMS: options.gap });
}
for (const key of ["arm", "gap"]) {
  $("#" + key).value = options[key];
  $("#" + key).addEventListener("change", event => {
    const value = Number(event.target.value);
    if (!event.target.checkValidity()) {
      event.target.reportValidity();
      return;
    }
    options[key] = value;
    cancel();
    configure().catch(showError);
    save();
  });
}
$("#accent").addEventListener("input", event => color(event.target.value));
document.querySelectorAll("[data-color]").forEach(button =>
  button.addEventListener("click", () => color(button.dataset.color)));
document.querySelectorAll("[data-page]").forEach(button =>
  button.addEventListener("click", () => {
    document.querySelectorAll(".page").forEach(page =>
      page.hidden = page.id !== button.dataset.page);
    document.querySelectorAll("[data-page]").forEach(tab => {
      tab.classList.toggle("selected", tab === button);
      if (tab === button) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
    cancel();
  }));
color(options.accent);
renderChoices();
