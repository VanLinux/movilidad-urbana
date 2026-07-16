# Ingeniería en Movilidad Urbana y Transporte

Portal académico publicado con GitHub Pages para organizar clases, artículos, videos,
documentos PDF, ejercicios y prácticas sobre movilidad urbana y transporte.

## Publicar el sitio

1. Abre `Settings` en este repositorio.
2. En el menú lateral, entra a `Pages`.
3. En `Build and deployment`, selecciona `Deploy from a branch`.
4. Elige la rama `main`, la carpeta `/ (root)` y pulsa `Save`.

La dirección pública será:

`https://vanlinux.github.io/movilidad-urbana/`

GitHub puede tardar algunos minutos en completar la primera publicación.

## Estructura

- `index.html`: contenido y secciones del portal.
- `styles.css`: diseño adaptable para computadora, tableta y celular.
- `script.js`: menú móvil, buscador y filtros de recursos.

## Agregar materiales

Los bloques marcados como `En preparación` son espacios listos para recibir enlaces o
archivos. Los documentos pueden organizarse en carpetas como `pdf/`, `practicas/` y
`clases/`; después se enlazan desde `index.html` usando rutas relativas.

## Vista local

Para revisar el sitio antes de publicar nuevos cambios:

```bash
python3 -m http.server 8000
```

Después abre `http://localhost:8000` en el navegador.
