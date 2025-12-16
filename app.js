const API_URL = "https://script.google.com/macros/s/AKfycbzjbDXFw_dLUT0SadGhGROEGDPo9pTUuFGjluFB-8y-_GyJus1qyWw1zl6CdqwbBEfH/exec";

document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("[data-search]");
  const clearBtn = document.querySelector("[data-clear]");
  const searchBtn = document.querySelector("[data-search-btn]");
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
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") apply();
  });
  
  if (searchBtn) {
    searchBtn.addEventListener("click", apply);
  }
  
  if (clearBtn) {
    clearBtn.addEventListener("click", () => { input.value = ""; apply(); input.focus(); });
  }
});
