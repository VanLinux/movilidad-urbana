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
    <article class="software-owned-card software-owned-card-illustrated" id="macronet-transport">
          <div class="software-owned-copy">
            <span class="content-meta">Aplicación educativa · Código abierto · Versión 3.3.2</span>
            <h3>MacroNet Transport</h3>
            <p>Modelo educativo de transporte de cuatro etapas: generación y atracción, distribución, elección modal y asignación de viajes. Permite calibrar modelos, comparar escenarios tarifarios y analizar el equilibrio de Wardrop, con ejecución opcional de SUMO. Guarda proyectos y exporta resultados e informes LaTeX.</p>
            <dl class="software-facts">
              <div><dt>Desarrollo</dt><dd>Héctor A. Benítez García</dd></div>
              <div><dt>Alojamiento</dt><dd>Repositorio público en GitHub: VanLinux/macronet-transport</dd></div>
              <div><dt>Compatibilidad</dt><dd>GNU/Linux y Windows 11 x64. Instalador de Windows con SUMO incluido.</dd></div>
            </dl>
          </div>
          <div class="software-owned-side">
            <figure class="software-preview">
              <a href="/movilidad-urbana/software/imagenes/macronet-transport-3.3.2.png" target="_blank" rel="noreferrer" aria-label="Ampliar la imagen de MacroNet Transport">
                <img src="/movilidad-urbana/software/imagenes/macronet-transport-3.3.2.png" alt="Vista ilustrativa de MacroNet Transport: generación de viajes, matriz origen-destino, participación modal y asignación en red" loading="lazy" />
              </a>
              <figcaption>Las cuatro etapas del transporte · ampliar imagen ↗</figcaption>
            </figure>
            <div class="software-owned-actions" aria-label="Recursos de MacroNet Transport">
              <a class="button button-primary" href="https://github.com/VanLinux/macronet-transport/releases/download/windows-v3.3.2/MacroNet-Transport-3.3.2-Windows-x64-Setup.exe">Descargar para Windows <span aria-hidden="true">EXE ↓</span></a>
              <small style="color:var(--muted);line-height:1.5;font-size:.7rem">Windows 11 x64 · 242 MB · SUMO incluido. Instalador sin firma digital. No incluye compilador LaTeX.</small>
              <a class="button button-secondary" href="/movilidad-urbana/software/manuales/Manual_Integral_MacroNet_Transport_v3.3.2.pdf" target="_blank" rel="noreferrer">Consultar manual <span aria-hidden="true">PDF · 3.3.2 ↗</span></a>
              <a class="button button-secondary" href="https://github.com/VanLinux/macronet-transport" target="_blank" rel="noreferrer">Ver código fuente <span aria-hidden="true">GitHub ↗</span></a>
            </div>
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
            <span class="content-meta">Aplicación educativa · Código abierto · Versión 3.4.2</span>
            <h3>WalkSim Mobility</h3>
            <p>Analiza corredores peatonales, accesos, plazas, cruces y senderos compartidos. Compara escenarios, evalúa el nivel de servicio y realiza microsimulaciones con SUMO; guarda tus proyectos y exporta resultados e informes LaTeX.</p>
            <dl class="software-facts">
              <div><dt>Desarrollo</dt><dd>Héctor Alonso Benítez García</dd></div>
              <div><dt>Alojamiento</dt><dd>Repositorio público en GitHub: VanLinux/walksim-mobility</dd></div>
              <div><dt>Compatibilidad</dt><dd>GNU/Linux y Windows 11 x64. Instalador de Windows con SUMO incluido.</dd></div>
            </dl>
          </div>
          <div class="software-owned-side">
            <figure class="software-preview">
              <a href="/movilidad-urbana/software/imagenes/walksim-mobility-3.4.2.png" target="_blank" rel="noreferrer" aria-label="Ampliar la imagen de WalkSim Mobility">
                <img src="/movilidad-urbana/software/imagenes/walksim-mobility-3.4.2.png" alt="Ilustración de WalkSim Mobility: corredor peatonal, mapa de densidad e indicadores de operación" width="1672" height="941" loading="lazy" />
              </a>
              <figcaption>Análisis y simulación peatonal · imagen ilustrativa ↗</figcaption>
            </figure>
            <div class="software-owned-actions" aria-label="Recursos de WalkSim Mobility">
              <a class="button button-primary" href="https://github.com/VanLinux/walksim-mobility/releases/download/windows-v3.4.2/WalkSim-Mobility-3.4.2-Windows-x64-Setup.exe">Descargar para Windows <span aria-hidden="true">EXE ↓</span></a>
              <small style="color:var(--muted);line-height:1.5;font-size:.7rem">Windows 11 x64 · 199 MB · SUMO incluido. Instalador sin firma digital. No incluye compilador LaTeX.</small>
              <a class="button button-secondary" href="/movilidad-urbana/software/manuales/Manual_Usuario_WalkSim_Mobility_v3_4_2.pdf" target="_blank" rel="noreferrer">Consultar manual <span aria-hidden="true">PDF · 3.4.2 ↗</span></a>
              <a class="button button-secondary" href="https://github.com/VanLinux/walksim-mobility" target="_blank" rel="noreferrer">Ver código fuente <span aria-hidden="true">GitHub ↗</span></a>
            </div>
          </div>
        </article>
    </div>
  `;

  archiveHero.insertAdjacentElement("afterend", ownedSoftwareSection);
}
