// Navigasi hari + drawer mobile + jam kecil di topbar.
(function () {
  "use strict";

  const buttons = document.querySelectorAll(".daynav__btn");
  const sections = document.querySelectorAll(".day");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("scrim");
  const burger = document.getElementById("burger");
  const clock = document.getElementById("clock");

  // Mapping JS Date.getDay() -> id hari di jadwal (Minggu = libur, fallback Senin)
  const todayMap = ["senin", "senin", "selasa", "rabu", "kamis", "jumat", "senin"];

  function showDay(day) {
    buttons.forEach((b) => b.classList.toggle("is-active", b.dataset.day === day));
    sections.forEach((s) => s.classList.toggle("is-visible", s.id === "day-" + day));
    // Simpan pilihan biar refresh tetap di hari yang sama
    try { localStorage.setItem("jadwal:day", day); } catch (e) { /* abaikan */ }
  }

  function closeDrawer() {
    sidebar.classList.remove("is-open");
    scrim.classList.remove("is-on");
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showDay(btn.dataset.day);
      closeDrawer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  burger.addEventListener("click", () => {
    const open = sidebar.classList.toggle("is-open");
    scrim.classList.toggle("is-on", open);
  });

  scrim.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Jam WITA (kampus Unmul di Samarinda, UTC+8)
  function tick() {
    try {
      clock.textContent =
        new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Makassar",
        }).format(new Date()) + " WITA";
    } catch (e) {
      const d = new Date();
      clock.textContent =
        String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    }
  }
  tick();
  setInterval(tick, 30000);

  // Hari awal: pilihan terakhir user, atau hari ini
  let initial = null;
  try { initial = localStorage.getItem("jadwal:day"); } catch (e) { /* abaikan */ }
  if (!initial || !document.getElementById("day-" + initial)) {
    initial = todayMap[new Date().getDay()];
  }
  showDay(initial);
})();
