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
    <div class="software-owned-list">
    <article class="software-owned-card">
      <div class="software-owned-copy">
        <span class="content-meta">Aplicación educativa · Código abierto · Versión 3.1.1</span>
        <h3>MacroNet Transport</h3>
        <p>Aplicación interactiva para estudiar y ejecutar el modelo clásico de transporte de cuatro etapas. La versión 3.1.1 incorpora guardado de proyectos .mnet, calibración estadística, nuevas funciones de fricción, asignación Todo-o-Nada y equilibrio de usuario de Wardrop, comparación de métodos y exportaciones ampliadas en CSV, GraphML y LaTeX.</p>
        <dl class="software-facts">
          <div><dt>Desarrollo</dt><dd>Héctor A. Benítez García</dd></div>
          <div><dt>Alojamiento</dt><dd>Repositorio público en GitHub: VanLinux/macronet-transport</dd></div>
          <div><dt>Compatibilidad</dt><dd>Disponible actualmente para GNU/Linux. Próximamente para Windows 11.</dd></div>
        </dl>
      </div>
      <div class="software-owned-actions" aria-label="Recursos de MacroNet Transport">
        <a class="button button-primary" href="/movilidad-urbana/software/manuales/Manual_MacroNet_Transport_v3.1.1.pdf" target="_blank" rel="noreferrer">Consultar manual <span aria-hidden="true">PDF · 3.1.1 ↗</span></a>
        <a class="button button-secondary" href="https://github.com/VanLinux/macronet-transport" target="_blank" rel="noreferrer">Ver código fuente <span aria-hidden="true">GitHub ↗</span></a>
      </div>
    </article>
    <article class="software-owned-card">
      <div class="software-owned-copy">
        <span class="content-meta">Aplicación educativa · Código abierto · Versión 2.0.0</span>
        <h3>HCNet Transport</h3>
        <p>Aplicación educativa para analizar intersecciones semaforizadas aisladas. Calcula capacidad, grado de saturación, demora de control y nivel de servicio por grupo de carriles; además, permite revisar la memoria de cálculo y exportar resultados en CSV y LaTeX.</p>
        <dl class="software-facts">
          <div><dt>Desarrollo</dt><dd>Héctor Alonso Benítez García</dd></div>
          <div><dt>Alojamiento</dt><dd>Repositorio público en GitHub: VanLinux/hcnet-transport</dd></div>
          <div><dt>Compatibilidad</dt><dd>Disponible para distribuciones GNU/Linux de escritorio.</dd></div>
        </dl>
      </div>
      <div class="software-owned-actions" aria-label="Recursos de HCNet Transport">
        <a class="button button-primary" href="/movilidad-urbana/software/manuales/HCNet_Transport_Manual_Usuario.pdf" target="_blank" rel="noreferrer">Consultar manual <span aria-hidden="true">PDF ↗</span></a>
        <a class="button button-secondary" href="https://github.com/VanLinux/hcnet-transport" target="_blank" rel="noreferrer">Ver código fuente <span aria-hidden="true">GitHub ↗</span></a>
      </div>
    </article>
        <article class="software-owned-card software-owned-card-illustrated" id="walksim-mobility">
          <div class="software-owned-copy">
            <span class="content-meta">Aplicación educativa · Código abierto · Versión 3.4.0</span>
            <h3>WalkSim Mobility</h3>
            <p>Herramienta para analizar movilidad peatonal y senderos compartidos. Integra cálculos de operación y nivel de servicio, comparación de escenarios y microsimulación con Eclipse SUMO. Permite estudiar corredores, accesos, plazas y cruces semaforizados, guardar proyectos y exportar resultados en CSV y reportes LaTeX.</p>
            <dl class="software-facts">
              <div><dt>Desarrollo</dt><dd>Héctor Alonso Benítez García</dd></div>
              <div><dt>Alojamiento</dt><dd>Repositorio público en GitHub: VanLinux/walksim-mobility</dd></div>
              <div><dt>Compatibilidad</dt><dd>GNU/Linux y Windows mediante Python 3.11+ y Eclipse SUMO.</dd></div>
            </dl>
          </div>
          <div class="software-owned-side">
            <figure class="software-preview">
              <a href="/movilidad-urbana/software/imagenes/walksim-mobility-3.4.0.png" target="_blank" rel="noreferrer" aria-label="Ampliar la imagen de WalkSim Mobility">
                <img src="/movilidad-urbana/software/imagenes/walksim-mobility-3.4.0.png" alt="Vista ilustrativa de WalkSim Mobility con parámetros de plaza, matriz origen-destino y mapa de densidad peatonal" width="1491" height="1055" loading="lazy" />
              </a>
              <figcaption>Plaza y flujos cruzados · ampliar imagen ↗</figcaption>
            </figure>
            <div class="software-owned-actions" aria-label="Recursos de WalkSim Mobility">
              <a class="button button-primary" href="/movilidad-urbana/software/manuales/Manual_Usuario_WalkSim_Mobility_3_4_Ilustrado.pdf" target="_blank" rel="noreferrer">Consultar manual <span aria-hidden="true">PDF · 3.4.0 ↗</span></a>
              <a class="button button-secondary" href="https://github.com/VanLinux/walksim-mobility" target="_blank" rel="noreferrer">Ver código fuente <span aria-hidden="true">GitHub ↗</span></a>
            </div>
          </div>
        </article>
    </div>
  `;

  archiveHero.insertAdjacentElement("afterend", ownedSoftwareSection);
}
