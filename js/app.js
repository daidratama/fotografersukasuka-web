// Fotografer Suka Suka — portfolio loader
// Reads content/portfolio.json (edited via /admin) and renders the gallery.
// No build step: this file is fetched fresh, so admin changes show up on refresh.

(function () {
  const PAGE_SIZE = 12;
  let allItems = [];
  let activeCategory = "all";
  let visibleCount = PAGE_SIZE;

  const galleryEl = document.getElementById("gallery");
  const filtersEl = document.getElementById("filters");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");

  // Keep in sync with the category options in admin/config.yml
  const CATEGORY_LABELS = {
    "events": "Event & Korporat",
    "product": "Produk & Katalog",
    "portrait": "Portrait Profesional",
    "corporate": "Corporate Team",
    "fashion": "Fashion",
    "model": "Model",
    "travel": "Travel",
    "landscape": "Landscape",
    "public-figure": "Public Figure",
    "sports": "Sport & Running",
    "studio": "Studio Setup"
  };

  function labelFor(cat) {
    return CATEGORY_LABELS[cat] || cat;
  }

  function buildFilters() {
    const cats = Array.from(new Set(allItems.map((i) => i.category)));
    const frag = document.createDocumentFragment();

    const allBtn = document.createElement("button");
    allBtn.className = "filter-btn active";
    allBtn.textContent = "Semua";
    allBtn.dataset.cat = "all";
    frag.appendChild(allBtn);

    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.textContent = labelFor(cat);
      btn.dataset.cat = cat;
      frag.appendChild(btn);
    });

    filtersEl.innerHTML = "";
    filtersEl.appendChild(frag);

    filtersEl.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filtersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.cat;
        visibleCount = PAGE_SIZE;
        renderGallery();
      });
    });
  }

  function renderGallery() {
    const filtered =
      activeCategory === "all"
        ? allItems
        : allItems.filter((i) => i.category === activeCategory);

    if (filtered.length === 0) {
      galleryEl.innerHTML = '<p class="gallery-empty">Belum ada foto di kategori ini.</p>';
      loadMoreBtn.style.display = "none";
      return;
    }

    const slice = filtered.slice(0, visibleCount);
    galleryEl.innerHTML = "";
    const frag = document.createDocumentFragment();

    slice.forEach((item) => {
      const fig = document.createElement("figure");
      fig.innerHTML = `
        <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
        <figcaption>${escapeHtml(item.title)} · ${escapeHtml(labelFor(item.category))}</figcaption>
      `;
      fig.addEventListener("click", () => openLightbox(item));
      frag.appendChild(fig);
    });

    galleryEl.appendChild(frag);
    loadMoreBtn.style.display = visibleCount < filtered.length ? "inline-flex" : "none";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  function openLightbox(item) {
    lightboxImg.src = item.image;
    lightboxImg.alt = item.title;
    lightboxCaption.textContent = `${item.title} — ${labelFor(item.category)}`;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  loadMoreBtn.addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    renderGallery();
  });

  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  fetch("content/portfolio.json?_=" + Date.now())
    .then((res) => res.json())
    .then((data) => {
      allItems = data.items || [];
      buildFilters();
      renderGallery();
    })
    .catch(() => {
      galleryEl.innerHTML =
        '<p class="gallery-empty">Portofolio belum bisa dimuat. Coba refresh halaman ini.</p>';
    });
})();
