const archiveHero = document.querySelector(".archive-hero");

if (archiveHero) {
  const ownedSoftwareSection = document.createElement("section");
  ownedSoftwareSection.className = "software-owned-section page-shell";
  ownedSoftwareSection.setAttribute("aria-labelledby", "software-propio-title");
  ownedSoftwareSection.innerHTML = `
    <div class="library-directory-heading software-owned-heading">
      <div>
        <p class="library-label">Desarrollo propio</p>
        <h2 id="software-propio-title">Software desarrollado por mí</h2>
      </div>
      <p>Aplicaciones abiertas orientadas a la docencia, la investigación y el análisis de sistemas de transporte.</p>
    </div>
    <article class="software-owned-card">
      <div class="software-owned-copy">
        <span class="content-meta">Aplicación educativa · Código abierto · Versión 0.2</span>
        <h3>MacroNet Transport</h3>
        <p>Aplicación interactiva para estudiar y ejecutar el modelo clásico de transporte de cuatro etapas: generación y atracción, distribución, elección modal y asignación de viajes a la red. Permite modificar datos y parámetros, revisar cálculos intermedios y exportar resultados para su análisis.</p>
        <dl class="software-facts">
          <div><dt>Desarrollo</dt><dd>Héctor A. Benítez García</dd></div>
          <div><dt>Alojamiento</dt><dd>Repositorio público en GitHub: VanLinux/macronet-transport</dd></div>
          <div><dt>Compatibilidad</dt><dd>Disponible actualmente para GNU/Linux. Próximamente para Windows 11.</dd></div>
        </dl>
      </div>
      <div class="software-owned-actions" aria-label="Recursos de MacroNet Transport">
        <a class="button button-primary" href="/movilidad-urbana/software/manuales/Manual_de_usuario_MacroNet_Transport_v0_2.pdf" target="_blank" rel="noreferrer">Consultar manual <span aria-hidden="true">PDF ↗</span></a>
        <a class="button button-secondary" href="https://github.com/VanLinux/macronet-transport" target="_blank" rel="noreferrer">Ver código fuente <span aria-hidden="true">GitHub ↗</span></a>
      </div>
    </article>
  `;

  archiveHero.insertAdjacentElement("afterend", ownedSoftwareSection);
}
