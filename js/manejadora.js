document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnAgregar").addEventListener("click", AgregarPintura);
    document.getElementById("btnModificar").addEventListener("click", ModificarPintura);
    document.getElementById("selectMarca").addEventListener("change", FiltrarPorMarca);
    document.getElementById("btnPromedio").addEventListener("click", CalcularPromedioPrecios);
    document.getElementById("btnEstadisticas").addEventListener("click", CalcularEstadisticas);
    document.getElementById("btnExportar").addEventListener("click", ExportarCSV);
    document.getElementById("btnModoOscuro").addEventListener("click", ToggleModoOscuro);
    document.getElementById("selectOrden").addEventListener("change", FiltrarPorMarca);

    // verifico si el modo oscuro esta activo
    if (localStorage.getItem("modoOscuro") === "true") {
        document.body.classList.add("modo-oscuro");
        document.getElementById("btnModoOscuro").innerHTML = '<i class="bi bi-sun"></i>';
    }

    MostrarPinturas();
    CargarMarcasUnicas();
});

// funcion para obtener las pinturas de la API
async function MostrarPinturas() {
    // limpio el contenedor y muestro el spinner
    const contenedor = document.getElementById("divListado");
    contenedor.innerHTML = `<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>`; 

    try {
        // le pido a la API que me devuelva todas las pinturas
        const res = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas");
        const data = await res.json(); 
        // llamo a la funcion para renderizar y las muestro
        RenderizarPinturas(data);
    } catch (error) {
        MostrarAlerta("Error al cargar pinturas.", "danger");
        console.error(error);
    }
}

// funcion para agregar una nueva pintura
async function AgregarPintura() {
    // obtengo los datos del formulario
    const marca = document.getElementById("inputMarca").value;
    const precio = parseFloat(document.getElementById("inputPrecio").value);
    const color = document.getElementById("inputColor").value;
    const cantidad = parseInt(document.getElementById("inputCantidad").value);

    // llamo a la funcion de validacion
    if (!ValidarFormulario()) return;

    // armo el objeto
    const nuevaPintura = {
        marca: marca,
        precio: precio,
        color: color,
        cantidad: cantidad
    };

    try {
        // le enviio y pido a la API que me agrege el objeto
        const res = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaPintura) 
        });

        // si la API da el ok muestro un alert y actualizo la tabla
        if (res.ok) {
            MostrarAlerta("Pintura agregada correctamente.", "success");
            document.getElementById("frmFormulario").reset(); // Limpio el fomulario
            MostrarPinturas(); // Refresco la tabla
            
        } else {
            MostrarAlerta("Error al agregar la pintura.", "danger");
        }

    } catch (error) {
        MostrarAlerta("Error al agregar la pintura.", "danger");
        console.log(error);
    }
}

//funcion para seleccionar una pintura por id
async function SeleccionarPintura(id) {
    // por consola muestro el id para ver que estoy recibiendo
    console.log("Buscando pintura con ID:", id);

    try {
        // le pido a la API que me devuelva la pintura
        const res = await fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`);
        const data = await res.json();
        // por consola muestro la pintura
        console.log("Pintura recibida:", data);
        // si no encuentro la pintura muestro un alert
        if (!data || !data.exito || !data.pintura) {
            alert("No se encontró la pintura.");
            return;
        }
        // muestro los datos en el formulario
        const pintura = data.pintura;
        document.getElementById("inputID").value = pintura.id;
        document.getElementById("inputMarca").value = pintura.marca;
        document.getElementById("inputPrecio").value = pintura.precio;
        document.getElementById("inputColor").value = pintura.color;
        document.getElementById("inputCantidad").value = pintura.cantidad;

        // hago que al cargar los datos se vuelva a la seccion de formulario
        document.querySelectorAll(".seccion").forEach(sec => sec.style.display = "none");
        document.getElementById("seccionFormulario").style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        alert("Error al cargar los datos de la pintura");
        console.error(error);
    }
}

//funcion para modificar una pintura
async function ModificarPintura() {
    // Obtengo los valores del formulario
    const id = document.getElementById("inputID").value; // 
    const marca = document.getElementById("inputMarca").value.trim();
    const precio = parseFloat(document.getElementById("inputPrecio").value);
    const color = document.getElementById("inputColor").value;
    const cantidad = parseInt(document.getElementById("inputCantidad").value);

    // llamo a la funcion de validacion
    if (!ValidarFormulario()) return;

    // Armo el objeto con los nuevos datos de la pintura
    const pinturaModificada = {
        marca: marca,
        precio: precio,
        color: color,
        cantidad: cantidad
    };

    try {
        // Envio una solicitud PUT a la API 
        const res = await fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pinturaModificada) // Convierto el objeto a formato JSON
        });

        if (res.ok) {
            // Si la modificación fue exitosa muestr un mensaje
            MostrarAlerta("Pintura modificada con éxito.", "success");
            document.getElementById("frmFormulario").reset(); // Limpo el formulario
            MostrarPinturas(); // refresco la lsita
        } else {
            MostrarAlerta("Error al modificar la pintura.", "danger");
        }

    } catch (error) {
        MostrarAlerta("Error al modificar la pintura.", "danger");
        console.error(error);
    }
}

//funcion para eliminar una pintura por id
async function EliminarPintura(id) {
    // Confirmo si el usuario realmente quiere eliminar
    const confirmar = confirm(`¿Estás seguro de que querés eliminar la pintura con ID ${id}?`);

    if (!confirmar) return; // Si el usuario cancela no hacemos nada

    try {
        // Envio una solicitud DELETE a la API
        const res = await fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            // Si la API da el ok mostro un mensaje y actualizo la tabla
            MostrarAlerta("Pintura eliminada correctamente.", "success");
            MostrarPinturas(); // Refresco la tabla para que ya no aparezca
        } else {
            MostrarAlerta("Error al eliminar la pintura.", "danger");
        }

    } catch (error) {
        MostrarAlerta("Error al eliminar la pintura.", "danger");
        console.error(error);
    }
}

//funcion para validar los datos deel formulario
function ValidarFormulario() {
    const marca = document.getElementById("inputMarca");
    const precio = document.getElementById("inputPrecio");
    const color = document.getElementById("inputColor"); // este no lo valido ya tiene un color por defecto
    const cantidad = document.getElementById("inputCantidad");

    //bandera
    let valido = true;

    // con esta funcion marco los inputs
    function MarcarInput(input, esValido) {
        if (esValido) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        } else {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        }

        // saco los estilos despues de 3 segundos
        setTimeout(() => {
            input.classList.remove("is-valid");
            input.classList.remove("is-invalid");
        }, 4000);
    }

    // Valido marca (no vacía)
    const marcaValida = marca.value.trim() !== "";
    MarcarInput(marca, marcaValida);
    if (!marcaValida) valido = false;

    // Valido precio (entre 50 y 500)
    const precioValor = parseFloat(precio.value);
    const precioValido = !isNaN(precioValor) && precioValor >= 50 && precioValor <= 500;
    MarcarInput(precio, precioValido);
    if (!precioValido) valido = false;

    // Valido cantidad (entre 1 y 400)
    const cantidadValor = parseInt(cantidad.value);
    const cantidadValida = !isNaN(cantidadValor) && cantidadValor >= 1 && cantidadValor <= 400;
    MarcarInput(cantidad, cantidadValida);
    if (!cantidadValida) valido = false;

    if (!valido) {
        MostrarAlerta("Por favor completá todos los campos correctamente.", "danger");
    }

    return valido;
}

//funcion para cargar las marcas unicas
async function CargarMarcasUnicas() {

    try {
        // le pido a la API que me devuelva todas las pinturas
        const res = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas");
        const data = await res.json();

        // Obtengo solo las marcas únicas
        const marcasUnicas = [...new Set(data.map(p => p.marca))];
        // Obtengo el select
        const select = document.getElementById("selectMarca");

        // Limpio las opciones previas (excepto "todas")
        select.innerHTML = '<option value="todas">Todas</option>';

        // Agrego cada marca al select
        marcasUnicas.forEach(marca => {
            const opcion = document.createElement("option");
            opcion.value = marca;
            opcion.textContent = marca;
            select.appendChild(opcion);
        });

    } catch (error) {
        console.error("Error al cargar marcas únicas:", error);
    }
}

//funcion para filtrar las pinturas
async function FiltrarPorMarca() {
    const marcaSeleccionada = document.getElementById("selectMarca").value;
    const ordenSeleccionado = document.getElementById("selectOrden").value;

    try {
        const res = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas");
        let data = await res.json();

        // Filtrado por marca
        if (marcaSeleccionada !== "todas") {
        data = data.filter(p => p.marca === marcaSeleccionada);
        }

        // Orden por precio
        if (ordenSeleccionado === "asc") {
        data.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
        } else if (ordenSeleccionado === "desc") {
        data.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
        }

        RenderizarPinturas(data);
    } catch (error) {
        MostrarAlerta("Error al filtrar pinturas.", "danger");
        console.error(error);
    }
}

//funcion para calcular el promedio
async function CalcularPromedioPrecios() {
    try {
        // le pido a la API que me devuelva todas las pinturas
        const res = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas");
        const data = await res.json();

        // Obtengo solo las marcas únicas
        const pinturasValidas = data.filter(p => {
            const precio = parseFloat(p.precio);
            return !isNaN(precio) && precio >= 50 && precio <= 500;
        });

        // si no hay pinturas validas
        if (pinturasValidas.length === 0) {
            document.getElementById("resultadoPromedio").textContent = "No hay precios válidos para calcular el promedio.";
            document.getElementById("resultadoPromedio").style.display = "block";
            return;
        }

        // Calculo el promedio
        const suma = pinturasValidas.reduce((acc, pintura) => acc + parseFloat(pintura.precio), 0);
        const promedio = suma / pinturasValidas.length;

        // Muestro el resultado
        const resultado = `El promedio de precios es: $${promedio.toFixed(2)}`;
        
        // muestro el resultado
        const divResultado = document.getElementById("resultadoPromedio");
        divResultado.textContent = resultado;
        divResultado.className = "alert alert-info mt-2";
        divResultado.style.display = "block";

        // muestro la alerta solo 3segundos
        setTimeout(() => {
            divResultado.style.display = "none";
        }, 5000);

    } catch (error) {
        console.error("Error al calcular el promedio:", error);
        const divResultado = document.getElementById("resultadoPromedio");
        divResultado.textContent = "Error al calcular promedio.";
        divResultado.className = "alert alert-danger mt-2";
        divResultado.style.display = "block";
    }
}

// funcion para mostrar una alerta 
function MostrarAlerta(mensaje, tipo = "success") {
    const div = document.getElementById("alertaUsuario");
    div.textContent = mensaje;

    // Asigno clase visual según tipo (success, danger, warning, info)
    div.className = `alert alert-${tipo}`;
    div.classList.add("text-center");
    div.style.display = "block";

    // muestro la alerta solo 3segunds
    setTimeout(() => {
        div.style.display = "none";
    }, 3600);
}

// funcion para dar formato a la lista de pinturas 
function RenderizarPinturas(pinturas) {
    const contenedor = document.getElementById("divListado");

    let tabla = `
        <table class="table table-hover align-middle shadow-sm rounded overflow-hidden">
        <thead class="table-primary text-center">
            <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Color</th>
            <th>Cantidad</th>
            <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
    `;

    pinturas.forEach(p => {
        tabla += `
        <tr class="text-center">
            <td>${p.id}</td>
            <td class="fw-semibold text-capitalize">${p.marca}</td>
            <td>$${p.precio}</td>
            <td>
            <div class="rounded-circle mx-auto" style="width: 25px; height: 25px; background-color: ${p.color}; border: 1px solid #ccc;"></div>
            </td>
            <td>${p.cantidad}</td>
            <td>
            <button class="btn btn-sm btn-warning me-1" onclick="SeleccionarPintura('${p.id}')">
                <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="EliminarPintura('${p.id}')">
                <i class="bi bi-trash3-fill"></i>
            </button>
            </td>
        </tr>
        `;
    });

    tabla += `
        </tbody>
        </table>
    `;

    contenedor.innerHTML = tabla;
}

// Funcion para calcular estadisticas
async function CalcularEstadisticas() {
    try {
        const res = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas");
        const data = await res.json();

        // Total
        document.getElementById("statTotal").textContent = data.length;

        // Marca más comun
        const conteoMarcas = {};
        data.forEach(p => conteoMarcas[p.marca] = (conteoMarcas[p.marca] || 0) + 1);
        const marcaMasComun = Object.entries(conteoMarcas).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/D";
        document.getElementById("statMarcaMasComun").textContent = marcaMasComun;

        // Pintura mas cara
        const pinturaMasCara = data.reduce((max, p) => {
            const precioActual = parseFloat(p.precio);
            const precioMax = parseFloat(max.precio);
            return precioActual > precioMax ? p : max;
        }, data[0]);

        // muestro el texto correctamente
        document.getElementById("statPinturaMasCara").textContent =
        `${pinturaMasCara.marca} ($${parseFloat(pinturaMasCara.precio).toFixed(2)})`;

        // Promedio general con control de errores
        const preciosValidos = data
        .map(p => parseFloat(p.precio))
        .filter(precio => !isNaN(precio));

        const promedio = preciosValidos.reduce((a, b) => a + b, 0) / preciosValidos.length;
        document.getElementById("statPromedioGeneral").textContent = promedio.toFixed(2);

        // Promedio por marca (también validado)
        const marcasAgrupadas = {};
        data.forEach(p => {
        const precio = parseFloat(p.precio);
        if (!isNaN(precio)) {
            if (!marcasAgrupadas[p.marca]) {
            marcasAgrupadas[p.marca] = [];
            }
            marcasAgrupadas[p.marca].push(precio);
        }
        });
         // Muestro el promedio por marca
        const ulPromedioPorMarca = document.getElementById("statPromedioPorMarca");
        ulPromedioPorMarca.innerHTML = "";
        for (const marca in marcasAgrupadas) {
        const precios = marcasAgrupadas[marca];
        const promedioMarca = precios.reduce((a, b) => a + b, 0) / precios.length;
        const li = document.createElement("li");
        li.textContent = `${marca}: $${promedioMarca.toFixed(2)}`;
        ulPromedioPorMarca.appendChild(li);
        }
        // Muestro el total de inventario
        const totalInventario = data.reduce((acc, p) => {
        const precio = parseFloat(p.precio);
        const cantidad = parseInt(p.cantidad);
        if (!isNaN(precio) && !isNaN(cantidad)) {
            return acc + (precio * cantidad);
        }
        return acc;
        }, 0);

        document.getElementById("statValorTotalInventario").textContent = totalInventario.toFixed(2);
        document.getElementById("contenedorEstadisticas").style.display = "flex";

    } catch (error) {
        MostrarAlerta("Error al calcular estadísticas", "danger");
        console.error(error);
    }
}

//funcion para exportar a CSV
async function ExportarCSV() {
    try {
        const res = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas");
        const data = await res.json();

        if (!data || !data.length) {
        MostrarAlerta("No hay datos para exportar", "warning");
        return;
        }

        // Encabezados del CSV
        const headers = ["ID", "Marca", "Precio", "Color", "Cantidad"];
        const filas = data.map(p => [
        p.id,
        p.marca,
        p.precio,
        p.color,
        p.cantidad
        ]);

        // Creo el contenido CSV
        const contenidoCSV = [headers, ...filas]
        .map(fila => fila.join(","))
        .join("\n");

        // Descargar como archivo
        const blob = new Blob([contenidoCSV], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "pinturas.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        MostrarAlerta("Error al exportar CSV", "danger");
        console.error("ExportarCSV error:", error);
    }
}

//funcion para cambiar el modo oscuro
function ToggleModoOscuro() {
    // cambio los estilos
    const body = document.body;
    const usandoOscuro = body.classList.toggle("modo-oscuro");

    // cambio el icono
    const btn = document.getElementById("btnModoOscuro");
    btn.innerHTML = usandoOscuro
        ? '<i class="bi bi-sun"></i>'
        : '<i class="bi bi-moon"></i>';

    // Guardar preferencia en localStorage
    localStorage.setItem("modoOscuro", usandoOscuro ? "true" : "false");
}

// Función para manejar el clic en los enlaces 
document.addEventListener("DOMContentLoaded", function () {
    const secciones = document.querySelectorAll(".seccion");
    const links = document.querySelectorAll("header .nav-link");

    // Oculto todas las secciones menos "inicio"
    secciones.forEach(sec => sec.style.display = "none");
    document.getElementById("inicio").style.display = "block";

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").replace("#", "");

            // Oculto todas las secciones
            secciones.forEach(sec => sec.style.display = "none");

            // Muestro la sección correspondiente
            const target = document.getElementById(targetId);
            if (target) target.style.display = "block";

            // Desplazo al inicio de la página
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
});









