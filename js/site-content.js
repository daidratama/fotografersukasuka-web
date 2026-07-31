// Fotografer Suka Suka — site content loader
// Reads content/site.json (edited via /admin -> Pengaturan Website) and fills
// in the homepage text so Kak Daidra can update it without touching code.
// The HTML already has the current text hardcoded as a fallback, so if this
// file fails to load for any reason, the page still looks correct.

(function () {
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null && value !== "") el.textContent = value;
  }
  function setHref(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.setAttribute("href", value);
  }

  fetch("content/site.json?_=" + Date.now())
    .then((res) => res.json())
    .then((d) => {
      // Hero
      setText("heroLocation", "📍 " + d.hero_location);
      const heroTitle = document.getElementById("heroTitle");
      if (heroTitle && d.hero_title_line1 && d.hero_title_highlight && d.hero_title_line2) {
        heroTitle.innerHTML = `${escapeHtml(d.hero_title_line1)} <em>${escapeHtml(d.hero_title_highlight)}</em><br>${escapeHtml(d.hero_title_line2)}`;
      }
      setText("heroLead", d.hero_lead);
      setHref("heroWaLink", d.whatsapp_link);

      const stats = document.querySelectorAll("#heroStats .stat");
      const statData = [
        [d.stat1_number, d.stat1_label],
        [d.stat2_number, d.stat2_label],
        [d.stat3_number, d.stat3_label],
      ];
      stats.forEach((statEl, i) => {
        if (!statData[i]) return;
        const [num, label] = statData[i];
        const b = statEl.querySelector("b");
        const span = statEl.querySelector("span");
        if (b && num) b.textContent = num;
        if (span && label) span.textContent = label;
      });

      // Marquee (duplicated for seamless scroll)
      if (d.marquee_text) {
        const track = document.getElementById("marqueeTrack");
        if (track) {
          track.innerHTML = `<span>${escapeHtml(d.marquee_text)}</span><span>${escapeHtml(d.marquee_text)}</span>`;
        }
      }

      // Services
      if (Array.isArray(d.services) && d.services.length) {
        const grid = document.getElementById("servicesGrid");
        if (grid) {
          grid.innerHTML = d.services
            .map((s, i) => {
              const tags = (s.tags || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => `<span class="chip">${escapeHtml(t)}</span>`)
                .join("");
              return `
                <div class="service-card">
                  <div class="num">${String(i + 1).padStart(2, "0")}</div>
                  <h3>${escapeHtml(s.title)}</h3>
                  <p>${escapeHtml(s.description)}</p>
                  <div class="chips">${tags}</div>
                </div>`;
            })
            .join("");
        }
      }

      // Instagram CTA
      setText("igCtaHandle", `${d.instagram_handle} · ${d.stat1_number} followers`);
      setHref("igCtaLink", d.instagram_link);

      // Contact panel
      setHref("contactWaLink", d.whatsapp_link);
      const contactWaLink = document.getElementById("contactWaLink");
      if (contactWaLink && d.whatsapp_display) contactWaLink.textContent = d.whatsapp_display;
      setText("contactNote", null); // handled below via innerHTML for line break
      const contactNote = document.getElementById("contactNote");
      if (contactNote && (d.email || d.address)) {
        contactNote.innerHTML = `✉️ ${escapeHtml(d.email)}<br>📍 ${escapeHtml(d.address)}`;
      }

      // Nav / footer links
      setHref("navWaLink", d.whatsapp_link);
      setHref("footerIgLink", d.instagram_link);
      setHref("footerWaLink", d.whatsapp_link);
    })
    .catch(() => {
      // silently keep the hardcoded fallback text already in index.html
    });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }
})();
