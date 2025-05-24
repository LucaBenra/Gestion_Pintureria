# 🖌️ Pinturería UTN – Primer Parcial Programación III

Este proyecto fue desarrollado como resolución del primer parcial de la materia Programación III en la Universidad Tecnológica Nacional (UTN). Consiste en una aplicación web que permite la gestión de un inventario de pinturas a través de una interfaz moderna, clara y funcional, conectándose a una API REST pública.

## 📁 Estructura del proyecto

```plaintext
📦 proyecto-root/
 ┣ 📂 css/
 ┃ ┗ style.css             
 ┣ 📂 js/
 ┃ ┗ manejadora.js         → Lógica principal de la app en JS puro
 ┣ 📂 img/
 ┃ ┗ utnLogo.png           
 ┣ 📄 pintureria.html       → Archivo HTML principal
 ┣ 📄 README.md             
```

## 🧠 Explicación de partes y funcionalidades

### 🖼️ Interfaz
- Diseño responsivo con Bootstrap 5.
- Barra de navegación fija con acceso rápido a cada sección.
- Modo claro / oscuro con preferencia guardada en localStorage.

### 📝 Formulario de Pintura
- Campos: ID, Marca, Precio, Color, Cantidad.
- Botones: Agregar, Limpiar, Modificar.
- Validaciones visuales con retroalimentación inmediata.

### 📋 Listado de Pinturas
- Tabla moderna con acciones:
  - ✏️ Modificar: precarga los datos en el formulario.
  - 🗑️ Eliminar: elimina la pintura de la base.
- El campo color se muestra con input color deshabilitado.

### 🔍 Filtros y Estadísticas
- Filtro por marca desplegable.
- Cálculo de promedio de precios general.
- Estadísticas completas:
  - Precio promedio por marca
  - Marca más común
  - Pintura más cara
  - Valor total del inventario

### 📤 Exportación
- Exportar listado completo a un archivo CSV descargable.

## 🖼️ Capturas de pantalla

### 📌 Formulario y Filtros


### 📌 Listado de Pinturas


### 📌 Estadísticas calculadas


## 🧪 API utilizada

Se utiliza la API REST pública proporcionada por la cátedra:

```
https://utnfra-api-pinturas.onrender.com/pinturas
```

Soporta métodos GET, POST, PUT y DELETE.

## 🎓 ¿Qué aprendí al hacer este proyecto?

Durante el desarrollo de este proyecto aprendí y reforcé los siguientes conceptos:

- Cómo estructurar una aplicación frontend completa.
- El uso de `fetch` para consumir APIs REST.
- Validaciones con JavaScript puro y retroalimentación visual.
- Uso avanzado de Bootstrap 5 (grillas, tablas, botones, responsividad).
- Cómo implementar el modo oscuro con almacenamiento local.
- Cómo generar archivos descargables desde JS.
- Organización del código siguiendo buenas prácticas.
- Cómo aplicar diseño UX/UI moderno.

Además, practiqué cómo comentar cada parte del código para poder explicarlo claramente durante una defensa oral.

## 🚀 Cómo ejecutar el proyecto

1. Clonar o descargar el repositorio completo.
2. Abrir el archivo `pintureria.html` en cualquier navegador moderno (Chrome, Firefox, Edge).
3. Todas las funcionalidades estarán activas de forma inmediata (no se requiere backend local).

## 📎 Autor

📛 Nombre: Ramirez, Luca
🎓 Carrera: Tecnicatura en Programación – UTN  
📅 Año: 2025
