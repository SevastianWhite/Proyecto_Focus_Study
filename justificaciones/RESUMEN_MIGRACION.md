# Resumen de Migración — Fase 1

**Fecha:** 10 de junio de 2026
**Responsable:** Sevastian (coordinación) + revisión técnica completa

---

## ¿Qué se hizo en esta fase?

El objetivo de la Fase 1 fue dejar Flask funcionando correctamente
y ordenar la estructura del proyecto sin tocar el diseño visual.

---

## Cambios realizados

### 1. Creación de `app.py` en la raíz del proyecto

**Problema que resolvía:**
El archivo `app.py` estaba dentro de la carpeta `focus_study/`.
Flask buscaba las páginas HTML y los estilos CSS en la ubicación de `app.py`,
por lo que los buscaba dentro de `focus_study/templates/` y `focus_study/static/`,
lugares donde no existían. El resultado era que Flask no podía mostrar ninguna página.

**Qué se hizo:**
Se reescribió `app.py` desde cero y se colocó en la carpeta principal del proyecto.
Ahora Flask encuentra correctamente `templates/` y `static/`.

**Errores que tenía el archivo original:**
- Dos `@app.route("/")` apilados sin función entre ellos → Flask no podía iniciar
- La ruta del dashboard tenía un error de escritura: `/dashboar` en lugar de `/dashboard`
- `app.run()` estaba suelto en el archivo → se ejecutaba aunque no debiera
- Importaba `csv` y `os` sin usarlos en ninguna parte
- La función principal se llamaba `login()` pero mostraba `inicio.html` (confuso)

**Rutas disponibles ahora:**

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/quienesomos` | Quiénes Somos |
| `/login` | Login |
| `/registro` | Registro (placeholder) |
| `/dashboard` | Dashboard (placeholder) |
| `/zonadestudio` | Zona de Estudio |
| `/pomodoro` | Pomodoro |
| `/descanso` | Descanso |
| `/tecnicas` | Técnicas (placeholder) |
| `/tecnica-pomodoro` | Técnica Pomodoro (placeholder) |
| `/tecnica-feynman` | Técnica Feynman (placeholder) |
| `/tecnica-cornell` | Técnica Cornell (placeholder) |
| `/tecnica-recall` | Active Recall (placeholder) |
| `/metas` | Metas (solo técnico) |
| `/cerrar-sesion` | Redirige a inicio |

---

### 2. Creación de `requirements.txt`

**Problema que resolvía:**
El archivo original estaba vacío. Si un integrante clonaba el proyecto
y ejecutaba `pip install -r requirements.txt`, no instalaba nada,
y Flask no funcionaba en su computador.

**Qué se hizo:**
Se creó con el contenido mínimo necesario: `flask`.

---

### 3. Creación de `README.md` en la raíz

**Problema que resolvía:**
El README estaba dentro de `focus_study/`. GitHub solo muestra el README
si está en la carpeta principal del repositorio.

**Qué se hizo:**
Se creó un README en la raíz con la descripción del proyecto,
los integrantes y las instrucciones para ejecutarlo.

---

### 4. Creación de `.gitignore` en la raíz

**Problema que resolvía:**
El `.gitignore` estaba dentro de `focus_study/` y estaba vacío.
Sin este archivo, Git puede subir archivos que no deberían subirse
(carpetas de caché de Python, entornos virtuales, etc.).

**Qué se hizo:**
Se creó un `.gitignore` en la raíz que ignora:
- Carpetas de caché de Python (`__pycache__/`, `*.pyc`)
- Entornos virtuales (`venv/`, `.venv/`)
- Configuración local de VS Code (`.vscode/`)

**Nota:** `data/usuarios.json` NO está en el .gitignore por decisión del equipo.
Mientras el equipo esté construyendo la estructura, este archivo se comparte en Git.
Cuando contenga contraseñas reales, se deberá agregar al .gitignore.

---

### 5. Eliminación de `focus_study/`

**Problema que resolvía:**
La carpeta no era un paquete Python funcional (no tenía `__init__.py`).
Su único efecto era confundir la estructura y hacer que Flask buscara
los archivos en el lugar equivocado.

**Verificación realizada antes de eliminar:**
Se confirmó que ningún archivo del proyecto importaba ni referenciaba
`focus_study` como módulo. Cero dependencias encontradas.

**Qué se hizo:**
Se movieron sus 4 archivos a la raíz del proyecto y se eliminó la carpeta.

---

### 6. Creación de documentación del equipo

Se crearon dos archivos de documentación:

- **`GUIA_EQUIPO.md`** — explica la estructura del proyecto, quién modifica qué,
  cómo agregar páginas nuevas y cómo agregar estilos. Escrita para estudiantes
  sin conocimientos avanzados de Flask.

- **`RESUMEN_MIGRACION.md`** — este archivo. Registro de todos los cambios
  realizados, por qué se hicieron y qué problema resolvía cada uno.

---

## Lo que NO se tocó en esta fase

- El contenido visual de ningún template HTML
- Ningún archivo CSS
- La carpeta `data/`
- La carpeta `css/` externa (se revisará en Fase 2)
- Las imágenes y el video

---

## Estado del proyecto después de la Fase 1

| Aspecto | Estado |
|---|---|
| Flask arranca sin errores | Listo |
| Todas las rutas están registradas | Listo |
| Estructura de carpetas ordenada | Listo |
| Documentación base creada | Listo |
| CSS con rutas correctas | Pendiente (Fase 2) |
| Imágenes organizadas en `static/img/` | Pendiente (Fase 2) |
| Templates con `url_for` correcto | Pendiente (Fase 2) |
| CSS modular (`base`, `componentes`, `layout`) | Pendiente (Fase 2) |
| Login funcional | Pendiente (Fase 3) |
| Dashboard con navegación real | Pendiente (fase futura) |

---

## Tabla de responsabilidades del proyecto

| Integrante | Área | Archivos principales |
|---|---|---|
| **Karla** | HTML y estructura visual | `templates/*.html` |
| **Monserrat** | CSS y diseño visual | `static/css/*.css` |
| **Helmuth y Sevastian** | Flask, backend y autenticación | `app.py`, `data/` |
| **Sevastian** | Coordinación, integración y documentación | `README.md`, `GUIA_EQUIPO.md`, revisión general |

---

## ¿Qué debe hacer el equipo a partir de ahora?

1. **Todos:** hacer `git pull` para tener la nueva estructura en sus computadores.
2. **Helmuth:** revisar el nuevo `app.py` y confirmar que las rutas están correctas.
3. **Monserrat:** revisar `static/css/` — en Fase 2 se organizará el CSS modular.
4. **Karla:** revisar `templates/` — en Fase 2 se crearán `base.html` y se corregirán los enlaces.
5. **Sevastian:** coordinar el inicio de la Fase 2 una vez aprobada esta fase.
