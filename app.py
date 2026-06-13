from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

# =============================================================
# FOCUS STUDY — Archivo principal de Flask
# =============================================================
# Este archivo conecta cada URL del sitio con su página HTML.
# Cada @app.route define una dirección web y qué página mostrar.
#
# Para agregar una página nueva:
#   1. Crear el archivo HTML en templates/
#   2. Agregar un @app.route abajo con la ruta y el nombre
#   3. Usar url_for('nombre_de_la_funcion') en los enlaces HTML
# =============================================================


# ── Página de inicio ──────────────────────────────────────────
# Primera página que ve el usuario al entrar al sitio.

@app.route("/")
def inicio():
    return render_template("inicio.html")


# ── Quiénes Somos ─────────────────────────────────────────────

@app.route("/quienesomos")
def quienesomos():
    return render_template("quienesomos.html")


# ── Login y Registro ──────────────────────────────────────────
# Por ahora el login es solo visual (sin verificación real).
# La lógica de autenticación será implementada por Helmuth
# usando modulos/auth.py en una fase futura.

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/registro")
def registro():
    return render_template("registro.html")


# ── Dashboard → pantalla Inicio (área privada) ────────────────
# Primera pantalla que ve el usuario al iniciar sesión.
# Desde aquí accede a: Zona de Estudio, Complementos, Configuración.
# Menú hamburguesa disponible en todas las páginas del área privada.

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# ── Secciones del área privada ────────────────────────────────
# Accesibles desde el menú hamburguesa (nav.css + nav.js).

@app.route("/complementos")
def complementos():
    return render_template("complementos.html")

@app.route("/configuracion")
def configuracion():
    return render_template("configuracion.html")


# ── Zona de Estudio ───────────────────────────────────────────
# Selector de métodos de estudio.

@app.route("/zonadestudio")
def zonadestudio():
    return render_template("zonadestudio.html")


# ── Métodos de estudio ────────────────────────────────────────

@app.route("/pomodoro")
def pomodoro():
    return render_template("pomodoro.html")

@app.route("/descanso")
def descanso():
    return render_template("descanso.html")


# ── Técnicas (placeholders para fases futuras) ────────────────
# Estas páginas están reservadas pero aún no tienen contenido.
# Karla las implementará cuando el equipo defina el diseño.

@app.route("/tecnicas")
def tecnicas():
    return render_template("tecnicas.html")

@app.route("/tecnica-pomodoro")
def tecnica_pomodoro():
    return render_template("tecnica_pomodoro.html")

@app.route("/tecnica-feynman")
def tecnica_feynman():
    return render_template("tecnica_feynman.html")

@app.route("/tecnica-cornell")
def tecnica_cornell():
    return render_template("tecnica_cornell.html")

@app.route("/tecnica-recall")
def tecnica_recall():
    return render_template("tecnica_recall.html")


# ── Metas (placeholder técnico) ───────────────────────────────
# IMPORTANTE: Las metas NO serán una página independiente
# en el producto final. La funcionalidad de metas vivirá
# integrada dentro de cada método de estudio (pomodoro, etc.).
# Esta ruta existe solo para evitar errores si algo la llama.

@app.route("/metas")
def metas():
    return render_template("metas.html")


# ── Cerrar sesión ─────────────────────────────────────────────
# Regresa al usuario a la página de inicio.

@app.route("/cerrar-sesion")
def cerrar_sesion():
    return redirect(url_for("inicio"))


# =============================================================
# Punto de arranque
# El "if __name__" asegura que esto solo se ejecute cuando
# se corre este archivo directamente, no al importarlo.
# =============================================================

if __name__ == "__main__":
    app.run(debug=True)
