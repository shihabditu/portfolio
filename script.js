// ---------- Animated grid background ----------
(() => {
  const c = document.getElementById("grid-bg");
  const ctx = c.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, pts = [];
  const GAP = 48;

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + "px"; c.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    for (let x = 0; x <= w + GAP; x += GAP)
      for (let y = 0; y <= h + GAP; y += GAP)
        pts.push({ x, y, p: Math.random() * Math.PI * 2 });
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      const a = 0.08 + 0.12 * (0.5 + 0.5 * Math.sin(t / 1400 + p.p));
      ctx.fillStyle = `rgba(57,255,136,${a})`;
      ctx.fillRect(p.x, p.y, 1.5, 1.5);
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);

  addEventListener("pointermove", (e) => {
    document.documentElement.style.setProperty("--mx", e.clientX + "px");
    document.documentElement.style.setProperty("--my", e.clientY + "px");
  });
})();

// ---------- Typing effect ----------
(() => {
  const el = document.getElementById("typed");
  const words = ["build for the web.", "write C.", "explore cyber security.", "design clean interfaces."];
  let wi = 0, ci = 0, del = false;
  function tick() {
    const word = words[wi];
    el.textContent = word.slice(0, ci);
    if (!del && ci < word.length) ci++;
    else if (del && ci > 0) ci--;
    else if (!del) { del = true; return setTimeout(tick, 1600); }
    else { del = false; wi = (wi + 1) % words.length; }
    setTimeout(tick, del ? 40 : 80);
  }
  tick();
})();

// ---------- Hero terminal ----------
(() => {
  const body = document.getElementById("terminal-body");
  const lines = [
    ["$ ", "whoami"],
    ["", "shihab — student @ 第一工科大学, Tokyo"],
    ["$ ", "cat focus.txt"],
    ["", "web development, c programming, cyber security"],
    ["$ ", "status --now"],
    ["", "● learning something new every day"],
  ];
  let li = 0, ci = 0, html = "";
  function type() {
    if (li >= lines.length) return;
    const [prompt, text] = lines[li];
    if (ci === 0 && prompt) html += `<span class="p">${prompt}</span>`;
    if (ci < text.length) {
      html += prompt ? text[ci] : `<span class="v">${text[ci]}</span>`;
      ci++;
      body.innerHTML = html + '<span class="p">▌</span>';
      setTimeout(type, prompt ? 55 : 14);
    } else {
      html += "\n"; li++; ci = 0;
      body.innerHTML = html + '<span class="p">▌</span>';
      setTimeout(type, prompt ? 250 : 500);
    }
  }
  setTimeout(type, 600);
})();

// ---------- Nav: scroll state, mobile menu, active link ----------
(() => {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");

  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20), { passive: true });
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => { toggle.classList.remove("open"); links.classList.remove("open"); })
  );

  const sections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...links.querySelectorAll("a:not(.btn)")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navAnchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
})();

// ---------- Reveal on scroll + counters + skill bars ----------
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add("in");

      el.querySelectorAll("[data-count]").forEach((n) => {
        const end = +n.dataset.count, start = performance.now(), dur = 1400;
        const step = (t) => {
          const k = Math.min((t - start) / dur, 1);
          n.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      el.querySelectorAll(".bar").forEach((b) => {
        const lvl = +b.dataset.level;
        b.querySelector(".fill").style.width = lvl + "%";
        const label = b.querySelector("em"), start = performance.now();
        const step = (t) => {
          const k = Math.min((t - start) / 1600, 1);
          label.textContent = Math.round(lvl * k) + "%";
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });

      io.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + "ms";
    io.observe(el);
  });
})();

// ---------- Service card glow follows mouse ----------
document.querySelectorAll(".service").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", e.clientX - r.left + "px");
    card.style.setProperty("--y", e.clientY - r.top + "px");
  });
});

// ---------- Project filter ----------
(() => {
  const btns = document.querySelectorAll(".filter");
  const items = document.querySelectorAll(".project");
  btns.forEach((b) => b.addEventListener("click", () => {
    btns.forEach((x) => x.classList.toggle("active", x === b));
    const f = b.dataset.filter;
    items.forEach((p) => p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f));
  }));
})();

document.getElementById("year").textContent = new Date().getFullYear();
