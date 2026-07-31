// Fotografer Suka Suka — language switcher
// Handles: (1) static UI text (buttons, headings not editable via /admin),
// (2) telling app.js / site-content.js which language to render, and
// (3) remembering the visitor's choice.

const UI_STRINGS = {
  id: {
    nav_layanan: "Layanan",
    nav_portofolio: "Portofolio",
    nav_booking: "Booking",
    nav_whatsapp: "WhatsApp",
    hero_btn_booking: "Booking via WhatsApp",
    hero_btn_portfolio: "Lihat Portofolio",
    layanan_tag: "Layanan",
    layanan_heading: "Satu tim, semua kebutuhan visual",
    layanan_desc: "Dari dokumentasi event korporat sampai konten personal branding — dikerjakan oleh tim yang sama yang ada di balik @fotografersukasuka.",
    portfolio_tag: "Portofolio",
    portfolio_heading: "Hasil kerja terbaru",
    portfolio_desc: "Diperbarui langsung oleh tim Fotografersukasuka. Klik kategori untuk menyaring, atau klik foto untuk melihat lebih besar.",
    filter_all: "Semua",
    load_more: "Lihat lebih banyak",
    gallery_empty: "Belum ada foto di kategori ini.",
    gallery_error: "Portofolio belum bisa dimuat. Coba refresh halaman ini.",
    ig_cta_heading: "Lihat lebih banyak di Instagram",
    ig_cta_btn: "Kunjungi Instagram",
    booking_tag: "Booking",
    booking_heading: "Siap bantu acara & konten Anda",
    booking_step1_title: "1. Chat kebutuhan Anda",
    booking_step1_desc: "Ceritakan jenis acara atau shoot yang Anda butuhkan, lokasi, dan tanggalnya lewat WhatsApp.",
    booking_step2_title: "2. Konfirmasi paket & jadwal",
    booking_step2_desc: "Tim akan kirimkan pilihan paket sesuai kebutuhan, lalu mengunci jadwal setelah disepakati.",
    booking_step3_title: "3. Hari-H & hasil akhir",
    booking_step3_desc: "Tim datang sesuai jadwal, dan hasil foto/video dikirim melalui link download dalam beberapa hari kerja.",
    contact_heading: "Hubungi Langsung",
    contact_desc: "Respon cepat lewat WhatsApp untuk pertanyaan paket, harga, dan ketersediaan jadwal.",
  },
  en: {
    nav_layanan: "Services",
    nav_portofolio: "Portfolio",
    nav_booking: "Booking",
    nav_whatsapp: "WhatsApp",
    hero_btn_booking: "Book via WhatsApp",
    hero_btn_portfolio: "View Portfolio",
    layanan_tag: "Services",
    layanan_heading: "One team, every visual need",
    layanan_desc: "From corporate event documentation to personal branding content — made by the same team behind @fotografersukasuka.",
    portfolio_tag: "Portfolio",
    portfolio_heading: "Recent work",
    portfolio_desc: "Updated directly by the Fotografersukasuka team. Click a category to filter, or click a photo to view it larger.",
    filter_all: "All",
    load_more: "Load more",
    gallery_empty: "No photos in this category yet.",
    gallery_error: "Portfolio couldn't be loaded. Try refreshing this page.",
    ig_cta_heading: "See more on Instagram",
    ig_cta_btn: "Visit Instagram",
    booking_tag: "Booking",
    booking_heading: "Ready to help with your event & content",
    booking_step1_title: "1. Chat your needs",
    booking_step1_desc: "Tell us the type of event or shoot you need, the location, and the date via WhatsApp.",
    booking_step2_title: "2. Confirm package & schedule",
    booking_step2_desc: "Our team will send package options that fit your needs, then lock in the schedule once agreed.",
    booking_step3_title: "3. Shoot day & final results",
    booking_step3_desc: "Our team arrives on schedule, and photo/video results are delivered via download link within a few business days.",
    contact_heading: "Contact Us Directly",
    contact_desc: "Fast response via WhatsApp for package questions, pricing, and schedule availability.",
  },
};

const LANG_STORAGE_KEY = "fss_lang";

function getCurrentLang() {
  return localStorage.getItem(LANG_STORAGE_KEY) || "id";
}

function setCurrentLang(lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
}

function applyStaticStrings(lang) {
  const dict = UI_STRINGS[lang] || UI_STRINGS.id;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.setAttribute("lang", lang);
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function initLanguageSwitcher() {
  const lang = getCurrentLang();
  applyStaticStrings(lang);

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const newLang = btn.dataset.lang;
      if (newLang === getCurrentLang()) return;
      setCurrentLang(newLang);
      applyStaticStrings(newLang);
      // Ask the other loaders (site content + gallery) to re-render in the new language
      document.dispatchEvent(new CustomEvent("fss:langchange", { detail: { lang: newLang } }));
    });
  });
}

document.addEventListener("DOMContentLoaded", initLanguageSwitcher);
