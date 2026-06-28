/* =========================================================================
   M+ | More Than Marche — interactions
   ========================================================================= */
(function () {
  "use strict";

  const STORAGE_KEY = "mplus-lang";
  const DEFAULT_LANG = "it";
  let lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  if (!window.I18N[lang]) lang = DEFAULT_LANG;

  /* -------- Image slot manifest --------
     Map a slot name -> filename in assets/img/. Drop the file in and set
     the value; the layout reads it automatically. Empty => styled tile. */
  const IMG_SLOTS = {
    about:     "about.jpg",
    mission:   "mission.jpg",
    meaning:   "meaning.jpg",
    manifesto: "manifesto.jpg"
  };

  const placeholderLabels = {
    it: "Immagine M+",
    en: "M+ Image"
  };

  /* ---------------- i18n ---------------- */
  function applyLang(next) {
    lang = next;
    localStorage.setItem(STORAGE_KEY, lang);
    const dict = window.I18N[lang];

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // format: "attr|key"
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, key] = pair.split("|");
        if (attr && key && dict[key] !== undefined) {
          const tmp = document.createElement("textarea");
          tmp.innerHTML = dict[key];
          el.setAttribute(attr, tmp.value);
        }
      });
    });

    if (dict["doc.title"]) {
      const tmp = document.createElement("textarea");
      tmp.innerHTML = dict["doc.title"];
      document.title = tmp.value;
    }

    // update lang switch active states
    document.querySelectorAll(".lang-switch__btn").forEach((b) => {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === lang);
    });

    // refresh placeholder captions + gallery labels for the active language
    updatePlaceholders();
    renderGallery();
  }

  function updatePlaceholders() {
    document.querySelectorAll(".media-frame").forEach((f) => {
      if (!f.closest("[data-img-slot]")?.classList.contains("has-img")) {
        f.setAttribute("data-empty", placeholderLabels[lang]);
      }
    });
  }

  /* ---------------- Image slots ---------------- */
  // per-slot dark overlay so text stays legible over each photo
  const SLOT_OVERLAY = {
    // hero darkening is handled by the .hero__overlay element
    meaning:   "linear-gradient(180deg, rgba(28,28,28,0.74), rgba(28,28,28,0.82))",
    manifesto: "linear-gradient(180deg, rgba(28,28,28,0.55), rgba(28,28,28,0.70))"
  };

  function applyImageSlots() {
    Object.entries(IMG_SLOTS).forEach(([slot, file]) => {
      if (!file) return;
      const host = document.querySelector(`[data-img-slot="${slot}"]`);
      if (!host) return;
      const url = `assets/img/${file}`;
      const overlay = SLOT_OVERLAY[slot];

      if (host.classList.contains("media-frame") || host.querySelector(".media-frame")) {
        // section media (about, mission): plain photo inside the frame
        const frame = host.classList.contains("media-frame") ? host : host.querySelector(".media-frame");
        frame.style.backgroundImage = `url("${url}")`;
      } else {
        // full-bleed backgrounds (hero, meaning, manifesto)
        host.style.backgroundImage = overlay ? `${overlay}, url("${url}")` : `url("${url}")`;
      }
      host.classList.add("has-img");
    });
  }

  /* ---------------- Gallery ---------------- */
  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid || !window.GALLERY_ITEMS) return;
    grid.innerHTML = "";
    window.GALLERY_ITEMS.forEach((item) => {
      const fig = document.createElement("figure");
      fig.className = `gallery-figure reveal ${item.span || "g-third"}`;
      const caption = (item.alt && item.alt[lang]) || "";
      if (item.src) {
        const img = document.createElement("img");
        img.src = `assets/img/${item.src}`;
        img.alt = caption;
        img.loading = "lazy";
        fig.appendChild(img);
      }
      if (caption) {
        const cap = document.createElement("figcaption");
        cap.className = "gallery-figure__cap";
        cap.textContent = caption;
        fig.appendChild(cap);
      }
      grid.appendChild(fig);
    });
    observeReveals();
  }

  /* ---------------- Reveal on scroll ---------------- */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
  }

  /* ---------------- Nav behaviour ---------------- */
  function initNav() {
    const nav = document.getElementById("nav");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
      updateProgress();
      updateActiveLink();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function updateProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    bar.style.width = `${Math.min(100, Math.max(0, scrolled * 100))}%`;
  }

  function updateActiveLink() {
    const links = document.querySelectorAll(".nav__links a");
    let currentId = "";
    document.querySelectorAll("section[id]").forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) currentId = sec.id;
    });
    links.forEach((a) => {
      a.classList.toggle("is-current", a.getAttribute("href") === `#${currentId}`);
    });
  }

  /* ---------------- Hero typing animation ---------------- */
  function initTyping() {
    var el = document.getElementById("heroTypingText");
    if (!el) return;
    var text = "m+ | More Than Marche";
    var typeSpeed = 110;
    var deleteSpeed = 55;
    var pauseAfterType = 2000;
    var pauseAfterDelete = 700;
    var idx = 0;
    var deleting = false;

    function tick() {
      if (!deleting) {
        idx++;
        el.textContent = text.substring(0, idx);
        if (idx >= text.length) {
          deleting = true;
          setTimeout(tick, pauseAfterType);
          return;
        }
        setTimeout(tick, typeSpeed);
      } else {
        idx--;
        el.textContent = text.substring(0, idx);
        if (idx <= 0) {
          deleting = false;
          setTimeout(tick, pauseAfterDelete);
          return;
        }
        setTimeout(tick, deleteSpeed);
      }
    }

    setTimeout(tick, 600);
  }

  /* ---------------- Forms ---------------- */
  function initForms() {
    const feedbackKeys = {
      contactForm: { node: "contactFeedback", key: "contact.form.sent" },
      newsForm: { node: "newsFeedback", key: "contact.news.done" },
      newsFormFooter: { node: "newsFeedbackFooter", key: "contact.news.done" }
    };
    Object.entries(feedbackKeys).forEach(([formId, cfg]) => {
      const form = document.getElementById(formId);
      if (!form) return;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const fb = document.getElementById(cfg.node);
        const tmp = document.createElement("textarea");
        tmp.innerHTML = window.I18N[lang][cfg.key] || "";
        if (fb) fb.textContent = tmp.value;
        form.reset();
        setTimeout(() => { if (fb) fb.textContent = ""; }, 5000);
      });
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();

    document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.getAttribute("data-lang")));
    });

    applyImageSlots();
    applyLang(lang);
    initNav();
    initTyping();
    initForms();
    observeReveals();
  });
})();
