from flask import Flask, render_template, redirect, url_for, request, session, jsonify
import json
import os

app = Flask(__name__)
app.secret_key = 'focusstudy_clave_2026'

# app.py — Rutas principales de Focus Study
# Conecta cada URL del sitio con su template HTML y maneja el login y la sesión.


# Configuración por defecto del Pomodoro

POMODORO_DEFAULT = {
    'focus_minutes': 25,
    'break_minutes': 5,
    'cycles': 4
}


# Funciones para leer y guardar usuarios en JSON

def leer_usuarios():
    ruta = os.path.join('data', 'usuarios.json')
    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            return json.load(f).get('usuarios', [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def guardar_usuarios(lista):
    ruta = os.path.join('data', 'usuarios.json')
    with open(ruta, 'w', encoding='utf-8') as f:
        json.dump({'usuarios': lista}, f, ensure_ascii=False, indent=2)

def get_pomodoro_config():
    # focus_minutes sí se puede cambiar desde el modal; el descanso y los ciclos son fijos.
    return {
        'focus_minutes': session.get('focus_minutes', POMODORO_DEFAULT['focus_minutes']),
        'break_minutes': POMODORO_DEFAULT['break_minutes'],
        'cycles': POMODORO_DEFAULT['cycles']
    }


# Inicio (pública)

@app.route('/')
def inicio():
    return render_template('inicio.html')


# Quiénes somos (pública)

@app.route('/quienesomos')
def quienesomos():
    return render_template('quienesomos.html')


# Login
# GET  → muestra el formulario
# POST → verifica credenciales contra data/usuarios.json

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        correo = request.form.get('correo', '').strip()
        contrasena = request.form.get('contrasena', '').strip()

        usuarios = leer_usuarios()

        # Recorremos la lista buscando uno cuyo correo y contraseña coincidan.
        usuario = None
        for u in usuarios:
            if u['correo'] == correo and u['contrasena'] == contrasena:
                usuario = u
                break

        if usuario:
            session['usuario'] = usuario['nombre']
            session['correo'] = usuario['correo']
            return redirect(url_for('dashboard'))

        return render_template('login.html',
                               error='Correo o contraseña incorrectos',
                               correo_previo=correo)

    return render_template('login.html')


# Registro
# Solo acepta POST — el formulario viene del dorso del flip-card en login.html

@app.route('/registro', methods=['POST'])
def registro():
    nombre = request.form.get('nombre', '').strip()
    correo = request.form.get('correo', '').strip()
    contrasena = request.form.get('contrasena', '').strip()

    if not nombre or not correo or not contrasena:
        return render_template('login.html',
                               error_reg='Todos los campos son obligatorios',
                               mostrar_registro=True)

    if correo.count('@') != 1 or '.' not in correo.split('@')[1]:
        return render_template('login.html',
                               error_reg='El correo no tiene un formato válido',
                               mostrar_registro=True)

    if len(contrasena) < 8:
        return render_template('login.html',
                               error_reg='La contraseña debe tener al menos 8 caracteres',
                               mostrar_registro=True)

    usuarios = leer_usuarios()

    # Revisamos uno por uno si ya hay alguien registrado con ese correo.
    correo_repetido = False
    for u in usuarios:
        if u['correo'] == correo:
            correo_repetido = True
            break

    if correo_repetido:
        return render_template('login.html',
                               error_reg='Ya existe una cuenta con ese correo',
                               mostrar_registro=True)

    nuevo = {'nombre': nombre, 'correo': correo, 'contrasena': contrasena}
    usuarios.append(nuevo)
    guardar_usuarios(usuarios)

    session['usuario'] = nombre
    session['correo'] = correo
    return redirect(url_for('dashboard'))


# Dashboard (Inicio del área privada)

@app.route('/dashboard')
def dashboard():
    # Si por alguna razón no hay sesión, mostramos "Estudiante" en vez de quedar vacío.
    nombre = session.get('usuario', 'Estudiante')
    return render_template('dashboard.html', nombre=nombre)


# Complementos

@app.route('/complementos')
def complementos():
    return render_template('complementos.html')


# Configuración

@app.route('/configuracion', methods=['GET', 'POST'])
def configuracion():
    if request.method == 'POST':
        nuevo_nombre = request.form.get('nombre', '').strip()
        if nuevo_nombre and len(nuevo_nombre) <= 30:
            session['usuario'] = nuevo_nombre
            # Actualizar el nombre en usuarios.json también
            correo = session.get('correo')
            if correo:
                usuarios = leer_usuarios()
                for u in usuarios:
                    if u['correo'] == correo:
                        u['nombre'] = nuevo_nombre
                        break
                guardar_usuarios(usuarios)
        return redirect(url_for('configuracion'))

    return render_template('configuracion.html',
                           nombre_actual=session.get('usuario', ''))


# Zona de Estudio

@app.route('/zonadestudio')
def zonadestudio():
    return render_template('zonadestudio.html')


# Pomodoro
# Pasa la config y las notas al template para que {{ config.* }} no lleguen vacías.
# Si viene de /descanso, la URL trae el ciclo en el que iba (?ciclo=2).

@app.route('/pomodoro')
def pomodoro():
    ciclo_inicial = int(request.args.get('ciclo', 1))
    notas = {
        'goal': session.get('study_goal', ''),
        'notes': session.get('quick_notes', '')
    }
    return render_template('pomodoro.html',
                           config=get_pomodoro_config(),
                           notes=notas,
                           ciclo_inicial=ciclo_inicial)


# Descanso
# Recibe parámetros desde pomodoro.js cuando termina un ciclo de enfoque.
# tipo='corto' → 5 min  |  tipo='largo' → 15 min (al completar todos los ciclos)

@app.route('/descanso')
def descanso():
    tipo = request.args.get('tipo', 'corto')
    minutos = int(request.args.get('min', 5))
    ciclo = int(request.args.get('ciclo', 1))
    total = int(request.args.get('totalCiclos', 4))
    # Si ya hizo el último ciclo, el botón "Omitir descanso" vuelve a empezar en el 1
    siguiente_ciclo = 1 if ciclo >= total else ciclo + 1
    return render_template('descanso.html',
                           tipo=tipo,
                           minutos=minutos,
                           ciclo=ciclo,
                           total_ciclos=total,
                           siguiente_ciclo=siguiente_ciclo)


# API del Pomodoro
# pomodoro.js llama estas rutas con fetch() sin recargar la página.

@app.route('/api/config', methods=['POST'])
def api_config():
    data = request.get_json(silent=True) or {}
    # Solo el tiempo de enfoque es configurable; el descanso y los ciclos son fijos.
    session['focus_minutes'] = int(data.get('focus_minutes', POMODORO_DEFAULT['focus_minutes']))
    return jsonify({'status': 'ok', 'config': get_pomodoro_config()})

@app.route('/api/notes', methods=['POST'])
def api_notes():
    data = request.get_json(silent=True) or {}
    session['study_goal'] = data.get('goal', '')[:300]
    session['quick_notes'] = data.get('notes', '')[:500]
    return jsonify({'status': 'ok'})


# Técnicas de estudio

@app.route('/tecnica-feynman')
def tecnica_feynman():
    return render_template('tecnica_feynman.html')

@app.route('/tecnica-cornell')
def tecnica_cornell():
    return render_template('tecnica_cornell.html')

@app.route('/tecnica-recall')
def tecnica_recall():
    return render_template('tecnica_recall.html')


# Cerrar sesión

@app.route('/cerrar-sesion')
def cerrar_sesion():
    session.clear()
    return redirect(url_for('inicio'))


if __name__ == '__main__':
    app.run(debug=True)
