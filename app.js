const API_URL = "https://script.google.com/macros/s/AKfycbzjbDXFw_dLUT0SadGhGROEGDPo9pTUuFGjluFB-8y-_GyJus1qyWw1zl6CdqwbBEfH/exec";

document.addEventListener("DOMContentLoaded", async function () {
  // --- 1) Charger et afficher les unités depuis Google Sheets ---
  const cat = (document.body.dataset.cat || "").trim().toLowerCase();
  const liste = document.getElementById("liste");

  if (cat && liste) {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("API Google Sheets inaccessible");

      const data = await res.json();

      // Filtrer catégorie (terre / air / mer)
      const unites = (Array.isArray(data) ? data : []).filter(u =>
        String(u.categorie || "").trim().toLowerCase() === cat
      );

      // Rendu (cartes compatibles avec ton style)
      liste.innerHTML = unites.map(u => {
        const nom = (u.nom ?? "").toString().trim() || "Unité sans nom";
        const desc = (u.description ?? "").toString().trim() || "Aucune description.";

        // Keywords = nom + description + catégorie (pour ta recherche)
        const keywords = `${cat} ${nom} ${desc}`.toLowerCase();

        return `
          <article class="unit" data-unit data-keywords="${escapeHtmlAttr(keywords)}">
            <div class="u-top">
              <div>
                <p class="u-name">${escapeHtml(nom)}</p>
                <div class="small">${escapeHtml(desc)}</div>
              </div>
            </div>
          </article>
        `;
      }).join("");

      // Si rien à afficher
      if (unites.length === 0) {
        liste.innerHTML = `<p style="color: var(--muted); margin-top: 8px;">Aucune unité pour le moment.</p>`;
      }
    } catch (e) {
      console.error(e);
      liste.innerHTML = `<p style="color: var(--muted); margin-top: 8px;">Erreur de chargement des unités (Google Sheets).</p>`;
    }
  }

  // --- 2) Recherche (fonctionne maintenant sur les unités statiques + celles injectées) ---
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

  if (searchBtn) searchBtn.addEventListener("click", apply);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      apply();
      input.focus();
    });
  }
});

// --- Helpers anti-bug / anti-injection ---
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeHtmlAttr(str) {
  // pour attributs HTML (data-keywords)
  return escapeHtml(str).replaceAll("\n", " ").replaceAll("\r", " ");
}
