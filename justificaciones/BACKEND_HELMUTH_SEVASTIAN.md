# Backend — Helmuth y Sevastian

Acá explicamos la lógica del servidor: las rutas de Flask, cómo manejamos los usuarios y las sesiones.

---

## Cómo funciona el servidor

Usamos Flask, que es un framework de Python para hacer aplicaciones web. El archivo principal es `app.py` en la raíz del proyecto. Desde ahí se definen todas las rutas (las URLs que responde la aplicación) y la lógica detrás de cada una.

Para correrlo:
```
flask run
```

El servidor escucha en `http://127.0.0.1:5000` por defecto.

---

## Los usuarios — data/usuarios.json

No usamos base de datos. Los usuarios se guardan en un archivo JSON simple:

```json
{
  "usuarios": [
    { "nombre": "Juan", "correo": "juan@correo.com", "contrasena": "12345678" }
  ]
}
```

Hay dos funciones auxiliares en app.py para leer y guardar ese archivo:

```python
def leer_usuarios():
    with open('data/usuarios.json', encoding='utf-8') as f:
        return json.load(f)['usuarios']

def guardar_usuarios(lista):
    with open('data/usuarios.json', 'w', encoding='utf-8') as f:
        json.dump({'usuarios': lista}, f, ensure_ascii=False, indent=2)
```

---

## Login

La ruta `/login` acepta GET y POST.

- GET → muestra el formulario (login.html)
- POST → busca en el JSON si existe alguien con ese correo y contraseña

```python
usuario = None
for u in usuarios:
    if u['correo'] == correo and u['contrasena'] == contrasena:
        usuario = u
        break
```

Si lo encuentra, guarda el nombre y correo en la sesión y redirige al dashboard. Si no, devuelve el template con un mensaje de error y el correo que había escrito para no obligar al usuario a repetirlo.

---

## Registro

La ruta `/registro` solo acepta POST (el formulario está en el dorso del flip card del login).

Antes de guardar valida:
- Que nombre, correo y contraseña no estén vacíos
- Que el correo tenga exactamente un `@` y un punto en el dominio
- Que la contraseña tenga al menos 8 caracteres
- Que el correo no esté ya registrado

Si pasa todas las validaciones, agrega el usuario al JSON y lo mete a sesión directo para que no tenga que loguearse después de registrarse.

---

## Sesión de Flask

Usamos `session` de Flask para mantener al usuario "logueado" mientras navega. Se necesita una `secret_key` para que las sesiones funcionen (está en app.py).

Lo que guardamos en sesión:
- `session['usuario']` → el nombre
- `session['correo']` → el correo (para saber qué usuario actualizar en el JSON)
- `session['focus_minutes']`, `session['break_minutes']`, `session['cycles']` → los ajustes del temporizador si los cambia
- `session['study_goal']` y `session['quick_notes']` → las notas del pomodoro

Para cerrar sesión simplemente se limpia todo:
```python
session.clear()
return redirect(url_for('inicio'))
```

---

## Configuración del nombre

En la página de configuración el usuario puede cambiar su nombre. Eso actualiza dos cosas a la vez:
- La sesión (para que el saludo cambie de inmediato)
- El JSON (para que quede guardado para la próxima vez que entre)

```python
session['usuario'] = nuevo_nombre
# luego busca por correo en el JSON y actualiza el nombre ahí también
```

---

## APIs internas (fetch desde el navegador)

Hay dos rutas que no devuelven HTML, devuelven JSON. Las usa el JavaScript de pomodoro.js:

`POST /api/config` → recibe los minutos de enfoque, descanso y ciclos. Los guarda en sesión y responde con los valores actualizados.

`POST /api/notes` → recibe la meta de estudio y las notas rápidas. Las guarda en sesión (con límite de caracteres para no pasarse del tamaño de la cookie).

---

## Cómo se conecta el Pomodoro con el Descanso

Cuando se acaba el tiempo de enfoque, `pomodoro.js` manda al usuario a `/descanso` pasando
los datos por la URL (cuántos minutos de descanso, en qué ciclo va, cuántos ciclos en total):

```javascript
window.location.href = '/descanso?tipo=corto&min=5&ciclo=2&totalCiclos=4';
```

La ruta `/descanso` en `app.py` lee esos datos y además calcula a qué ciclo hay que volver
después del descanso (`siguiente_ciclo`). El botón "Omitir descanso" usa ese número para
volver a `/pomodoro?ciclo=3`, y `app.py` se lo pasa al JavaScript del Pomodoro para que el
temporizador arranque en el ciclo correcto en vez de reiniciar siempre desde el 1.

---

## Rutas protegidas

Por ahora las rutas del área privada no tienen un decorador de protección formal, pero el dashboard recibe `nombre=session.get('usuario', 'Estudiante')`. Si no hay sesión activa devuelve el valor por defecto. Esto es algo a mejorar más adelante si se quiere un login obligatorio real.
