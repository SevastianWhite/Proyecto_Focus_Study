# Cómo arrancó el proyecto — reorganización inicial

Cuando empezamos, todo el código estaba metido dentro de una carpeta `focus_study/` y Flask
no funcionaba: buscaba `templates/` y `static/` al lado de `app.py`, pero como `app.py` estaba
adentro de esa carpeta, Flask los buscaba en `focus_study/templates/` y ahí no había nada.
Por eso ninguna página cargaba.

## Lo que arreglamos

Sacamos `app.py`, `README.md` y `.gitignore` de `focus_study/` y los pusimos en la raíz del
proyecto. Después borramos la carpeta `focus_study/` (primero confirmamos que ningún archivo
la importaba como módulo, para no romper nada).

De paso, el `app.py` original tenía varios errores que arreglamos en el camino:
- Había dos `@app.route("/")` seguidos sin ninguna función entre ellos, lo que hacía que
  Flask ni siquiera arrancara.
- La ruta del dashboard estaba mal escrita: `/dashboar` en vez de `/dashboard`.
- Tenía `app.run()` suelto fuera del `if __name__ == '__main__':`, así que se ejecutaba
  aunque no debiera.
- Importaba `csv` y `os` sin usarlos en ningún lado.

También creamos `requirements.txt` (estaba vacío, así que nadie podía instalar las
dependencias) con lo único que necesita el proyecto: `flask`.

## Por qué `data/usuarios.json` no está en el `.gitignore`

Es una decisión a propósito, no un descuido. Mientras estamos construyendo el proyecto nos
sirve que todos en el equipo vean los mismos usuarios de prueba al hacer `git pull`. Si en
algún momento se usaran contraseñas reales habría que sacarlo del control de versiones, pero
para este avance no hace falta.

## Documentación creada en esta etapa

De acá salieron `GUIA_EQUIPO.md` (cómo está organizado el proyecto y quién toca qué) y este
mismo archivo, para dejar registro de por qué se reorganizó todo al principio.
