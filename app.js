const API_URL = "https://script.google.com/macros/s/AKfycbx_2BpqRU45AsJKhm64YsFXsv-j7L_B-kcULPliSN6Tl6lLS-_8YCq6DGwY5ti3X9g/exec";

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
        String(u.Categorie || "").trim().toLowerCase() === cat
      );

      // Rendu (cartes compatibles avec ton style)
      liste.innerHTML = unites.map(u => {
        const nom = (u["Unité"] ?? "").toString().trim() || "Unité sans nom";
        const desc = (u.description ?? "").toString().trim() || "Aucune description.";
        const efficace = (u["Efficace contre"] ?? "").toString().trim();
        const faible = (u["Faible contre"] ?? "").toString().trim();
        const erreurs = (u["À ne pas faire"] ?? "").toString().trim();

        // Keywords = nom + description + catégorie (pour ta recherche)
        const keywords = `${cat} ${nom} ${desc}`.toLowerCase();

        // Fonction pour convertir liste virgule en <ul><li>
        const toList = (str) => {
          if (!str) return "<li>Aucune information</li>";
          return str.split(",").map(item => `<li>${escapeHtml(item.trim())}</li>`).join("");
        };

        return `
          <article class="unit" data-unit data-keywords="${escapeHtmlAttr(keywords)}">
            <div class="u-top">
              <div>
                <p class="u-name">${escapeHtml(nom)}</p>
                <div class="small">${escapeHtml(desc)}</div>
              </div>
            </div>
            <div class="u-body">
              <div class="cols">
                <div class="block ok">
                  <h3>Efficace contre</h3>
                  <ul>${toList(efficace)}</ul>
                </div>
                <div class="block warn">
                  <h3>Faible contre</h3>
                  <ul>${toList(faible)}</ul>
                </div>
                <div class="block bad">
                  <h3>À ne pas faire</h3>
                  <ul>${toList(erreurs)}</ul>
                </div>
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
