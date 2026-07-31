// Fotografer Suka Suka — site content loader (bilingual)
// Reads content/site.json (edited via /admin -> Pengaturan Website) and fills
// in the homepage text in the currently selected language (ID/EN).
// The HTML already has current Indonesian text hardcoded as a fallback, so if
// this file fails to load for any reason, the page still looks correct.

(function () {
  let siteData = null;

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null && value !== "") el.textContent = value;
  }
  function setHref(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.setAttribute("href", value);
  }
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
  function pick(d, key, lang) {
    return d[`${key}_${lang}`] || d[`${key}_id`] || d[key] || "";
  }

  function render(lang) {
    const d = siteData;
    if (!d) return;

    setText("heroLocation", "📍 " + d.hero_location);
    const heroTitle = document.getElementById("heroTitle");
    const l1 = pick(d, "hero_title_line1", lang);
    const hl = pick(d, "hero_title_highlight", lang);
    const l2 = pick(d, "hero_title_line2", lang);
    if (heroTitle && l1 && hl && l2) {
      heroTitle.innerHTML = `${escapeHtml(l1)} <em>${escapeHtml(hl)}</em><br>${escapeHtml(l2)}`;
    }
    setText("heroLead", pick(d, "hero_lead", lang));
    setHref("heroWaLink", d.whatsapp_link);

    const stats = document.querySelectorAll("#heroStats .stat");
    const statData = [
      [d.stat1_number, pick(d, "stat1_label", lang)],
      [d.stat2_number, pick(d, "stat2_label", lang)],
      [d.stat3_number, pick(d, "stat3_label", lang)],
    ];
    stats.forEach((statEl, i) => {
      if (!statData[i]) return;
      const [num, label] = statData[i];
      const b = statEl.querySelector("b");
      const span = statEl.querySelector("span");
      if (b && num) b.textContent = num;
      if (span && label) span.textContent = label;
    });

    const marqueeText = pick(d, "marquee_text", lang);
    if (marqueeText) {
      const track = document.getElementById("marqueeTrack");
      if (track) {
        track.innerHTML = `<span>${escapeHtml(marqueeText)}</span><span>${escapeHtml(marqueeText)}</span>`;
      }
    }

    if (Array.isArray(d.services) && d.services.length) {
      const grid = document.getElementById("servicesGrid");
      if (grid) {
        grid.innerHTML = d.services
          .map((s, i) => {
            const tags = (pick(s, "tags", lang) || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => `<span class="chip">${escapeHtml(t)}</span>`)
              .join("");
            return `
              <div class="service-card">
                <div class="num">${String(i + 1).padStart(2, "0")}</div>
                <h3>${escapeHtml(pick(s, "title", lang))}</h3>
                <p>${escapeHtml(pick(s, "description", lang))}</p>
                <div class="chips">${tags}</div>
              </div>`;
          })
          .join("");
      }
    }

    setText("igCtaHandle", `${d.instagram_handle} · ${d.stat1_number} followers`);
    setHref("igCtaLink", d.instagram_link);

    setHref("contactWaLink", d.whatsapp_link);
    const contactWaLink = document.getElementById("contactWaLink");
    if (contactWaLink && d.whatsapp_display) contactWaLink.textContent = d.whatsapp_display;
    const contactNote = document.getElementById("contactNote");
    if (contactNote && (d.email || d.address)) {
      contactNote.innerHTML = `✉️ ${escapeHtml(d.email)}<br>📍 ${escapeHtml(d.address)}`;
    }

    setHref("navWaLink", d.whatsapp_link);
    setHref("footerIgLink", d.instagram_link);
    setHref("footerWaLink", d.whatsapp_link);
  }

  document.addEventListener("fss:langchange", (e) => render(e.detail.lang));

  fetch("content/site.json?_=" + Date.now())
    .then((res) => res.json())
    .then((d) => {
      siteData = d;
      const lang = (typeof getCurrentLang === "function" && getCurrentLang()) || "id";
      render(lang);
    })
    .catch(() => {
      // silently keep the hardcoded fallback text already in index.html
    });
})();
