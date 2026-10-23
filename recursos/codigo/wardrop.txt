function wardrop()
  % ======================================================================
  % WARDROP: Equilibrio de usuario (UE) y optimo del sistema (SO)
  % Para RUTAS PARALELAS, independientes, con costos lineales:
  %                  t_i(x_i) = t0_i + a_i * x_i
  %
  % Autor: ejemplo educativo para GNU Octave (sin paquetes adicionales).
  % Uso: desde la carpeta que contiene este archivo, ejecutar: wardrop
  %
  % ATENCION: Si el flujo se expresa en veh/h en lugar de autos,
  % a_i debe tener unidades min/(veh/h). Las rutas no comparten enlaces.
  % ======================================================================

  clc;
  fprintf('\n=============================================================\n');
  fprintf('  MODELO DE ASIGNACION DE TRAFICO - EQUILIBRIO DE WARDROP\n');
  fprintf('=============================================================\n');
  fprintf('  t_i(x_i) = t0_i + a_i * x_i\n');
  fprintf('  UE: todos los caminos USADOS tienen tiempo minimo igual.\n');
  fprintf('  SO: se minimiza el tiempo TOTAL de todos los usuarios.\n');
  fprintf('  NOTA: una ruta puede quedar SIN vehiculos.\n\n');

  fprintf('  1. Capturar un problema nuevo\n');
  fprintf('  2. Ejecutar ejemplo de tres rutas\n\n');
  modo = leer_numero('Selecciona una opcion [1-2]: ', 1, 2, true);

  if modo == 2
    t0 = [10, 12, 15];
    a = [0.03, 0.02, 0.01];
    N = 500;
    n = numel(t0);
    fprintf('\nEJEMPLO: 500 autos; tiempos libres 10, 12 y 15 min;');
    fprintf('\n          incrementos 0.03, 0.02 y 0.01 min/auto.\n');
  else
    n = leer_numero('Numero de rutas paralelas [1-20]: ', 1, 20, true);
    N = leer_numero('Cantidad total de autos (entero >= 0): ', ...
                   0, 1000000000, true);
    t0 = zeros(1, n);
    a = zeros(1, n);
    fprintf('\nUnidades: tiempos en minutos, incrementos en min/auto.\n');
    fprintf('Se admite incremento cero (tiempo constante).\n');
    for i = 1:n
      fprintf('\n--- RUTA %d ---\n', i);
      t0(i) = leer_numero('Tiempo de recorrido sin autos [min]: ', ...
                          0, 1e12, false);
      a(i) = leer_numero('Incremento de tiempo por auto [min/auto]: ', ...
                         0, 1e12, false);
    endfor
  endif

  % Solucion UE, exacta dentro de la precision de doble precision.
  [xUE, tiempoEquilibrio] = equilibrio_lineal(t0, a, N);
  tUE = t0 + a .* xUE;

  % Solucion UE con AUTOS ENTEROS (equilibrio discreto, via potencial).
  xEnteros = equilibrio_entero(t0, a, N, xUE);
  tEnteros = t0 + a .* xEnteros;

  % Optimo del sistema: costo marginal social = t0_i + 2*a_i*x_i.
  [xSO, ~] = equilibrio_lineal(t0, 2*a, N);
  tSO = t0 + a .* xSO;

  totalUE = sum(xUE .* tUE);         % vehiculo-minutos
  totalEnteros = sum(xEnteros .* tEnteros);
  totalSO = sum(xSO .* tSO);

  if N > 0
    mediaUE = totalUE / N;
    mediaEnteros = totalEnteros / N;
    mediaSO = totalSO / N;
  else
    mediaUE = NaN;
    mediaEnteros = NaN;
    mediaSO = NaN;
  endif

  if totalSO > 0
    poa = totalUE / totalSO;          % Price of Anarchy
    ahorro = 100 * (totalUE - totalSO) / totalUE;
  else
    poa = 1;
    ahorro = 0;
  endif

  tolerancia = 1e-7 * max(1, abs(tiempoEquilibrio));
  utilizadas = find(xUE > 1e-9 * max(1, N));
  if isempty(utilizadas)
    errorMaximo = 0;
  else
    errorMaximo = max(abs(tUE(utilizadas) - tiempoEquilibrio));
  endif
  if N > 0
    % La prueba incluye posibles nuevas rutas: cambiar de i a j requiere
    % pagar t_j(x_j+1) despues de insertar el auto en j.
    gananciaUnilateral = max(0, max(tEnteros(xEnteros > 0)) ...
                           - min(t0 + a .* (xEnteros + 1)));
  else
    gananciaUnilateral = 0;
  endif

  fprintf('\n\n=============================================================\n');
  fprintf(' RESULTADOS DE ASIGNACION (%d autos)\n', N);
  fprintf('=============================================================\n');
  fprintf('%-6s %11s %11s %12s %12s %12s %12s\n', ...
          'Ruta', 't0(min)', 'a(min/a)', 'UE(cont.)', 'UE(ent.)', ...
          'SO(cont.)', 't_UE(min)');
  fprintf('%s\n', repmat('-', 1, 83));
  for i = 1:n
    fprintf('%-6d %11.4f %11.5f %12.4f %12d %12.4f %12.4f\n', ...
            i, t0(i), a(i), xUE(i), xEnteros(i), xSO(i), tUE(i));
  endfor
  fprintf('%s\n', repmat('-', 1, 83));
  fprintf('TOTAL: UE continua = %.6f; UE entera = %d; SO = %.6f\n', ...
          sum(xUE), sum(xEnteros), sum(xSO));

  fprintf('\nINTERPRETACION\n');
  if N == 0
    fprintf('  No hay demanda: no se asignaron vehiculos.\n');
  else
    fprintf('  Tiempo comun de las rutas utilizadas en UE: %.6f min\n', ...
            tiempoEquilibrio);
    fprintf('  Tiempo medio de viaje con UE:              %.6f min/auto\n', ...
            mediaUE);
    fprintf('  Tiempo medio de viaje con UE entera:       %.6f min/auto\n', ...
            mediaEnteros);
    fprintf('  Tiempo medio de viaje con SO:              %.6f min/auto\n', ...
            mediaSO);
  endif
  fprintf('  Tiempo total UE:           %.6f auto-min\n', totalUE);
  fprintf('  Tiempo total UE entera:    %.6f auto-min\n', totalEnteros);
  fprintf('  Tiempo total SO:           %.6f auto-min\n', totalSO);
  fprintf('  Precio de la anarquia:     %.6f\n', poa);
  fprintf('  Ahorro potencial con SO:   %.4f %%\n', ahorro);
  fprintf('  Residuo maximo Wardrop UE: %.3e min\n', errorMaximo);
  fprintf('  Mejora maxima unilateral en UE entera: %.3e min\n', ...
          gananciaUnilateral);

  if N > 0 && gananciaUnilateral > tolerancia
    warning('La solucion entera presenta residuo numerico; revisar entradas.');
  endif

  fprintf('\nNOTAS IMPORTANTES\n');
  fprintf('  - Rutas no usadas pueden tener tiempos MAYORES al minimo.\n');
  fprintf('  - La UE continua puede asignar fracciones de vehiculo.\n');
  fprintf('  - En la UE entera los tiempos no siempre son identicos,\n');
  fprintf('    pero ningun conductor gana cambiando unilateralmente.\n');
  fprintf('  - SO iguala costos MARGINALES, no necesariamente tiempos.\n');

  carpeta = ['resultados_wardrop_', datestr(now(), 'yyyymmdd_HHMMSS')];
  [creada, mensaje] = mkdir(carpeta);
  if ~creada
    error('No se pudo crear la carpeta de resultados: %s', mensaje);
  endif

  exportar_csv(fullfile(carpeta, 'asignacion.csv'), t0, a, ...
               xUE, xEnteros, xSO, tUE, tEnteros, tSO);
  exportar_resumen(fullfile(carpeta, 'resumen.txt'), N, ...
                   tiempoEquilibrio, totalUE, totalEnteros, totalSO, ...
                   mediaUE, mediaEnteros, mediaSO, poa, ahorro, ...
                   errorMaximo, gananciaUnilateral);

  % Evolucion cuando cambia la demanda, manteniendo t0 y a fijos.
  maxDemanda = max(1, 1.6 * N);
  demandas = linspace(0, maxDemanda, 81)';
  flujosSens = zeros(numel(demandas), n);
  tiemposSens = zeros(numel(demandas), 1);
  mediaSOSens = zeros(numel(demandas), 1);
  poaSens = ones(numel(demandas), 1);

  for k = 1:numel(demandas)
    q = demandas(k);
    [xu, tu] = equilibrio_lineal(t0, a, q);
    [xs, ~] = equilibrio_lineal(t0, 2*a, q);
    flujosSens(k, :) = xu;
    tiemposSens(k) = tu;
    if q > 0
      costou = sum(xu .* (t0 + a .* xu));
      costos = sum(xs .* (t0 + a .* xs));
      mediaSOSens(k) = costos / q;
      if costos > 0
        poaSens(k) = costou / costos;
      endif
    else
      mediaSOSens(k) = min(t0);
    endif
  endfor

  exportar_sensibilidad(fullfile(carpeta, 'sensibilidad.csv'), ...
                       demandas, flujosSens, tiemposSens, ...
                       mediaSOSens, poaSens);

  % Las graficas son opcionales: los datos y archivos CSV quedan guardados.
  try
    graficar_panel(carpeta, n, N, t0, a, xUE, xEnteros, ...
                   xSO, tUE, tSO, tiempoEquilibrio, ...
                   totalUE, totalEnteros, totalSO);
    graficar_sensibilidad(carpeta, N, demandas, flujosSens, ...
                         tiemposSens, mediaSOSens, poaSens);
    fprintf('\nGraficas PNG generadas correctamente.\n');
  catch err
    fprintf('\nNo se pudieron exportar las graficas: %s\n', err.message);
    fprintf('Los resultados numericos y CSV SI se guardaron.\n');
  end_try_catch

  fprintf('\nARCHIVOS GENERADOS EN: %s\n', fullfile(pwd(), carpeta));
  fprintf('  - asignacion.csv\n');
  fprintf('  - resumen.txt\n');
  fprintf('  - sensibilidad.csv\n');
  fprintf('  - panel_wardrop.png (si hay entorno grafico disponible)\n');
  fprintf('  - sensibilidad_wardrop.png (si hay entorno grafico disponible)\n\n');
endfunction


function valor = leer_numero(pregunta, minimo, maximo, entero)
  % Entrada robusta; acepta punto o coma como separador decimal.
  while true
    texto = strtrim(input(pregunta, 's'));
    texto = strrep(texto, ',', '.');
    valor = str2double(texto);
    valido = isscalar(valor) && isreal(valor) && isfinite(valor) ...
             && valor >= minimo && valor <= maximo;
    if entero
      valido = valido && (valor == fix(valor));
    endif
    if valido
      return;
    endif
    if entero
      fprintf('  Valor invalido: se requiere entero entre %.0f y %.0f.\n', ...
              minimo, maximo);
    else
      fprintf('  Valor invalido: se requiere numero entre %g y %g.\n', ...
              minimo, maximo);
    endif
  endwhile
endfunction


function [x, lambda] = equilibrio_lineal(t0, pendiente, demanda)
  % Resuelve min sum_i integral_0^xi (t0_i + pendiente_i*u) du
  % sujeto a sum(xi)=demanda, xi>=0.
  % KKT: xi = max(0, (lambda-t0_i)/pendiente_i) para pendiente_i>0.
  % Las rutas de pendiente nula necesitan tratamiento especial.
  n = numel(t0);
  x = zeros(1, n);
  lambda = min(t0);
  if demanda <= 0
    return;
  endif

  positivos = find(pendiente > 0);
  constantes = find(pendiente == 0);

  if isempty(positivos)
    candidatas = find(t0 == min(t0));
    x(candidatas) = demanda / numel(candidatas);
    return;
  endif

  techo = Inf;
  if ~isempty(constantes)
    techo = min(t0(constantes));
    cargaHastaTecho = sum(max(0, (techo-t0(positivos)) ...
                                 ./ pendiente(positivos)));
    if demanda >= cargaHastaTecho
      x(positivos) = max(0, (techo-t0(positivos)) ...
                                ./ pendiente(positivos));
      libres = find(pendiente == 0 & t0 == techo);
      sobrante = demanda - sum(x);
      % Corrige una pequena diferencia por redondeo flotante.
      if sobrante < 0
        x(positivos) = x(positivos) * (demanda / sum(x(positivos)));
        sobrante = 0;
      endif
      x(libres) = sobrante / numel(libres);
      lambda = techo;
      return;
    endif
  endif

  bajo = min(t0);
  if isfinite(techo)
    alto = techo;
  else
    alto = min(t0(positivos) + pendiente(positivos) * demanda);
  endif

  % Biseccion monotona en el tiempo comun.
  for paso = 1:110
    medio = bajo + (alto - bajo) / 2;
    asignados = sum(max(0, (medio - t0(positivos)) ...
                           ./ pendiente(positivos)));
    if asignados < demanda
      bajo = medio;
    else
      alto = medio;
    endif
  endfor
  lambda = bajo + (alto - bajo) / 2;

  % Recalcula analiticamente lambda sobre el conjunto activo; mejora
  % la conservacion exacta del numero de autos al evitar errores de biseccion.
  activos = positivos(lambda > t0(positivos));
  if isempty(activos)
    [~, j] = min(t0(positivos));
    activos = positivos(j);
  endif
  inversas = 1 ./ pendiente(activos);
  lambda = (demanda + sum(t0(activos) .* inversas)) / sum(inversas);
  x(positivos) = max(0, (lambda - t0(positivos)) ...
                         ./ pendiente(positivos));

  % Ajuste unicamente por precision numerica.
  diferencia = demanda - sum(x);
  if abs(diferencia) > 1e-11 * max(1, demanda)
    activos = find(x > 0);
    if ~isempty(activos)
      x(activos) = x(activos) * (demanda / sum(x(activos)));
    endif
  endif
endfunction


function x = equilibrio_entero(t0, a, demanda, xContinuo)
  % Para costos t_i(k)=t0_i+a_i*k, un equilibrio de Nash discreto
  % minimiza el potencial de Rosenthal:
  %       Phi(x)=sum_i sum_{k=1}^{x_i} (t0_i+a_i*k).
  % Se aprovecha la solucion continua: floor(x_i) en rutas crecientes
  % pertenece a los menores costos marginales; solo se asignan restos.
  n = numel(t0);
  x = zeros(1, n);
  if demanda <= 0
    return;
  endif

  crecientes = (a > 0);
  x(crecientes) = floor(xContinuo(crecientes));
  restantes = round(demanda - sum(x));

  % Optimizacion: una ruta constante mas barata absorbe todos los restos.
  ctes = find(a == 0);
  if ~isempty(ctes) && restantes > 0
    menorConstante = min(t0(ctes));
    candidatas = find(a == 0 & t0 == menorConstante);
    proximoMinimo = min(t0 + a .* (x + 1));
    if menorConstante <= proximoMinimo
      reparto = floor(restantes / numel(candidatas));
      residuo = mod(restantes, numel(candidatas));
      x(candidatas) = reparto;
      if residuo > 0
        x(candidatas(1:residuo)) = x(candidatas(1:residuo)) + 1;
      endif
      return;
    endif
  endif

  % Normalmente restantes < numero de rutas; no recorre los N autos.
  for k = 1:restantes
    [~, j] = min(t0 + a .* (x + 1));
    x(j) = x(j) + 1;
  endfor
endfunction


function exportar_csv(archivo, t0, a, xu, xe, xs, tu, te, ts)
  fid = fopen(archivo, 'w');
  if fid < 0
    error('No se pudo crear %s', archivo);
  endif
  fprintf(fid, ['ruta,t0_min,a_min_por_auto,UE_continua_autos,', ...
                'UE_entera_autos,SO_continua_autos,', ...
                'tiempo_UE_min,tiempo_UE_entera_min,tiempo_SO_min\n']);
  for i = 1:numel(t0)
    fprintf(fid, '%d,%.12g,%.12g,%.12g,%d,%.12g,%.12g,%.12g,%.12g\n', ...
            i, t0(i), a(i), xu(i), xe(i), xs(i), tu(i), te(i), ts(i));
  endfor
  fclose(fid);
endfunction


function exportar_resumen(archivo, N, T, totalu, totale, totals, ...
                          mediou, mediae, medias, poa, ahorro, error, mejora)
  fid = fopen(archivo, 'w');
  if fid < 0
    error('No se pudo crear %s', archivo);
  endif
  fprintf(fid, 'EQUILIBRIO DE WARDROP - RUTAS PARALELAS LINEALES\n');
  fprintf(fid, 'Demanda total: %d autos\n', N);
  fprintf(fid, 'Tiempo comun de equilibrio continuo: %.10f min\n', T);
  fprintf(fid, 'Tiempo total UE: %.10f auto-min\n', totalu);
  fprintf(fid, 'Tiempo total UE entera: %.10f auto-min\n', totale);
  fprintf(fid, 'Tiempo total SO: %.10f auto-min\n', totals);
  fprintf(fid, 'Tiempo medio UE: %.10f min/auto\n', mediou);
  fprintf(fid, 'Tiempo medio UE entera: %.10f min/auto\n', mediae);
  fprintf(fid, 'Tiempo medio SO: %.10f min/auto\n', medias);
  fprintf(fid, 'Precio de la anarquia: %.10f\n', poa);
  fprintf(fid, 'Ahorro potencial SO: %.8f %%\n', ahorro);
  fprintf(fid, 'Error maximo UE: %.10g min\n', error);
  fprintf(fid, 'Maxima mejora unilateral discreta: %.10g min\n', mejora);
  fprintf(fid, '\nUE continua: tiempos iguales SOLO en rutas usadas.\n');
  fprintf(fid, 'UE entera: ningun conductor mejora moviendose solo.\n');
  fprintf(fid, 'SO: iguala costos marginales, no tiempos.\n');
  fclose(fid);
endfunction


function exportar_sensibilidad(archivo, demandas, flujos, tiempos, mediasSO, poa)
  fid = fopen(archivo, 'w');
  if fid < 0
    error('No se pudo crear %s', archivo);
  endif
  fprintf(fid, 'demanda_autos,tiempo_UE_min,media_SO_min,precio_anarquia');
  for i = 1:columns(flujos)
    fprintf(fid, ',autos_UE_ruta_%d', i);
  endfor
  fprintf(fid, '\n');
  for k = 1:numel(demandas)
    fprintf(fid, '%.12g,%.12g,%.12g,%.12g', ...
            demandas(k), tiempos(k), mediasSO(k), poa(k));
    fprintf(fid, ',%.12g', flujos(k, :));
    fprintf(fid, '\n');
  endfor
  fclose(fid);
endfunction


function visible = visibilidad_figuras()
  if isempty(getenv('DISPLAY')) && isempty(getenv('WAYLAND_DISPLAY'))
    visible = 'off';
  else
    visible = 'on';
  endif
endfunction


function graficar_panel(carpeta, n, N, t0, a, xu, xe, xs, tu, ts, ...
                        equilibrio, totalu, totale, totals)
  figura = figure('name', 'Wardrop - Panel general', ...
                  'visible', visibilidad_figuras(), ...
                  'position', [50, 50, 1250, 830], ...
                  'color', [1 1 1]);

  subplot(2, 2, 1);
  bar(1:n, [xu(:), xe(:), xs(:)], 'grouped');
  title('Distribucion de vehiculos');
  xlabel('Ruta'); ylabel('Autos');
  set(gca, 'xtick', 1:n); grid on;
  legend({'UE continua', 'UE entera', 'Optimo social'}, ...
         'location', 'northoutside');

  subplot(2, 2, 2);
  bar(1:n, [tu(:), ts(:)], 'grouped'); hold on;
  plot([0.5, n+0.5], [equilibrio, equilibrio], ...
       'k--', 'linewidth', 1.4);
  hold off;
  title('Tiempos de viaje por ruta');
  xlabel('Ruta'); ylabel('Minutos');
  set(gca, 'xtick', 1:n); grid on;
  legend({'UE', 'Optimo social', 'Tiempo comun UE'}, ...
         'location', 'northoutside');

  subplot(2, 2, 3);
  eje = linspace(0, max(1, N), 150);
  colores = lines(n);
  nombres = cell(1, n);
  curvas = zeros(1, n);
  hold on;
  for i = 1:n
    curvas(i) = plot(eje, t0(i) + a(i) * eje, ...
                     'color', colores(i, :), 'linewidth', 1.5);
    plot(xu(i), tu(i), 'o', 'color', colores(i, :), ...
         'markerfacecolor', colores(i, :), 'markersize', 6);
    nombres{i} = sprintf('Ruta %d', i);
  endfor
  hold off;
  title('Funciones de tiempo y puntos UE');
  xlabel('Autos asignados a la ruta'); ylabel('Tiempo [min]');
  grid on;
  if n <= 10
    legend(curvas, nombres, 'location', 'northwest');
  endif

  subplot(2, 2, 4);
  bar(1:3, [totalu, totale, totals]);
  set(gca, 'xtick', 1:3, 'xticklabel', ...
      {'UE continua', 'UE entera', 'Optimo social'});
  title('Costo agregado de la red');
  ylabel('Tiempo total [auto-min]'); grid on;

  print(figura, fullfile(carpeta, 'panel_wardrop.png'), '-dpng', '-r150');
endfunction


function graficar_sensibilidad(carpeta, N, demandas, flujos, ...
                              tiempos, mediasSO, poa)
  n = columns(flujos);
  figura = figure('name', 'Wardrop - Analisis de sensibilidad', ...
                  'visible', visibilidad_figuras(), ...
                  'position', [90, 80, 1120, 930], ...
                  'color', [1 1 1]);

  subplot(3, 1, 1);
  plot(demandas, tiempos, 'b-', 'linewidth', 2); hold on;
  plot(demandas, mediasSO, 'r--', 'linewidth', 2);
  dibujar_demanda_base(N);
  hold off;
  title('Tiempo de viaje frente a cambios de demanda');
  ylabel('Minutos por auto');
  legend({'Tiempo de equilibrio UE', 'Tiempo medio SO', ...
          'Demanda actual'}, 'location', 'northwest');
  grid on;

  subplot(3, 1, 2);
  plot(demandas, flujos, 'linewidth', 1.7); hold on;
  dibujar_demanda_base(N);
  hold off;
  title('Asignacion a cada ruta segun la demanda (UE)');
  ylabel('Autos por ruta');
  if n <= 10
    nombres = cell(1, n+1);
    for i = 1:n
      nombres{i} = sprintf('Ruta %d', i);
    endfor
    nombres{n+1} = 'Demanda actual';
    legend(nombres, 'location', 'northwest');
  endif
  grid on;

  subplot(3, 1, 3);
  plot(demandas, poa, 'm-', 'linewidth', 2); hold on;
  plot([min(demandas), max(demandas)], [1, 1], 'k:', ...
       'linewidth', 1.2);
  dibujar_demanda_base(N);
  hold off;
  title('Ineficiencia del equilibrio de usuario');
  xlabel('Demanda total [autos]');
  ylabel('Precio de la anarquia (UE / SO)');
  grid on;

  print(figura, fullfile(carpeta, 'sensibilidad_wardrop.png'), ...
        '-dpng', '-r150');
endfunction


function dibujar_demanda_base(N)
  limites = ylim();
  plot([N, N], limites, 'k--', 'linewidth', 1.0);
  ylim(limites);
endfunction
