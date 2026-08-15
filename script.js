/* ==========================================================
   EDIT ME — all your content lives in these data blocks.
   Change skills/projects here; the page renders them automatically.
   ========================================================== */

const currentlyLearning = ["Advanced SQL", "Spring Boot", "Backend Development", "REST APIs"];

const skillGroups = [
  { category: "languages", tags: ["C++", "Java", "C", "Python"] },
  { category: "backend & databases", tags: ["MySQL", "DBMS", "SQL (advanced)", "Spring Boot"] },
  { category: "web development", tags: ["HTML", "CSS", "JavaScript"] },
  { category: "core cs", tags: ["Data Structures", "Algorithms", "OOP", "Problem Solving"] },
  { category: "research & analysis", tags: ["Data Analysis", "Data Collection", "Quantitative Analysis", "MS Office"] },
  { category: "toolkit", tags: ["Git", "GitHub", "VS Code", "IntelliJ IDEA", "CLion"] },
  { category: "soft skills", tags: ["Teamwork", "Time Management", "Analytical Thinking"] },
];

const projects = [
  {
    title: "Library Management System",
    status: "completed",
    description:
      "A console-based library management system implementing full CRUD operations across books, members, and issue/return handling. Built on a normalized MySQL schema (3NF) with primary/foreign key constraints and transactions to prevent duplicate issues and maintain data integrity across linked tables.",
    tags: ["C++", "MySQL"],
    repoUrl: "#", // EDIT: link to the GitHub repo once it exists
    liveUrl: null,
  },
  {
    title: "Personal Portfolio Website",
    status: "live",
    description:
      "A fully responsive personal portfolio site showcasing projects, skills, and resume, optimized for both mobile and desktop viewports. Hosted live on GitHub Pages with a clean, fast-loading, mobile-friendly layout.",
    tags: ["HTML", "CSS", "JavaScript"],
    repoUrl: "#", // EDIT: link to this repo
    liveUrl: "#", // EDIT: link to the live deployed site
  },
  {
    title: "Backend REST API with Spring Boot & MySQL",
    status: "in progress",
    description:
      "A REST API backend with authentication, pagination, and CRUD endpoints, applying advanced SQL concepts from ongoing coursework. Expected completion: October 2026.",
    tags: ["Java", "Spring Boot", "MySQL"],
    repoUrl: "#", // EDIT: link to the GitHub repo once it exists
    liveUrl: null,
  },
];

/* ==========================================================
   RENDER: currently-learning badges
   ========================================================== */
function renderBadges() {
  const el = document.getElementById("learningBadges");
  el.innerHTML = currentlyLearning
    .map((item) => `<li class="badge">${item}</li>`)
    .join("");
}

/* ==========================================================
   RENDER: skills grid
   ========================================================== */
function renderSkills() {
  const el = document.getElementById("skillsGrid");
  el.innerHTML = skillGroups
    .map(
      (group) => `
      <div class="skill-card">
        <h3>${group.category}</h3>
        <div class="tag-list">
          ${group.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>`
    )
    .join("");
}

/* ==========================================================
   RENDER: project cards
   ========================================================== */
function renderProjects() {
  const el = document.getElementById("projectsGrid");
  el.innerHTML = projects
    .map(
      (p) => `
      <div class="project-card">
        <span class="project-status">${p.status}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tag-list">
          ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="project-links">
          <a href="${p.repoUrl}" target="_blank" rel="noopener">source</a>
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener">live</a>` : ""}
        </div>
      </div>`
    )
    .join("");
}

/* ==========================================================
   HERO TERMINAL — typed intro
   ========================================================== */
const terminalLines = [
  { type: "prompt", text: "whoami" },
  { type: "output", text: "<strong>Brijesh Kumar Gaur</strong> — B.Tech ECE, NIT Srinagar" },
  { type: "prompt", text: "cat focus.txt" },
  { type: "output", text: "C++ &amp; DSA \u2192 SQL &amp; databases \u2192 backend systems" },
  { type: "prompt", text: "status --current" },
  { type: "output", text: "Advanced SQL &amp; Spring Boot (in progress), expected Oct 2026" },
];

function typeTerminal() {
  const body = document.getElementById("terminalBody");
  body.innerHTML = "";
  let lineIndex = 0;

  function nextLine() {
    if (lineIndex >= terminalLines.length) {
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      body.appendChild(cursor);
      return;
    }
    const line = terminalLines[lineIndex];
    const div = document.createElement("div");
    div.className = "terminal-line";

    if (line.type === "prompt") {
      div.innerHTML = `<span class="terminal-prompt">$</span> `;
      body.appendChild(div);
      typeText(div, line.text, () => {
        lineIndex++;
        setTimeout(nextLine, 250);
      });
    } else {
      div.className += " terminal-output";
      div.innerHTML = line.text;
      div.style.opacity = "0";
      body.appendChild(div);
      requestAnimationFrame(() => {
        div.style.transition = "opacity 0.4s ease";
        div.style.opacity = "1";
      });
      lineIndex++;
      setTimeout(nextLine, 450);
    }
  }

  function typeText(container, text, done) {
    let i = 0;
    const plain = text;
    const interval = setInterval(() => {
      container.innerHTML =
        `<span class="terminal-prompt">$</span> ` + plain.slice(0, i + 1);
      i++;
      if (i >= plain.length) {
        clearInterval(interval);
        done();
      }
    }, 28);
  }

  nextLine();
}

/* ==========================================================
   NAV: mobile toggle + close on link click
   ========================================================== */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ==========================================================
   SCROLL REVEAL for sections
   ========================================================== */
function initScrollReveal() {
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach((s) => observer.observe(s));
}

/* ==========================================================
   THEME TOGGLE
   Note: kept in-memory (resets on reload) so it works safely
   in any preview environment. Once this is deployed as a real
   site, you can persist it with localStorage — set/read a
   "theme" key in the toggle handler below.
   ========================================================== */
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  btn.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    document.documentElement.setAttribute("data-theme", isLight ? "dark" : "light");
  });
}

/* ==========================================================
   CONTACT FORM VALIDATION
   This is a static site with no backend, so this only validates
   and shows feedback. To actually receive messages once deployed,
   wire the form action to a service like Formspree or EmailJS.
   ========================================================== */
function initContactForm() {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const status = document.getElementById("formStatus");

    let valid = true;
    valid = validateField(name, document.getElementById("nameError"),
      name.value.trim().length > 0, "Name is required.") && valid;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    valid = validateField(email, document.getElementById("emailError"),
      emailOk, "Enter a valid email.") && valid;

    valid = validateField(message, document.getElementById("messageError"),
      message.value.trim().length >= 10, "Message should be at least 10 characters.") && valid;

    if (!valid) {
      status.textContent = "";
      return;
    }

    status.textContent = "Message looks good — connect this form to Formspree/EmailJS to actually send it.";
    form.reset();
  });
}

function validateField(input, errorEl, isValid, message) {
  input.classList.toggle("invalid", !isValid);
  errorEl.textContent = isValid ? "" : message;
  return isValid;
}

/* ==========================================================
   INIT
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderBadges();
  renderSkills();
  renderProjects();
  typeTerminal();
  initNav();
  initScrollReveal();
  initThemeToggle();
  initContactForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});
