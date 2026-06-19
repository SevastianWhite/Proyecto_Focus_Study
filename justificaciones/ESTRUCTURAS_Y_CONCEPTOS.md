# Estructuras y conceptos de programación usados

Acá dejamos constancia de los conceptos que usamos en el código (diccionarios, listas,
funciones, etc.), con ejemplos sacados del proyecto y una explicación sencilla de por qué
los usamos. La idea es que cualquiera del equipo pueda señalar dónde está cada cosa y
explicar para qué sirve.

---

## Funciones

Las usamos en todos lados para no repetir código y para que cada cosa tenga su nombre.

En Python (`app.py`), por ejemplo, separamos en funciones la lectura y escritura del archivo
de usuarios:

```python
def leer_usuarios():
    ruta = os.path.join('data', 'usuarios.json')
    try:
        with open(ruta, 'r', encoding='utf-8') as f:
            return json.load(f).get('usuarios', [])
    except (FileNotFoundError, json.JSONDecodeError):
        return []
```

Así, cada vez que necesitamos los usuarios, llamamos `leer_usuarios()` en lugar de volver a
escribir todo el código de abrir el archivo.

En JavaScript (`pomodoro.js`) pasa lo mismo: tenemos funciones como `formatearTiempo()`,
`avanzarFase()` o `actualizarPantalla()`, cada una encargada de una sola tarea.

**Por qué hay funciones que sí o sí teníamos que usar:**

Algunas funciones no fueron una elección, las pide la propia herramienta:

- **Las rutas de Flask.** Flask obliga a que cada página (cada URL) sea una función con
  `@app.route` arriba. No se puede hacer una página en Flask sin función. Por eso `inicio()`,
  `login()`, `pomodoro()`, etc. son funciones: es la única forma que da Flask.
- **Los botones del Pomodoro.** En el HTML, cada botón llama a una función por su nombre
  (por ejemplo `onclick="iniciarOPausar()"`). El botón necesita tener algo a qué llamar, así
  que esas funciones tienen que existir.

El resto de funciones (como `leer_usuarios()`) las hicimos nosotros para no repetir código:
como esa la usamos en login, registro y configuración, es mejor tenerla una vez en una
función que copiar y pegar lo mismo tres veces.

---

## Diccionarios

Un diccionario guarda datos con un nombre (clave) y un valor. Los usamos bastante.

En Python, la configuración por defecto del Pomodoro es un diccionario:

```python
POMODORO_DEFAULT = {
    'focus_minutes': 25,
    'break_minutes': 5,
    'cycles': 4
}
```

Y cada usuario también es un diccionario con sus datos:

```python
nuevo = {'nombre': nombre, 'correo': correo, 'contrasena': contrasena}
```

Lo usamos porque es la forma más clara de juntar datos que van relacionados: en vez de tener
tres variables sueltas, las metemos en un solo diccionario con nombres que se entienden.

En JavaScript también hay diccionarios (allá se llaman objetos), por ejemplo en `pomodoro.js`:

```javascript
var config = {
  enfoque: SERVER_CONFIG.focus_minutes,
  descanso: SERVER_CONFIG.break_minutes,
  ciclos: SERVER_CONFIG.cycles
};
```

---

## Listas

Una lista es una colección de cosas en orden. La lista más importante es la de usuarios:
cuando leemos `usuarios.json`, obtenemos una lista y le vamos agregando los nuevos.

```python
usuarios = leer_usuarios()      # esto es una lista
usuarios.append(nuevo)          # agregamos un usuario al final
```

En el dashboard también usamos una lista para las frases motivacionales (en JavaScript):

```javascript
var frases = [
    "Pequeños avances diarios generan grandes resultados.",
    "La disciplina supera a la motivación.",
    ...
];
```

De esa lista elegimos una al azar para mostrarla.

---

## Lista de diccionarios (cómo guardamos los usuarios)

Esto es la combinación de las dos cosas de arriba y es la base de nuestro "guardado de datos".
El archivo `usuarios.json` es una lista donde cada elemento es un diccionario:

```json
{
  "usuarios": [
    { "nombre": "Ana",  "correo": "ana@correo.com",  "contrasena": "12345678" },
    { "nombre": "Luis", "correo": "luis@correo.com", "contrasena": "clave1234" }
  ]
}
```

Lo elegimos así porque es fácil de recorrer: podemos pasar uno por uno revisando los correos.
Por ejemplo, para buscar si un correo y contraseña coinciden al iniciar sesión, recorremos
la lista con un `for` y cortamos apenas lo encontramos:

```python
usuario = None
for u in usuarios:
    if u['correo'] == correo and u['contrasena'] == contrasena:
        usuario = u
        break
```

Y para revisar que no se repita un correo al registrarse hacemos lo mismo:

```python
correo_repetido = False
for u in usuarios:
    if u['correo'] == correo:
        correo_repetido = True
        break
```

(Nota: Python tiene atajos más cortos para esto, como `next()` o `any()`, pero preferimos
el `for` normal porque es más claro de leer y de explicar.)

---

## Condicionales (if / else)

Los usamos para tomar decisiones. El ejemplo más claro es revisar si la petición es para
mostrar el formulario (GET) o para procesar datos (POST):

```python
if request.method == 'POST':
    ...  # revisar usuario y contraseña
```

Y en las validaciones del registro (que el nombre no esté vacío, que la contraseña tenga
mínimo 8 caracteres, etc.).

---

## Bucles (for)

Los usamos para repetir algo sobre cada elemento de una lista. Por ejemplo, en
`configuracion`, para encontrar al usuario por su correo y actualizar su nombre:

```python
for u in usuarios:
    if u['correo'] == correo:
        u['nombre'] = nuevo_nombre
        break
```

En JavaScript también hay un bucle en `pomodoro.js` que dibuja un puntito por cada ciclo:

```javascript
for (var i = 1; i <= config.ciclos; i++) {
    ...  # crear el puntito
}
```

Los bucles los tuvimos que usar sí o sí cada vez que trabajamos con la lista de usuarios:
como no sabemos cuántos usuarios hay ni en qué posición está el que buscamos, la única forma
de revisarlos es pasar uno por uno con un `for`. Lo mismo para dibujar los puntitos del
Pomodoro: como la cantidad de ciclos la decide el usuario, repetimos con un `for` según ese
número en vez de escribirlos a mano.

---

## JSON

JSON es el formato en el que guardamos los datos en archivo. Lo usamos porque todavía no
manejamos una base de datos y para este proyecto era suficiente. En Python lo leemos y
escribimos con la librería `json`:

```python
json.load(f)                                  # leer del archivo a Python
json.dump({'usuarios': lista}, f, indent=2)   # escribir de Python al archivo
```

El mismo formato JSON lo usamos para mandar datos entre el JavaScript y Flask cuando se
guardan los ajustes del Pomodoro.

---

## Sesiones

La sesión es como una memoria temporal del usuario mientras está usando la página. La usamos
para recordar quién inició sesión sin tener que estar pidiendo el login en cada pantalla:

```python
session['usuario'] = usuario['nombre']
```

Después, en cualquier página, podemos leer `session.get('usuario')` para saber su nombre.
La sesión se borra cuando cierra sesión (`session.clear()`).

---

## Sobre matrices

Una matriz (una tabla de filas y columnas, o lista de listas) **no la usamos** en este
proyecto, porque no tuvimos un caso que la necesitara. Lo más parecido que tenemos es la
lista de diccionarios de los usuarios, que ya explicamos arriba. Lo aclaramos para no decir
que usamos algo que en realidad no está en el código.
