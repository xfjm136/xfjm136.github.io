(function () {
  const user = "xfjm136";
  const root = document.documentElement;
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("[data-nav-links]");
  const header = document.querySelector("[data-header]");
  const themeToggle = document.querySelector("[data-theme-toggle]");

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function setThemeIcon() {
    const icon = themeToggle && themeToggle.querySelector("[data-lucide]");
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (icon) {
      icon.setAttribute("data-lucide", root.dataset.theme === "dark" ? "moon" : "sun");
    }
    if (metaTheme) {
      metaTheme.setAttribute("content", root.dataset.theme === "dark" ? "#151816" : "#f7f8f3");
    }
    refreshIcons();
  }

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  navToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("no-scroll", isOpen);
  });

  navLinks?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeNav();
    }
  });

  themeToggle?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
    setThemeIcon();
  });

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true },
  );

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node && value !== undefined && value !== null) {
      node.textContent = value;
    }
  }

  function appendProjectMeta(repos) {
    const repoMap = new Map(repos.map((repo) => [repo.name, repo]));
    document.querySelectorAll("[data-repo]").forEach((card) => {
      const repo = repoMap.get(card.dataset.repo);
      if (!repo || card.querySelector(".project-meta")) return;

      const meta = document.createElement("div");
      meta.className = "project-meta";
      meta.innerHTML = `
        <span><i data-lucide="star" aria-hidden="true"></i>${repo.stargazers_count}</span>
        <span><i data-lucide="git-fork" aria-hidden="true"></i>${repo.forks_count}</span>
        <span><i data-lucide="calendar-days" aria-hidden="true"></i>${formatDate(repo.updated_at)}</span>
      `;

      const link = card.querySelector(".project-actions, .project-link");
      card.insertBefore(meta, link);
    });
    refreshIcons();
  }

  async function refreshGitHubData() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    try {
      const [profileResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`, { signal: controller.signal }),
        fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=100`, {
          signal: controller.signal,
        }),
      ]);

      if (!profileResponse.ok || !reposResponse.ok) {
        throw new Error("GitHub API unavailable");
      }

      const profile = await profileResponse.json();
      const repos = await reposResponse.json();
      const latest = repos.reduce((current, repo) => {
        return !current || new Date(repo.updated_at) > new Date(current.updated_at) ? repo : current;
      }, null);

      setText("[data-stat='followers']", profile.followers);
      setText("[data-stat='updated']", latest ? formatDate(latest.updated_at).slice(0, 4) : "");
      appendProjectMeta(repos);
    } catch (error) {
      console.info("Using bundled GitHub profile data.", error);
    } finally {
      clearTimeout(timeout);
    }
  }

  function revealOnScroll() {
    const targets = document.querySelectorAll(".section, .focus-item, .project-card, .stack-layout, .contact-panel");
    targets.forEach((target) => target.classList.add("reveal"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );

    targets.forEach((target) => observer.observe(target));
  }

  setThemeIcon();
  refreshIcons();
  revealOnScroll();
  refreshGitHubData();
})();
