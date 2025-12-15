(function () {
  const input = document.querySelector("[data-search]");
  const clearBtn = document.querySelector("[data-clear]");
  const units = [...document.querySelectorAll("[data-unit]")];

  if (!input || units.length === 0) return;

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    units.forEach(u => {
      const text = (u.getAttribute("data-keywords") || "").toLowerCase();
      u.style.display = (q === "" || text.includes(q)) ? "" : "none";
    });
  };

  input.addEventListener("input", apply);
  if (clearBtn) {
    clearBtn.addEventListener("click", () => { input.value = ""; apply(); input.focus(); });
  }
})();
