// Fotografer Suka Suka — client/brand logo strip
// Reads content/clients.json (edited via /admin -> Brand & Klien).
// The section stays hidden until at least one logo is added, so the
// homepage never shows an empty "Brand yang pernah bekerja sama" bar.

(function () {
  const section = document.getElementById("clientsSection");
  const strip = document.getElementById("clientsStrip");
  if (!section || !strip) return;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  fetch("content/clients.json?_=" + Date.now())
    .then((res) => res.json())
    .then((data) => {
      const items = (data.items || []).filter((i) => i.logo);
      if (items.length === 0) return;

      strip.innerHTML = items
        .map((item) => {
          const img = `<img class="client-logo" src="${item.logo}" alt="${escapeHtml(item.name || "")}" loading="lazy">`;
          return item.url
            ? `<a href="${item.url}" target="_blank" rel="noopener">${img}</a>`
            : img;
        })
        .join("");

      section.style.display = "block";
    })
    .catch(() => {
      // keep section hidden if it fails to load
    });
})();
