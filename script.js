/* Progressive enhancements; factual portfolio content remains readable in HTML. */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTheme();
  initProjectFilters();
  initEmailCopy();
  initActiveSection();
  initScrollControls();
  initTerminal();
  initComingSoonLinks();
  initSkillTooltips();
  initMotionEffects();

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});

function initNavigation() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  function setOpen(isOpen) {
    links.classList.toggle("open", isOpen);
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  }

  setOpen(false);
  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  links.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!links.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  const desktop = window.matchMedia("(min-width: 801px)");
  const resetOnResize = () => setOpen(false);
  if (desktop.addEventListener) desktop.addEventListener("change", resetOnResize);
  else desktop.addListener(resetOnResize);
}

function initTheme() {
  const button = document.getElementById("themeToggle");
  if (!button) return;

  const root = document.documentElement;
  let theme = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") theme = savedTheme;
  } catch {
    // The toggle still works when storage is unavailable.
  }

  function applyTheme(nextTheme) {
    theme = nextTheme;
    root.setAttribute("data-theme", theme);
    button.setAttribute("aria-pressed", String(theme === "light"));
    button.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
  }

  applyTheme(theme);
  button.addEventListener("click", () => {
    applyTheme(theme === "light" ? "dark" : "light");
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Keep the selected theme for this visit even if it cannot be saved.
    }
  });
}

function initProjectFilters() {
  const buttons = [...document.querySelectorAll(".filter-btn[data-filter]")];
  const cards = [...document.querySelectorAll(".project-card[data-category]")];
  const count = document.getElementById("projectCount");
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    let visibleCount = 0;
    cards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category.split(/\s+/).includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    buttons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("active", active);
    });
    if (count) {
      const noun = visibleCount === 1 ? "project" : "projects";
      const label = { "full-stack": "full-stack", backend: "backend", cpp: "C++" }[filter] || filter;
      count.textContent = filter === "all"
        ? `Showing all ${visibleCount} ${noun}`
        : `Showing ${visibleCount} ${label} ${noun}`;
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter));
  });
  applyFilter("all");
}

function initEmailCopy() {
  const button = document.getElementById("copyEmail");
  const status = document.getElementById("copyStatus");
  if (!button || !status) return;

  button.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText("brijesh_2024bece90@nitsri.ac.in");
      status.textContent = "Email address copied.";
    } catch {
      status.textContent = "Could not copy automatically. Select the email address to copy it, or use the email link.";
    }
  });
}

function initActiveSection() {
  if (!("IntersectionObserver" in window)) return;
  const links = [...document.querySelectorAll('#navLinks a[href^="#"]')];
  const sections = [...document.querySelectorAll("main section[id]")].filter((section) =>
    links.some((link) => link.getAttribute("href") === `#${section.id}`)
  );
  if (!sections.length) return;

  const visibleSections = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
      else visibleSections.delete(entry.target.id);
    });
    const active = [...visibleSections].sort((a, b) => b[1] - a[1])[0];
    links.forEach((link) => {
      const isActive = Boolean(active && link.getAttribute("href") === `#${active[0]}`);
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

  sections.forEach((section) => observer.observe(section));
}

function initScrollControls() {
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  let scheduled = false;

  function update() {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const fraction = maxScroll ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    if (progress) progress.style.transform = `scaleX(${fraction})`;
    if (backToTop) backToTop.hidden = window.scrollY <= 600;
    scheduled = false;
  }

  function scheduleUpdate() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(scheduleUpdate).observe(document.body);
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });
    });
  }
  update();
}

function initTerminal() {
  const form = document.getElementById("terminalForm");
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");
  if (!form || !input || !output) return;

  const commands = {
    help: "Available commands: whoami, skills, projects, contact, clear, help",
    whoami: "Brijesh Kumar Gaur\nSoftware Engineering Intern | Backend & Full-Stack Development\nB.Tech ECE, NIT Srinagar · Expected Jun 2028 · CGPA 7.071/10\nSrinagar, J&K, India\nSeeking a Software Development Engineer internship.",
    skills: "Languages: C++, Java, JavaScript, TypeScript, Python, SQL\nBackend: Node.js, Express.js, REST APIs, JWT, HttpOnly cookie auth\nFrontend: React, Next.js, HTML, CSS, Tailwind\nDatabases & tools: MongoDB, Mongoose, PostgreSQL, Git, GitHub, Postman\nCore concepts: DSA, OOP, MVC, RBAC, database transactions, idempotency",
    projects: "01  Vault – Banking System · Oct 2026–Present\n02  ParkSarthi – Parking Marketplace · Sep 2026–Present\n03  Fleet Vision – SIH 2026, Team InnoVibe · Jun–Aug 2026\n04  SocialNet Engine Simulator · Mar–May 2026\nExplore the Projects section for details. Project links are coming soon.",
    contact: "Email: brijesh_2024bece90@nitsri.ac.in\nPhone: +91 9320656615\nCodeforces / LeetCode: dominator_45\nFind GitHub and LinkedIn in the Contact section."
  };

  function appendLine(text, className) {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    line.style.whiteSpace = "pre-wrap";
    output.appendChild(line);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const raw = input.value.trim().slice(0, 120);
    if (!raw) return;
    const command = raw.toLowerCase();
    input.value = "";
    if (command === "clear") {
      output.replaceChildren();
    } else {
      appendLine(`$ ${raw}`, "terminal-command");
      const response = Object.prototype.hasOwnProperty.call(commands, command)
        ? commands[command]
        : `Command not found: ${raw}. Type "help" for available commands.`;
      appendLine(response, "terminal-response");
      while (output.children.length > 40) output.firstElementChild.remove();
      output.scrollTop = output.scrollHeight;
    }
    input.focus({ preventScroll: true });
  });
}

function initComingSoonLinks() {
  const status = document.getElementById("linkStatus");
  document.querySelectorAll("a[data-coming-soon]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (status) status.textContent = "Link coming soon — this project URL has not been added yet.";
    });
  });
}

function initSkillTooltips() {
  document.querySelectorAll(".skill-chip").forEach((chip, index) => {
    const tooltip = chip.querySelector(".skill-tooltip");
    if (!tooltip) return;
    tooltip.id = `skill-tip-${index}`;
    chip.setAttribute("aria-describedby", tooltip.id);
    const place = () => {
      const bounds = chip.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const width = Math.min(210, viewportWidth - 40);
      const left = Math.max(12, Math.min(bounds.left, viewportWidth - width - 12));
      tooltip.style.width = `${width}px`;
      tooltip.style.maxWidth = "none";
      tooltip.style.left = `${left - bounds.left}px`;
      tooltip.style.right = "auto";
    };
    chip.addEventListener("pointerenter", place);
    chip.addEventListener("focus", place);
    window.addEventListener("resize", place, { passive: true });
  });
}

function watchMedia(query, listener) {
  if (query.addEventListener) {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }
  query.addListener(listener);
  return () => query.removeListener(listener);
}

function initMotionEffects() {
  let cleanups = [];
  function refresh() {
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [initTyping, initReveals, initCounters, initParticles, initPointerEffects]
      .map((initialize) => initialize(reducedMotion.matches));
  }
  refresh();
  watchMedia(reducedMotion, refresh);
}

function initTyping(reduce) {
  const target = document.getElementById("typedRole");
  if (!target) return () => {};
  const roles = ["Backend Developer", "Full-Stack Developer", "Problem Solver"];
  let roleIndex = 0;
  let character = roles[0].length;
  let deleting = true;
  let timer;
  target.textContent = roles[0];
  if (reduce) return () => {};

  function tick() {
    const role = roles[roleIndex];
    character += deleting ? -1 : 1;
    target.textContent = role.slice(0, character);
    let delay = deleting ? 42 : 78;
    if (deleting && character === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 280;
    } else if (!deleting && character === role.length) {
      deleting = true;
      delay = 1900;
    }
    timer = window.setTimeout(tick, delay);
  }

  function handleVisibility() {
    clearTimeout(timer);
    if (!document.hidden) timer = window.setTimeout(tick, 500);
  }
  if (!document.hidden) timer = window.setTimeout(tick, 1900);
  document.addEventListener("visibilitychange", handleVisibility);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", handleVisibility);
    target.textContent = roles[0];
  };
}

function initReveals(reduce) {
  const elements = [...document.querySelectorAll(".reveal")];
  const root = document.documentElement;
  if (reduce || !("IntersectionObserver" in window)) {
    root.classList.remove("js-reveal");
    elements.forEach((element) => element.classList.add("is-visible"));
    return () => {};
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
  elements.forEach((element) => observer.observe(element));
  root.classList.add("js-reveal");
  return () => {
    observer.disconnect();
    root.classList.remove("js-reveal");
    elements.forEach((element) => element.classList.add("is-visible"));
  };
}

function initCounters(reduce) {
  const elements = [...document.querySelectorAll("[data-count]")];
  const frames = new Map();
  const format = (value) => value.toLocaleString();
  const finish = (element) => {
    const value = Number(element.dataset.count);
    if (Number.isFinite(value)) element.textContent = format(value);
  };
  elements.forEach(finish);
  if (reduce || !("IntersectionObserver" in window)) return () => {};

  function animate(element) {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target) || element.dataset.counted === "true") return;
    element.dataset.counted = "true";
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / 1100);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = format(Math.round(target * eased));
      if (progress < 1) frames.set(element, requestAnimationFrame(tick));
      else frames.delete(element);
    }
    frames.set(element, requestAnimationFrame(tick));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach((element) => observer.observe(element));
  return () => {
    observer.disconnect();
    frames.forEach((frame) => cancelAnimationFrame(frame));
    elements.forEach(finish);
  };
}

function initParticles(reduce) {
  const canvas = document.getElementById("heroParticles");
  if (!canvas) return () => {};
  canvas.hidden = reduce;
  if (reduce) return () => {};
  const context = canvas.getContext("2d");
  if (!context) return () => {};

  let width = 0;
  let height = 0;
  let particles = [];
  let frame = 0;
  let previousTime = 0;
  let inView = canvas.getBoundingClientRect().bottom > 0
    && canvas.getBoundingClientRect().top < window.innerHeight;
  let disposed = false;

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(36, Math.max(14, Math.round(width * height / 24000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 0.7 + Math.random() * 1.2
    }));
    schedule();
  }

  function draw(now) {
    frame = 0;
    if (disposed || !inView || document.hidden || !width || !height) return;
    const delta = previousTime ? Math.min((now - previousTime) / 16.67, 2) : 1;
    previousTime = now;
    context.clearRect(0, 0, width, height);
    const light = document.documentElement.getAttribute("data-theme") === "light";
    const color = light ? "0, 125, 111" : "70, 225, 183";

    particles.forEach((particle, index) => {
      particle.x = (particle.x + particle.vx * delta + width) % width;
      particle.y = (particle.y + particle.vy * delta + height) % height;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${color}, 0.45)`;
      context.fill();
      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 125) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(${color}, ${(1 - distance / 125) * 0.12})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }
    });
    schedule();
  }

  function schedule() {
    if (!frame && !disposed && inView && !document.hidden && width && height) {
      frame = requestAnimationFrame(draw);
    }
  }

  function visibilityChanged() {
    if (!inView || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    } else schedule();
  }

  let intersectionObserver;
  function checkPosition() {
    const bounds = canvas.getBoundingClientRect();
    inView = bounds.bottom > 0 && bounds.top < window.innerHeight;
    visibilityChanged();
  }
  if ("IntersectionObserver" in window) {
    intersectionObserver = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      visibilityChanged();
    }, { threshold: 0 });
    intersectionObserver.observe(canvas);
  } else window.addEventListener("scroll", checkPosition, { passive: true });

  let resizeObserver;
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
  } else window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", visibilityChanged);
  resize();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    intersectionObserver?.disconnect();
    resizeObserver?.disconnect();
    window.removeEventListener("scroll", checkPosition);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", visibilityChanged);
    context.clearRect(0, 0, width, height);
    canvas.hidden = true;
  };
}

function initPointerEffects(reduce) {
  const glow = document.getElementById("cursorGlow");
  if (glow) glow.hidden = true;
  if (reduce) return () => {};
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let detach = () => {};

  function enable() {
    const cleanups = [];
    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;

    function listen(element, event, callback) {
      element.addEventListener(event, callback, { passive: true });
      cleanups.push(() => element.removeEventListener(event, callback));
    }

    if (glow) {
      listen(document, "pointermove", (event) => {
        if (event.pointerType === "touch") return;
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (!frame) {
          frame = requestAnimationFrame(() => {
            glow.hidden = false;
            glow.style.setProperty("--glow-x", `${mouseX}px`);
            glow.style.setProperty("--glow-y", `${mouseY}px`);
            frame = 0;
          });
        }
      });
      listen(document, "pointerleave", () => { glow.hidden = true; });
    }

    document.querySelectorAll(".project-card").forEach((card) => {
      const reset = () => {
        card.style.setProperty("--pointer-x", "50%");
        card.style.setProperty("--pointer-y", "50%");
        card.style.setProperty("--rotate-x", "0deg");
        card.style.setProperty("--rotate-y", "0deg");
      };
      listen(card, "pointermove", (event) => {
        if (event.pointerType === "touch") return;
        const bounds = card.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
        const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
        card.style.setProperty("--pointer-x", `${x * 100}%`);
        card.style.setProperty("--pointer-y", `${y * 100}%`);
        card.style.setProperty("--rotate-x", `${(0.5 - y) * 6}deg`);
        card.style.setProperty("--rotate-y", `${(x - 0.5) * 6}deg`);
      });
      listen(card, "pointerleave", reset);
      cleanups.push(reset);
    });

    document.querySelectorAll(".magnetic").forEach((button) => {
      const reset = () => {
        button.style.setProperty("--magnet-x", "0px");
        button.style.setProperty("--magnet-y", "0px");
      };
      listen(button, "pointermove", (event) => {
        if (event.pointerType === "touch") return;
        const bounds = button.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
        const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)));
        button.style.setProperty("--magnet-x", `${x * 4}px`);
        button.style.setProperty("--magnet-y", `${y * 4}px`);
      });
      listen(button, "pointerleave", reset);
      cleanups.push(reset);
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
      if (glow) glow.hidden = true;
    };
  }

  function refresh() {
    detach();
    detach = finePointer.matches ? enable() : () => {};
  }
  refresh();
  const stopWatching = watchMedia(finePointer, refresh);
  return () => {
    stopWatching();
    detach();
  };
}
