
// ==============================================
// AUTOTECH - SISTEMA DE AUTENTICACIÓN
// PASO 3
// ==============================================

// 1. REFERENCIAS A ELEMENTOS HTML

const btnLogin = document.getElementById("btnLogin");
const btnAgendar = document.getElementById("btnAgendar");

const modalLogin = document.getElementById("modalLogin");
const modalRegistro = document.getElementById("modalRegistro");

const cerrarLogin = document.getElementById("cerrarLogin");
const cerrarRegistro = document.getElementById("cerrarRegistro");

const abrirRegistro = document.getElementById("abrirRegistro");
const volverLogin = document.getElementById("volverLogin");

const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");

const mensajeLogin = document.getElementById("mensajeLogin");
const mensajeRegistro = document.getElementById("mensajeRegistro");

const vistaBienvenida = document.getElementById("vistaBienvenida");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");


// ==============================================
// 2. USUARIOS DE PRUEBA
// ==============================================

// Estos datos son únicamente para la práctica.
// En una aplicación real las contraseñas
// no deben almacenarse de esta manera.

const usuariosIniciales = [
    {
        id: 1,
        nombre: "Administrador AutoTech",
        telefono: "0999999999",
        correo: "admin@autotech.com",
        clave: "Admin123*",
        rol: "administrador",
        activo: true
    },
    {
        id: 2,
        nombre: "Juan Pérez",
        telefono: "0987654321",
        correo: "juan@correo.com",
        clave: "Cliente123*",
        rol: "cliente",
        activo: true
    },
    {
        id: 3,
        nombre: "María López",
        telefono: "0981234567",
        correo: "maria@correo.com",
        clave: "Cliente123*",
        rol: "cliente",
        activo: true
    }
];

// Crear datos iniciales solo la primera vez
if (localStorage.getItem("autotech_usuarios") === null) {
    localStorage.setItem(
        "autotech_usuarios",
        JSON.stringify(usuariosIniciales)
    );
}


// ==============================================
// 3. FUNCIONES DE ALMACENAMIENTO
// ==============================================

// Obtener usuarios guardados
function obtenerUsuarios() {
    return JSON.parse(
        localStorage.getItem("autotech_usuarios") || "[]"
    );
}

// Guardar usuarios
function guardarUsuarios(usuarios) {
    localStorage.setItem(
        "autotech_usuarios",
        JSON.stringify(usuarios)
    );
}


// ==============================================
// 4. ABRIR Y CERRAR VENTANAS
// ==============================================

function mostrarModal(modal) {

    modalLogin.classList.add("oculto");
    modalRegistro.classList.add("oculto");

    modal.classList.remove("oculto");

    document.body.classList.add("modal-abierto");

    modal.querySelector("input")?.focus();
}

function cerrarModales() {

    modalLogin.classList.add("oculto");
    modalRegistro.classList.add("oculto");

    document.body.classList.remove("modal-abierto");

    mensajeLogin.textContent = "";
    mensajeRegistro.textContent = "";
}


// Abrir login desde la página principal
btnLogin.addEventListener("click", function () {
    mostrarModal(modalLogin);
});

// Para agendar cita primero se debe iniciar sesión
btnAgendar.addEventListener("click", function () {
    mostrarModal(modalLogin);
});

// Cerrar ventanas
cerrarLogin.addEventListener("click", cerrarModales);
cerrarRegistro.addEventListener("click", cerrarModales);

// Cambiar al registro
abrirRegistro.addEventListener("click", function () {
    mostrarModal(modalRegistro);
});

// Regresar al login
volverLogin.addEventListener("click", function () {
    mostrarModal(modalLogin);
});

// Cerrar al hacer clic fuera del formulario
[modalLogin, modalRegistro].forEach(function (modal) {

    modal.addEventListener("click", function (evento) {

        if (evento.target === modal) {
            cerrarModales();
        }

    });
});

// Cerrar utilizando Escape
document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {
        cerrarModales();
    }

});


// ==============================================
// 5. VALIDACIONES CON EXPRESIONES REGULARES
// ==============================================

// Correo electrónico

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(correo);
}


// Nombre: solo letras, espacios y acentos
function validarNombre(nombre) {
    const regex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
    return regex.test(nombre);
}

// Teléfono celular de Ecuador
function validarTelefono(telefono) {
    const regex = /^09[0-9]{8}$/;
    return regex.test(telefono);
}

// Contraseña: mínimo 8 caracteres
function validarClave(clave) {
    return clave.length >= 8;
}


// ==============================================
// 6. INICIAR SESIÓN
// ==============================================

formLogin.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const correo = document.getElementById("loginCorreo")
        .value.trim().toLowerCase();

    const clave = document.getElementById("loginClave").value;

    mensajeLogin.textContent = "";

    // Validar campos vacíos
    if (correo === "" || clave === "") {
        mensajeLogin.textContent =
            "Debes completar todos los campos.";
        return;
    }

    // Validar correo
    if (!validarCorreo(correo)) {
        mensajeLogin.textContent =
            "Ingresa un correo electrónico válido.";
        return;
    }

    const usuarios = obtenerUsuarios();

    // Buscar usuario mediante find()
    const usuario = usuarios.find(function (item) {
        return item.correo === correo &&
               item.clave === clave;
    });

    // Credenciales incorrectas
    if (!usuario) {
        mensajeLogin.textContent =
            "Correo o contraseña incorrectos.";
        return;
    }

    // Validar que la cuenta esté activa
    if (!usuario.activo) {
        mensajeLogin.textContent =
            "Esta cuenta se encuentra deshabilitada.";
        return;
    }

    // Guardar sesión actual
    const sesion = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
    };

    localStorage.setItem(
        "autotech_sesion",
        JSON.stringify(sesion)
    );

    formLogin.reset();
    cerrarModales();

    // Mostrar vista según el rol
    mostrarPanelPorRol(sesion);

});


// ==============================================
// 7. REGISTRAR NUEVOS CLIENTES
// ==============================================

formRegistro.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const nombre = document.getElementById("registroNombre")
        .value.trim();

    const telefono = document.getElementById("registroTelefono")
        .value.trim();

    const correo = document.getElementById("registroCorreo")
        .value.trim().toLowerCase();

    const clave = document.getElementById("registroClave").value;

    const confirmar = document.getElementById("confirmarClave").value;

    mensajeRegistro.textContent = "";

    // Campos obligatorios
    if (!nombre || !telefono || !correo ||
        !clave || !confirmar) {

        mensajeRegistro.textContent =
            "Todos los campos son obligatorios.";
        return;
    }

    // Validar nombre
    if (!validarNombre(nombre)) {
        mensajeRegistro.textContent =
            "El nombre solo debe contener letras.";
        return;
    }

    // Validar teléfono
    if (!validarTelefono(telefono)) {
        mensajeRegistro.textContent =
            "El teléfono debe tener 10 dígitos y empezar con 09.";
        return;
    }

    // Validar correo
    if (!validarCorreo(correo)) {
        mensajeRegistro.textContent =
            "El correo electrónico no es válido.";
        return;
    }

    // Validar contraseña
    if (!validarClave(clave)) {
        mensajeRegistro.textContent =
            "La contraseña debe tener mínimo 8 caracteres.";
        return;
    }

    // Confirmar contraseña
    if (clave !== confirmar) {
        mensajeRegistro.textContent =
            "Las contraseñas no coinciden.";
        return;
    }

    const usuarios = obtenerUsuarios();

    // Verificar correo duplicado
    const existente = usuarios.some(function (usuario) {
        return usuario.correo === correo;
    });

    if (existente) {
        mensajeRegistro.textContent =
            "Ya existe una cuenta con este correo.";
        return;
    }

    // Generar identificador
    const nuevoId = usuarios.length > 0
        ? Math.max(...usuarios.map(u => u.id)) + 1
        : 1;

    // Crear objeto de cliente
    const nuevoCliente = {
        id: nuevoId,
        nombre: nombre,
        telefono: telefono,
        correo: correo,
        clave: clave,
        rol: "cliente",
        activo: true
    };

    // Agregar usuario al array
    usuarios.push(nuevoCliente);

    // Guardar en localStorage
    guardarUsuarios(usuarios);

    alert("¡Cuenta registrada correctamente! Ya puedes iniciar sesión.");

    formRegistro.reset();

    mostrarModal(modalLogin);

});


// ==============================================
// 8. MOSTRAR VISTA SEGÚN EL ROL
// ==============================================

function mostrarPanelPorRol(usuario) {

    // Comprobar que la cuenta sigue activa
    const registrado = obtenerUsuarios().find(function (item) {
        return item.id === usuario.id &&
               item.correo === usuario.correo &&
               item.activo === true;
    });

    
if (!registrado) {
    cerrarSesion();
    return;
}

// Si es cliente, abrir el panel del cliente
if (registrado.rol === "cliente") {
    vistaBienvenida.classList.add("oculto");
    mostrarPanelCliente(registrado);
    return;
}

// Si es administrador, conservar su pantalla actual

// Ocultar el panel del cliente
document.getElementById("panelCliente")
    .classList.add("oculto");

// Si es administrador, abrir el nuevo dashboard
if (registrado.rol === "administrador") {

    vistaBienvenida.classList.add("oculto");

    mostrarPanelAdministrador(registrado);

    return;
}

// Vista temporal para otros roles
vistaBienvenida.classList.remove("oculto");



    const titulo = document.getElementById("tituloBienvenida");
    const texto = document.getElementById("textoBienvenida");
    const opciones = document.getElementById("opcionesBienvenida");

    // Limpiar contenido anterior
    opciones.replaceChildren();

    let nombresOpciones = [];

    if (registrado.rol === "administrador") {

        titulo.textContent = "Panel del Administrador";

        texto.textContent =
            "Bienvenido, " + registrado.nombre +
            ". Tienes acceso a las funciones administrativas.";

        nombresOpciones = [
            "Gestión de mantenimientos",
            "CRUD de repuestos",
            "Pedidos de clientes",
            "Historial de auditoría"
        ];

    } else if (registrado.rol === "cliente") {

        titulo.textContent = "Panel del Cliente";

        texto.textContent =
            "Bienvenido, " + registrado.nombre +
            ". Desde aquí podrás gestionar tus solicitudes.";

        nombresOpciones = [
            "Mi perfil",
            "Agendar cita mecánica",
            "Mis mantenimientos",
            "Tienda de repuestos"
        ];

    } else {
        cerrarSesion();
        return;
    }

    // Crear tarjetas informativas
    nombresOpciones.forEach(function (nombre) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "opcion-rol";
        tarjeta.textContent = nombre;

        opciones.appendChild(tarjeta);

    });

}


// ==============================================
// 9. CERRAR SESIÓN
// ==============================================



function cerrarSesion() {

    // Eliminar la sesión guardada
    localStorage.removeItem("autotech_sesion");

    // Ocultar todas las pantallas privadas
    vistaBienvenida.classList.add("oculto");

    document.getElementById("panelCliente")
        .classList.add("oculto");

    document.getElementById("panelAdministrador")
        .classList.add("oculto");

    // Cerrar formularios de acceso
    cerrarModales();
}



btnCerrarSesion.addEventListener("click", cerrarSesion);


// ==============================================
// 10. RESTAURAR SESIÓN AL ABRIR LA PÁGINA
// ==============================================


const sesionGuardada = localStorage.getItem("autotech_sesion");

if (sesionGuardada) {

    try {
        const usuario = JSON.parse(sesionGuardada);

        mostrarPanelPorRol(usuario);

    } catch (error) {
        cerrarSesion();
    }

}

// Comprobar que JavaScript se cargó correctamente
console.log("AutoTech: JavaScript conectado correctamente");


// ==============================================
// PASO 4 - PANEL DEL CLIENTE
// ==============================================

// Mostrar el panel con los datos del cliente
function mostrarPanelCliente(usuario) {

    const panel = document.getElementById("panelCliente");

    panel.classList.remove("oculto");

    document.getElementById("clienteNombre").textContent =
        usuario.nombre;

    document.getElementById("clienteCorreo").textContent =
        usuario.correo;

    document.getElementById("clienteTelefono").textContent =
        usuario.telefono || "No registrado";

    mostrarVistaCliente("clientePerfil");
    prepararFormularioCita(usuario);
}


// ==============================================
// NAVEGACIÓN DEL MENÚ
// ==============================================

function mostrarVistaCliente(idVista) {

    document.querySelectorAll(".cliente-vista")
        .forEach(function (vista) {
            vista.classList.add("oculto");
        });

    const vista = document.getElementById(idVista);

    if (vista) {
        vista.classList.remove("oculto");

        if (idVista === "clienteRepuestos") {
            mostrarCatalogoRepuestos();
        }

        if (idVista === "clienteCarrito") {
            mostrarCarrito();
        }

        if (idVista === "clientePedidos") {
            mostrarPedidosCliente();
        }

    }

    document.querySelectorAll(".cliente-menu-btn")
        .forEach(function (boton) {

            boton.classList.toggle(
                "activo",
                boton.dataset.vista === idVista
            );

        });

    if (idVista === "clienteMantenimientos") {
        mostrarMisCitas();
    }
}


// Configurar los botones laterales
document.querySelectorAll(".cliente-menu-btn")
    .forEach(function (boton) {

        boton.addEventListener("click", function () {
            mostrarVistaCliente(this.dataset.vista);
        });

    });


// Acceso rápido para agendar una cita
document.getElementById("accesoRapidoCita")
    .addEventListener("click", function () {

        mostrarVistaCliente("clienteAgendar");

    });


// Cerrar sesión del cliente
document.getElementById("cerrarSesionCliente")
    .addEventListener("click", cerrarSesion);


// ==============================================
// FUNCIONES DE FECHA
// ==============================================

// Obtener la fecha local en formato YYYY-MM-DD
function obtenerFechaLocal() {

    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}


// ==============================================
// PREPARAR EL FORMULARIO
// ==============================================

function prepararFormularioCita(usuario) {

    const formulario = document.getElementById("formCitaCliente");

    formulario.reset();

    document.getElementById("citaNombre").value =
        usuario.nombre;

    document.getElementById("citaCorreo").value =
        usuario.correo;

    document.getElementById("citaTelefono").value =
        usuario.telefono || "";

    document.getElementById("citaFecha").min =
        obtenerFechaLocal();

    document.getElementById("citaAnio").max =
        new Date().getFullYear() + 1;

    document.getElementById("mensajeCita").textContent = "";
}


// ==============================================
// VALIDAR PLACA ECUATORIANA
// ==============================================

function validarPlaca(placa) {

    // Tres letras, guion y tres o cuatro números
    const regex = /^[A-Z]{3}-[0-9]{3,4}$/;

    return regex.test(placa);
}


// ==============================================
// GUARDAR Y CONSULTAR CITAS
// ==============================================

function obtenerCitas() {

    return JSON.parse(
        localStorage.getItem("autotech_citas") || "[]"
    );
}

function guardarCitas(citas) {

    localStorage.setItem(
        "autotech_citas",
        JSON.stringify(citas)
    );
}


// ==============================================
// REGISTRAR UNA CITA MECÁNICA
// ==============================================

document.getElementById("formCitaCliente")
    .addEventListener("submit", function (evento) {

        evento.preventDefault();

        const mensaje = document.getElementById("mensajeCita");
        mensaje.textContent = "";

        // Verificar sesión activa
        const sesion = JSON.parse(
            localStorage.getItem("autotech_sesion") || "null"
        );

        if (!sesion || sesion.rol !== "cliente") {
            mensaje.textContent =
                "Debes iniciar sesión como cliente.";
            return;
        }

        // Obtener los datos del formulario
        const nombre = document.getElementById("citaNombre")
            .value.trim();

        const correo = document.getElementById("citaCorreo")
            .value.trim().toLowerCase();

        const telefono = document.getElementById("citaTelefono")
            .value.trim();

        const placa = document.getElementById("citaPlaca")
            .value.trim().toUpperCase();

        const marca = document.getElementById("citaMarca").value;

        const modelo = document.getElementById("citaModelo")
            .value.trim();

        const anioTexto = document.getElementById("citaAnio").value;
        const kilometrajeTexto =
            document.getElementById("citaKilometraje").value;

        const anio = Number(anioTexto);
        const kilometraje = Number(kilometrajeTexto);

        const servicio = document.getElementById("citaServicio").value;
        const fecha = document.getElementById("citaFecha").value;
        const hora = document.getElementById("citaHora").value;

        const descripcion =
            document.getElementById("citaDescripcion").value.trim();

        const prioridad = document.querySelector(
            'input[name="prioridadCita"]:checked'
        ).value;

        // Obtener revisiones adicionales
        const revisiones = [];

        ["revisionFrenos", "revisionLlantas", "revisionBateria"]
            .forEach(function (id) {

                const opcion = document.getElementById(id);

                if (opcion.checked) {
                    revisiones.push(opcion.value);
                }

            });

        // =====================================
        // VALIDACIONES
        // =====================================

        if (!nombre || !correo || !telefono || !placa ||
            !marca || !modelo || !anioTexto ||
            !kilometrajeTexto || !servicio || !fecha ||
            !hora || !descripcion) {

            mensaje.textContent =
                "Debes completar todos los campos obligatorios.";
            return;
        }

        if (!validarNombre(nombre)) {
            mensaje.textContent =
                "El nombre solo puede contener letras y espacios.";
            return;
        }

        if (!validarCorreo(correo)) {
            mensaje.textContent =
                "Ingresa un correo electrónico válido.";
            return;
        }

        if (!validarTelefono(telefono)) {
            mensaje.textContent =
                "El teléfono debe tener 10 dígitos y comenzar con 09.";
            return;
        }

        if (!validarPlaca(placa)) {
            mensaje.textContent =
                "Placa inválida. Utiliza ABC-123 o ABC-1234.";
            return;
        }

        if (!Number.isInteger(anio) ||
            anio < 1950 ||
            anio > new Date().getFullYear() + 1) {

            mensaje.textContent =
                "Ingresa un año de vehículo válido.";
            return;
        }

        if (!Number.isInteger(kilometraje) ||
            kilometraje < 0) {

            mensaje.textContent =
                "El kilometraje debe ser un número entero positivo o cero.";
            return;
        }

        if (fecha < obtenerFechaLocal()) {
            mensaje.textContent =
                "No puedes agendar una cita en una fecha pasada.";
            return;
        }

        // No se atienden citas los domingos
        const diaSemana = new Date(
            fecha + "T12:00:00"
        ).getDay();

        if (diaSemana === 0) {
            mensaje.textContent =
                "El taller no atiende citas los domingos.";
            return;
        }

        // Comprobar que la hora esté en el horario permitido
        if (hora < "08:00" || hora > "17:30") {
            mensaje.textContent =
                "Selecciona una hora entre 08:00 y 17:30.";
            return;
        }

        // Evitar agendar en una hora pasada del día actual
        const ahora = new Date();
        const horaActual =
            String(ahora.getHours()).padStart(2, "0") + ":" +
            String(ahora.getMinutes()).padStart(2, "0");

        if (fecha === obtenerFechaLocal() &&
            hora <= horaActual) {

            mensaje.textContent =
                "Selecciona un horario futuro para tu cita.";
            return;
        }
        
        // Validación adicional: horario permitido
        if (!validarHorarioCita(hora)) {

            mensaje.textContent =
                "Selecciona un horario válido del taller.";
            return;
        }

        // Validar que la fecha y hora sean futuras
        if (!fechaHoraFutura(fecha, hora)) {

            mensaje.textContent =
                "La fecha y hora deben ser futuras.";
            return;
        }

        // Evitar citas duplicadas
        if (horarioOcupado(fecha, hora)) {

            mensaje.textContent =
                "Ese horario ya está ocupado. Selecciona otro.";
            return;
        }

        // El modelo debe tener al menos 2 caracteres
        if (modelo.length < 2) {

            mensaje.textContent =
                "Ingresa un modelo de vehículo válido.";
            return;
        }

        // La descripción debe tener al menos 10 caracteres
        if (descripcion.length < 10) {

            mensaje.textContent =
                "Describe el problema con al menos 10 caracteres.";
            return;
        }

        // La descripción no debe superar los 500 caracteres
        if (descripcion.length > 500) {

            mensaje.textContent =
                "La descripción no puede superar los 500 caracteres.";
            return;
        }

        // =====================================
        // CREAR EL OBJETO DE LA CITA
        // =====================================

        const citas = obtenerCitas();

        const nuevoId = citas.length > 0
            ? Math.max(...citas.map(c => c.id)) + 1
            : 1;

        const nuevaCita = {
            id: nuevoId,
            clienteId: sesion.id,
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            placa: placa,
            marca: marca,
            modelo: modelo,
            anio: anio,
            kilometraje: kilometraje,
            servicio: servicio,
            fecha: fecha,
            hora: hora,
            prioridad: prioridad,
            revisiones: revisiones,
            descripcion: descripcion,
            estado: "Pendiente",
            fechaRegistro: new Date().toISOString()
        };

        // Agregar y guardar la cita
        citas.push(nuevaCita);
        guardarCitas(citas);

        // Mostrar confirmación
        alert(
            "¡Solicitud registrada correctamente!\n" +
            "Número de cita: #" + nuevoId +
            "\nEstado: Pendiente"
        );

        // Limpiar y preparar nuevamente el formulario
        const usuario = obtenerUsuarios().find(
            u => u.id === sesion.id
        );

        if (usuario) {
            prepararFormularioCita(usuario);
        }

        // Ir al historial de mantenimientos
        mostrarVistaCliente("clienteMantenimientos");

    });


// ==============================================
// MOSTRAR LAS CITAS DEL CLIENTE
// ==============================================

function mostrarMisCitas() {

    const tabla = document.getElementById("tablaCitasCliente");

    tabla.replaceChildren();

    const sesion = JSON.parse(
        localStorage.getItem("autotech_sesion") || "null"
    );

    if (!sesion || sesion.rol !== "cliente") {
        return;
    }

    // Filtrar: solo citas del usuario conectado
    const misCitas = obtenerCitas().filter(function (cita) {
        return cita.clienteId === sesion.id;
    });

    // Mostrar mensaje cuando no existen citas
    if (misCitas.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 6;
        celda.textContent =
            "Todavía no tienes solicitudes de mantenimiento.";
        celda.style.textAlign = "center";

        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }

    // Construir las filas de la tabla
    misCitas.forEach(function (cita) {

        const fila = document.createElement("tr");

        const datos = [
            "#" + cita.id,
            cita.marca + " " + cita.modelo,
            cita.placa,
            cita.servicio,
            cita.fecha + " " + cita.hora,
            cita.estado
        ];

        datos.forEach(function (dato, indice) {

            const celda = document.createElement("td");

            if (indice === 5) {
                const estado = document.createElement("span");
                estado.className = "cliente-estado";
                estado.textContent = dato;
                celda.appendChild(estado);
            } else {
                celda.textContent = dato;
            }

            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
    });

}

// ==============================================
// PASO 4.2 - TIENDA DE REPUESTOS AUTOTECH
// ==============================================

// Productos iniciales para demostrar el sistema.
// Más adelante, el administrador podrá modificarlos.

const productosIniciales = [
    {
        id: 1,
        nombre: "Filtro de aceite",
        categoria: "Filtros",
        precio: 12.50,
        stock: 20,
        imagen: "assets/img/filtro-aceite.jpg"
    },
    {
        id: 2,
        nombre: "Pastillas de freno",
        categoria: "Frenos",
        precio: 38.00,
        stock: 15,
        imagen: "assets/img/pastillas-freno.jpg"
    },
    {
        id: 3,
        nombre: "Batería automotriz",
        categoria: "Baterías",
        precio: 95.00,
        stock: 8,
        imagen: "assets/img/bateria.jpg"
    },
    {
        id: 4,
        nombre: "Bujías de encendido",
        categoria: "Motor",
        precio: 7.50,
        stock: 40,
        imagen: "assets/img/bujias.jpg"
    },
    {
        id: 5,
        nombre: "Filtro de aire",
        categoria: "Filtros",
        precio: 16.75,
        stock: 25,
        imagen: "assets/img/filtro-aire.jpg"
    },
    {
        id: 6,
        nombre: "Amortiguador",
        categoria: "Suspensión",
        precio: 65.00,
        stock: 12,
        imagen: "assets/img/amortiguador.jpg"
    }
];

// ==============================================
// CREAR PRODUCTOS SOLO LA PRIMERA VEZ
// ==============================================

if (localStorage.getItem("autotech_productos") === null) {
    localStorage.setItem(
        "autotech_productos",
        JSON.stringify(productosIniciales)
    );
}

// ==============================================
// FUNCIONES PARA CONSULTAR Y GUARDAR PRODUCTOS
// ==============================================

function obtenerProductos() {
    return JSON.parse(
        localStorage.getItem("autotech_productos") || "[]"
    );
}

function guardarProductos(productos) {
    localStorage.setItem(
        "autotech_productos",
        JSON.stringify(productos)
    );
}

// ==============================================
// OBTENER EL CLIENTE CONECTADO
// ==============================================

function obtenerClienteTienda() {

    const sesion = JSON.parse(
        localStorage.getItem("autotech_sesion") || "null"
    );

    if (!sesion || sesion.rol !== "cliente") {
        return null;
    }

    const usuario = obtenerUsuarios().find(function (u) {
        return u.id === sesion.id &&
               u.rol === "cliente" &&
               u.activo === true;
    });

    return usuario || null;
}

// ==============================================
// OBTENER Y GUARDAR CARRITO
// ==============================================

// Cada cliente tiene su propio carrito.

function obtenerCarrito() {

    const cliente = obtenerClienteTienda();

    if (!cliente) {
        return [];
    }

    const clave = "autotech_carrito_" + cliente.id;

    return JSON.parse(localStorage.getItem(clave) || "[]");
}

function guardarCarrito(carrito) {

    const cliente = obtenerClienteTienda();

    if (!cliente) {
        return;
    }

    const clave = "autotech_carrito_" + cliente.id;

    localStorage.setItem(clave, JSON.stringify(carrito));

    actualizarContadorCarrito();
}

// ==============================================
// FORMATO DE PRECIOS
// ==============================================

function formatoPrecio(valor) {
    return "$" + Number(valor).toFixed(2);
}

// ==============================================
// MOSTRAR CATÁLOGO
// ==============================================

function mostrarCatalogoRepuestos() {

    const contenedor = document.getElementById(
        "catalogoRepuestos"
    );

    contenedor.replaceChildren();

    if (!obtenerClienteTienda()) {
        return;
    }

    const busqueda = document.getElementById(
        "buscarRepuesto"
    ).value.trim().toLowerCase();

    const productos = obtenerProductos().filter(function (p) {

        return p.nombre.toLowerCase().includes(busqueda) ||
               p.categoria.toLowerCase().includes(busqueda);

    });

    if (productos.length === 0) {

        const mensaje = document.createElement("p");
        mensaje.className = "mensaje-vacio";
        mensaje.textContent =
            "No se encontraron repuestos.";

        contenedor.appendChild(mensaje);
        return;
    }

    productos.forEach(function (producto) {

        // Tarjeta del producto
        const tarjeta = document.createElement("article");
        tarjeta.className = "repuesto-card";

        // Imagen
        const imagen = document.createElement("img");
        imagen.className = "repuesto-imagen";
        imagen.alt = producto.nombre;

        // Aceptar rutas locales de imágenes y URLs HTTPS
        const ruta = String(producto.imagen || "");

        if (
            ruta.startsWith("assets/img/") ||
            ruta.startsWith("https://")
        ) {
            imagen.src = ruta;
        } else {
            imagen.src = "assets/img/taller-principal.jpg";
        }

        // Imagen alternativa si no existe el archivo
        imagen.onerror = function () {
            imagen.onerror = null;
            imagen.src = "assets/img/taller-principal.jpg";
        };

        const info = document.createElement("div");
        info.className = "repuesto-info";

        const categoria = document.createElement("span");
        categoria.className = "repuesto-categoria";
        categoria.textContent = producto.categoria;

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.className = "repuesto-precio";
        precio.textContent = formatoPrecio(producto.precio);

        const stock = document.createElement("p");
        stock.className = "repuesto-stock";
        stock.textContent = "Disponibles: " + producto.stock;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-cliente-amarillo";

        if (producto.stock <= 0) {
            boton.textContent = "AGOTADO";
            boton.disabled = true;
        } else {
            boton.textContent = "AGREGAR AL CARRITO";

            boton.addEventListener("click", function () {
                agregarAlCarrito(producto.id);
            });
        }

        info.append(
            categoria,
            nombre,
            precio,
            stock,
            boton
        );

        tarjeta.append(imagen, info);
        contenedor.appendChild(tarjeta);

    });
}

// Buscador de repuestos
document.getElementById("buscarRepuesto")
    .addEventListener("input", mostrarCatalogoRepuestos);

// ==============================================
// AGREGAR AL CARRITO
// ==============================================

function agregarAlCarrito(productoId) {

    const cliente = obtenerClienteTienda();

    if (!cliente) {
        alert("Debes iniciar sesión como cliente.");
        return;
    }

    const producto = obtenerProductos().find(function (p) {
        return p.id === productoId;
    });

    if (!producto) {
        alert("El repuesto ya no está disponible.");
        return;
    }

    const carrito = obtenerCarrito();

    const existente = carrito.find(function (item) {
        return item.productoId === productoId;
    });

    const cantidadActual = existente ? existente.cantidad : 0;

    if (cantidadActual >= producto.stock) {
        alert("No hay suficiente stock disponible.");
        return;
    }

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            productoId: producto.id,
            cantidad: 1
        });
    }

    guardarCarrito(carrito);

    alert(producto.nombre + " agregado al carrito.");
}

// ==============================================
// CONTADOR DEL CARRITO
// ==============================================

function actualizarContadorCarrito() {

    const total = obtenerCarrito().reduce(function (suma, item) {
        return suma + item.cantidad;
    }, 0);

    document.getElementById("contadorCarrito")
        .textContent = total;
}

// ==============================================
// MOSTRAR CARRITO
// ==============================================

function mostrarCarrito() {

    const tabla = document.getElementById("tablaCarrito");
    tabla.replaceChildren();

    const carrito = obtenerCarrito();
    const productos = obtenerProductos();

    let total = 0;

    carrito.forEach(function (item) {

        const producto = productos.find(function (p) {
            return p.id === item.productoId;
        });

        if (!producto) {
            return;
        }

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement("tr");

        // Nombre
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.nombre;

        // Precio
        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = formatoPrecio(producto.precio);

        // Cantidad
        const celdaCantidad = document.createElement("td");

        const controles = document.createElement("div");
        controles.className = "carrito-cantidad";

        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "-";
        menos.addEventListener("click", function () {
            cambiarCantidadCarrito(producto.id, -1);
        });

        const numero = document.createElement("span");
        numero.textContent = item.cantidad;

        const mas = document.createElement("button");
        mas.type = "button";
        mas.textContent = "+";
        mas.addEventListener("click", function () {
            cambiarCantidadCarrito(producto.id, 1);
        });

        controles.append(menos, numero, mas);
        celdaCantidad.appendChild(controles);

        // Subtotal
        const celdaSubtotal = document.createElement("td");
        celdaSubtotal.textContent = formatoPrecio(subtotal);

        // Eliminar
        const celdaAcciones = document.createElement("td");

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "carrito-eliminar";
        eliminar.textContent = "Eliminar";

        eliminar.addEventListener("click", function () {
            eliminarDelCarrito(producto.id);
        });

        celdaAcciones.appendChild(eliminar);

        fila.append(
            celdaNombre,
            celdaPrecio,
            celdaCantidad,
            celdaSubtotal,
            celdaAcciones
        );

        tabla.appendChild(fila);

    });

    if (carrito.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = "Tu carrito está vacío.";
        celda.style.textAlign = "center";

        fila.appendChild(celda);
        tabla.appendChild(fila);
    }

    document.getElementById("totalCarrito")
        .textContent = total.toFixed(2);

    document.getElementById("confirmarPedido")
        .disabled = carrito.length === 0;

    actualizarContadorCarrito();
}

// ==============================================
// CAMBIAR CANTIDAD
// ==============================================

function cambiarCantidadCarrito(productoId, cambio) {

    const producto = obtenerProductos().find(
        p => p.id === productoId
    );

    if (!producto) {
        alert("El producto ya no existe.");
        mostrarCarrito();
        return;
    }

    const carrito = obtenerCarrito();

    const item = carrito.find(
        p => p.productoId === productoId
    );

    if (!item) {
        return;
    }

    const nuevaCantidad = item.cantidad + cambio;

    if (nuevaCantidad > producto.stock) {
        alert("No puedes superar el stock disponible.");
        return;
    }

    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(productoId);
        return;
    }

    item.cantidad = nuevaCantidad;

    guardarCarrito(carrito);
    mostrarCarrito();
}

// ==============================================
// ELIMINAR PRODUCTO DEL CARRITO
// ==============================================

function eliminarDelCarrito(productoId) {

    const carrito = obtenerCarrito().filter(function (item) {
        return item.productoId !== productoId;
    });

    guardarCarrito(carrito);
    mostrarCarrito();
}

// ==============================================
// CONSULTAR Y GUARDAR PEDIDOS
// ==============================================

function obtenerPedidos() {
    return JSON.parse(
        localStorage.getItem("autotech_pedidos") || "[]"
    );
}

function guardarPedidos(pedidos) {
    localStorage.setItem(
        "autotech_pedidos",
        JSON.stringify(pedidos)
    );
}

// ==============================================
// CONFIRMAR SOLICITUD DE COMPRA
// ==============================================

document.getElementById("confirmarPedido")
    .addEventListener("click", function () {

        const cliente = obtenerClienteTienda();

        if (!cliente) {
            alert("Debes iniciar sesión como cliente.");
            return;
        }

        const carrito = obtenerCarrito();

        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        const productos = obtenerProductos();

        let totalCentavos = 0;
        const detalle = [];

        // Validar nuevamente todo el carrito
        for (const item of carrito) {

            const producto = productos.find(
                p => p.id === item.productoId
            );

            if (!producto) {
                alert("Uno de los productos ya no existe.");
                return;
            }

            if (!Number.isInteger(item.cantidad) ||
                item.cantidad <= 0 ||
                item.cantidad > producto.stock) {

                alert(
                    "Stock insuficiente o cantidad inválida: " +
                    producto.nombre
                );
                return;
            }

            const precioCentavos = Math.round(
                producto.precio * 100
            );

            totalCentavos += precioCentavos * item.cantidad;

            detalle.push({
                productoId: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: item.cantidad
            });
        }

        const total = totalCentavos / 100;

        const confirmar = confirm(
            "¿Confirmar solicitud por " +
            formatoPrecio(total) + "?"
        );

        if (!confirmar) {
            return;
        }

        // Volver a verificar el stock antes de guardarlo
        for (const item of carrito) {

            const producto = productos.find(
                p => p.id === item.productoId
            );

            if (!producto || producto.stock < item.cantidad) {
                alert("El stock cambió. Revisa tu carrito.");
                mostrarCarrito();
                return;
            }
        }

        // Crear un nuevo pedido
        const pedidos = obtenerPedidos();

        const nuevoId = pedidos.length > 0
            ? Math.max(...pedidos.map(p => p.id)) + 1
            : 1;

        const pedido = {
            id: nuevoId,
            clienteId: cliente.id,
            clienteNombre: cliente.nombre,
            fecha: new Date().toLocaleString("es-EC"),
            productos: detalle,
            total: total,
            estado: "Pendiente"
        };

        // Descontar el inventario
        carrito.forEach(function (item) {

            const producto = productos.find(
                p => p.id === item.productoId
            );

            producto.stock -= item.cantidad;
        });

        // Guardar cambios en el navegador
        guardarProductos(productos);

        pedidos.push(pedido);
        guardarPedidos(pedidos);

        // Vaciar carrito del cliente
        guardarCarrito([]);

        alert(
            "¡Pedido registrado correctamente!\n" +
            "Número: #" + pedido.id +
            "\nTotal: " + formatoPrecio(total) +
            "\nEstado: Pendiente"
        );

        mostrarVistaCliente("clientePedidos");
    });

// ==============================================
// MOSTRAR PEDIDOS DEL CLIENTE
// ==============================================

function mostrarPedidosCliente() {

    const tabla = document.getElementById(
        "tablaPedidosCliente"
    );

    tabla.replaceChildren();

    const cliente = obtenerClienteTienda();

    if (!cliente) {
        return;
    }

    // Mostrar únicamente los pedidos de este cliente
    const misPedidos = obtenerPedidos().filter(function (pedido) {
        return pedido.clienteId === cliente.id;
    });

    if (misPedidos.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = "Todavía no tienes pedidos.";
        celda.style.textAlign = "center";

        fila.appendChild(celda);
        tabla.appendChild(fila);
        return;
    }

    misPedidos.forEach(function (pedido) {

        const fila = document.createElement("tr");

        const detalle = pedido.productos.map(function (p) {
            return p.nombre + " (x" + p.cantidad + ")";
        }).join(", ");

        const datos = [
            "#" + pedido.id,
            pedido.fecha,
            detalle,
            formatoPrecio(pedido.total),
            pedido.estado
        ];

        datos.forEach(function (dato, indice) {

            const celda = document.createElement("td");

            if (indice === 4) {

                const etiqueta = document.createElement("span");
                etiqueta.className = "cliente-estado";
                etiqueta.textContent = dato;

                celda.appendChild(etiqueta);

            } else {
                celda.textContent = dato;
            }

            fila.appendChild(celda);
        });

        tabla.appendChild(fila);
    });
}

// ==============================================
// BOTÓN PARA ABRIR EL CARRITO
// ==============================================

document.getElementById("abrirCarrito")
    .addEventListener("click", function () {

        mostrarVistaCliente("clienteCarrito");

    });

// ==============================================
// INICIALIZAR CONTADOR
// ==============================================

actualizarContadorCarrito();


// ==============================================
// PASO 5 - ADMINISTRACIÓN AUTOTECH
// ==============================================

// Estados permitidos en el sistema
const ESTADOS_CITAS = [
    "Pendiente",
    "En revisión",
    "En proceso",
    "Finalizado",
    "Cancelado"
];

const ESTADOS_PEDIDOS = [
    "Pendiente",
    "En proceso",
    "Completado",
    "Cancelado"
];

// ==============================================
// 1. VERIFICAR ROL DE ADMINISTRADOR
// ==============================================


function obtenerAdministradorActivo() {

    const sesion = JSON.parse(
        localStorage.getItem("autotech_sesion") || "null"
    );

    if (!sesion || sesion.rol !== "administrador") {
        return null;
    }

    const usuario = obtenerUsuarios().find(function (u) {

        return u.id === sesion.id &&
               u.correo === sesion.correo &&
               u.rol === "administrador" &&
               u.activo === true;

    });

    return usuario || null;
}


// ==============================================
// 2. CONFIRMACIONES Y MENSAJES
// ==============================================

async function confirmarAccionAdmin(texto) {

    if (typeof Swal !== "undefined") {

        const resultado = await Swal.fire({
            title: "¿Estás seguro?",
            text: texto,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#bb2525",
            cancelButtonColor: "#64748b"
        });

        return resultado.isConfirmed;
    }

    return window.confirm(texto);
}

function avisoAdmin(texto, tipo = "success") {

    if (typeof Swal !== "undefined") {
        Swal.fire({
            title: tipo === "success" ? "Correcto" : "Aviso",
            text: texto,
            icon: tipo,
            confirmButtonColor: "#142235"
        });
    } else {
        alert(texto);
    }
}

// ==============================================
// 3. HISTORIAL DE AUDITORÍA
// ==============================================

function obtenerLogsAdmin() {
    return JSON.parse(
        localStorage.getItem("autotech_logs") || "[]"
    );
}

function registrarLogAdmin(accion) {

    const administrador = obtenerAdministradorActivo();

    if (!administrador) {
        return;
    }

    const logs = obtenerLogsAdmin();

    const nuevoId = logs.length > 0
        ? Math.max(...logs.map(l => l.id)) + 1
        : 1;

    logs.push({
        id: nuevoId,
        fecha: new Date().toLocaleString("es-EC"),
        administrador: administrador.nombre,
        accion: accion
    });

    localStorage.setItem(
        "autotech_logs",
        JSON.stringify(logs)
    );
}

// ==============================================
// 4. MOSTRAR PANEL ADMINISTRADOR
// ==============================================

function mostrarPanelAdministrador(usuario) {

    if (!obtenerAdministradorActivo()) {
        cerrarSesion();
        return;
    }

    document.getElementById("panelCliente")
        .classList.add("oculto");

    document.getElementById("panelAdministrador")
        .classList.remove("oculto");

    document.getElementById("nombreAdministrador")
        .textContent = usuario.nombre;

    mostrarVistaAdministrador("adminDashboard");
}

// ==============================================
// 5. NAVEGACIÓN ADMINISTRATIVA
// ==============================================

function mostrarVistaAdministrador(idVista) {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    document.querySelectorAll(".admin-vista")
        .forEach(function (vista) {
            vista.classList.add("oculto");
        });

    const vista = document.getElementById(idVista);

    if (!vista) {
        return;
    }

    vista.classList.remove("oculto");

    document.querySelectorAll(".admin-menu-btn")
        .forEach(function (boton) {

            boton.classList.toggle(
                "activo",
                boton.dataset.adminVista === idVista
            );
        });

    if (idVista === "adminDashboard") {
        actualizarDashboardAdmin();
    }

    if (idVista === "adminMantenimientos") {
        cargarClientesAdmin();
        mostrarMantenimientosAdmin();
    }

    if (idVista === "adminInventario") {
        mostrarInventarioAdmin();
    }

    if (idVista === "adminPedidos") {
        mostrarPedidosAdmin();
    }

    if (idVista === "adminAuditoria") {
        mostrarAuditoriaAdmin();
    }
}

// Botones del menú lateral
document.querySelectorAll(".admin-menu-btn")
    .forEach(function (boton) {

        boton.addEventListener("click", function () {
            mostrarVistaAdministrador(
                this.dataset.adminVista
            );
        });
    });

// Cerrar sesión
document.getElementById("cerrarSesionAdministrador")
    .addEventListener("click", cerrarSesion);

// ==============================================
// 6. DASHBOARD Y ESTADÍSTICAS
// ==============================================

function actualizarDashboardAdmin() {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const usuarios = obtenerUsuarios();
    const citas = obtenerCitas();
    const productos = obtenerProductos();
    const pedidos = obtenerPedidos();

    const clientes = usuarios.filter(
        u => u.rol === "cliente"
    );

    document.getElementById("adminTotalClientes")
        .textContent = clientes.length;

    document.getElementById("adminTotalCitas")
        .textContent = citas.length;

    document.getElementById("adminTotalRepuestos")
        .textContent = productos.length;

    document.getElementById("adminTotalPedidos")
        .textContent = pedidos.length;

    document.getElementById("adminCitasPendientes")
        .textContent = citas.filter(
            c => c.estado === "Pendiente"
        ).length;

    document.getElementById("adminCitasProceso")
        .textContent = citas.filter(
            c => c.estado === "En proceso"
        ).length;

    document.getElementById("adminCitasFinalizadas")
        .textContent = citas.filter(
            c => c.estado === "Finalizado"
        ).length;
}

// ==============================================
// 7. FUNCIONES PARA CREAR TABLAS
// ==============================================

// Crear celdas sin insertar HTML del usuario
function crearCeldaAdmin(contenido) {

    const celda = document.createElement("td");

    celda.textContent = String(contenido ?? "");

    return celda;
}

// Mensaje cuando no existen registros
function tablaAdminVacia(tabla, columnas, mensaje) {

    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = columnas;
    celda.textContent = mensaje;
    celda.style.textAlign = "center";

    fila.appendChild(celda);
    tabla.appendChild(fila);
}

// Crear botones de editar o eliminar
function crearBotonAdmin(texto, clase, accion) {

    const boton = document.createElement("button");

    boton.type = "button";
    boton.textContent = texto;
    boton.className = clase;

    boton.addEventListener("click", accion);

    return boton;
}

// ==============================================
// 8. CARGAR CLIENTES EN EL FORMULARIO
// ==============================================

function cargarClientesAdmin() {

    const select = document.getElementById(
        "adminCitaCliente"
    );

    const valorAnterior = select.value;

    select.replaceChildren();

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "Seleccionar cliente";
    select.appendChild(opcionInicial);

    obtenerUsuarios()
        .filter(u => u.rol === "cliente")
        .forEach(function (cliente) {

            const opcion = document.createElement("option");

            opcion.value = cliente.id;
            opcion.textContent =
                cliente.nombre + " - " + cliente.correo;

            select.appendChild(opcion);
        });

    select.value = valorAnterior;

    // Si el anterior no existe, volver al valor vacío
    if (select.selectedIndex === -1) {
        select.value = "";
    }
}

// ==============================================
// 9. MOSTRAR TODOS LOS MANTENIMIENTOS
// ==============================================

function mostrarMantenimientosAdmin() {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const tabla = document.getElementById("tablaAdminCitas");

    tabla.replaceChildren();

    const citas = obtenerCitas();
    const usuarios = obtenerUsuarios();

    if (citas.length === 0) {

        tablaAdminVacia(
            tabla,
            7,
            "Todavía no existen solicitudes."
        );
        return;
    }

    citas.forEach(function (cita) {

        const cliente = usuarios.find(
            u => u.id === cita.clienteId
        );

        const fila = document.createElement("tr");

        fila.appendChild(crearCeldaAdmin("#" + cita.id));

        fila.appendChild(crearCeldaAdmin(
            cliente ? cliente.nombre : cita.nombre
        ));

        fila.appendChild(crearCeldaAdmin(cita.placa));

        fila.appendChild(crearCeldaAdmin(cita.servicio));

        fila.appendChild(crearCeldaAdmin(
            cita.fecha + " " + cita.hora
        ));

        // Selector de estados
        const celdaEstado = document.createElement("td");
        const selectEstado = document.createElement("select");

        ESTADOS_CITAS.forEach(function (estado) {

            const opcion = document.createElement("option");

            opcion.value = estado;
            opcion.textContent = estado;

            selectEstado.appendChild(opcion);
        });

        selectEstado.value = cita.estado;

        selectEstado.addEventListener("change", function () {
            cambiarEstadoCitaAdmin(
                cita.id,
                selectEstado.value
            );
        });

        celdaEstado.appendChild(selectEstado);
        fila.appendChild(celdaEstado);

        // Botones de acciones
        const celdaAcciones = document.createElement("td");

        const editar = crearBotonAdmin(
            "Editar",
            "admin-btn-editar",
            function () {
                editarMantenimientoAdmin(cita.id);
            }
        );

        const eliminar = crearBotonAdmin(
            "Eliminar",
            "admin-btn-eliminar",
            function () {
                eliminarMantenimientoAdmin(cita.id);
            }
        );

        celdaAcciones.append(editar, eliminar);

        fila.appendChild(celdaAcciones);
        tabla.appendChild(fila);
    });
}

// ==============================================
// 10. CAMBIAR ESTADO DE MANTENIMIENTO
// ==============================================

function cambiarEstadoCitaAdmin(id, nuevoEstado) {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    if (!ESTADOS_CITAS.includes(nuevoEstado)) {
        mostrarMantenimientosAdmin();
        return;
    }

    const citas = obtenerCitas();

    const cita = citas.find(c => c.id === id);

    if (!cita) {
        mostrarMantenimientosAdmin();
        return;
    }

    const estadoAnterior = cita.estado;

    if (estadoAnterior === nuevoEstado) {
        return;
    }

    cita.estado = nuevoEstado;

    guardarCitas(citas);

    registrarLogAdmin(
        "Cambió la cita #" + id +
        " de " + estadoAnterior +
        " a " + nuevoEstado
    );

    mostrarMantenimientosAdmin();
    avisoAdmin("Estado actualizado correctamente.");
}

// ==============================================
// 11. LIMPIAR FORMULARIO DE MANTENIMIENTO
// ==============================================

function limpiarFormularioMantenimientoAdmin() {

    document.getElementById("formAdminMantenimiento")
        .reset();

    document.getElementById("adminCitaId").value = "";

    document.getElementById(
        "tituloFormularioMantenimiento"
    ).textContent = "Registrar mantenimiento";

    document.getElementById(
        "adminMensajeMantenimiento"
    ).textContent = "";

    document.getElementById("adminCitaFecha").min =
        obtenerFechaLocal();

    document.getElementById("adminCitaAnio").max =
        new Date().getFullYear() + 1;

    cargarClientesAdmin();
}

document.getElementById("cancelarEdicionCita")
    .addEventListener(
        "click",
        limpiarFormularioMantenimientoAdmin
    );

// ==============================================
// 12. EDITAR MANTENIMIENTO
// ==============================================

function editarMantenimientoAdmin(id) {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const cita = obtenerCitas().find(c => c.id === id);

    if (!cita) {
        return;
    }

    cargarClientesAdmin();

    document.getElementById("adminCitaId").value =
        cita.id;

    document.getElementById("adminCitaCliente").value =
        cita.clienteId;

    document.getElementById("adminCitaPlaca").value =
        cita.placa;

    document.getElementById("adminCitaMarca").value =
        cita.marca;

    document.getElementById("adminCitaModelo").value =
        cita.modelo;

    document.getElementById("adminCitaAnio").value =
        cita.anio;

    document.getElementById("adminCitaKilometraje").value =
        cita.kilometraje;

    document.getElementById("adminCitaServicio").value =
        cita.servicio;

    document.getElementById("adminCitaFecha").value =
        cita.fecha;

    // Permitir editar citas anteriores sin cambiar
    // forzosamente su fecha original
    document.getElementById("adminCitaFecha")
        .removeAttribute("min");

    document.getElementById("adminCitaHora").value =
        cita.hora;

    document.getElementById("adminCitaEstado").value =
        cita.estado;

    document.getElementById("adminCitaDescripcion").value =
        cita.descripcion;

    document.getElementById(
        "tituloFormularioMantenimiento"
    ).textContent = "Editar mantenimiento #" + cita.id;

    document.getElementById("formAdminMantenimiento")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}

// ==============================================
// 13. GUARDAR MANTENIMIENTO
// ==============================================

document.getElementById("formAdminMantenimiento")
    .addEventListener("submit", function (evento) {

        evento.preventDefault();

        if (!obtenerAdministradorActivo()) {
            return;
        }

        const mensaje = document.getElementById(
            "adminMensajeMantenimiento"
        );

        mensaje.textContent = "";

        const idTexto = document.getElementById(
            "adminCitaId"
        ).value;

        const clienteId = Number(
            document.getElementById("adminCitaCliente").value
        );

        const placa = document.getElementById(
            "adminCitaPlaca"
        ).value.trim().toUpperCase();

        const marca = document.getElementById(
            "adminCitaMarca"
        ).value.trim();

        const modelo = document.getElementById(
            "adminCitaModelo"
        ).value.trim();

        const anioTexto = document.getElementById(
            "adminCitaAnio"
        ).value;

        const kilometrajeTexto = document.getElementById(
            "adminCitaKilometraje"
        ).value;

        const anio = Number(anioTexto);
        const kilometraje = Number(kilometrajeTexto);

        const servicio = document.getElementById(
            "adminCitaServicio"
        ).value;

        const fecha = document.getElementById(
            "adminCitaFecha"
        ).value;

        const hora = document.getElementById(
            "adminCitaHora"
        ).value;

        const estado = document.getElementById(
            "adminCitaEstado"
        ).value;

        const descripcion = document.getElementById(
            "adminCitaDescripcion"
        ).value.trim();

        const cliente = obtenerUsuarios().find(
            u => u.id === clienteId && u.rol === "cliente"
        );

        // VALIDACIONES

        if (!cliente || !placa || !marca || !modelo ||
            !anioTexto || !kilometrajeTexto ||
            !servicio || !fecha || !hora || !descripcion) {

            mensaje.textContent =
                "Completa todos los campos obligatorios.";
            return;
        }

        if (!validarPlaca(placa)) {
            mensaje.textContent =
                "La placa debe tener el formato ABC-1234.";
            return;
        }

        if (!Number.isInteger(anio) ||
            anio < 1950 ||
            anio > new Date().getFullYear() + 1) {

            mensaje.textContent =
                "El año del vehículo es incorrecto.";
            return;
        }

        if (!Number.isInteger(kilometraje) ||
            kilometraje < 0) {

            mensaje.textContent =
                "El kilometraje debe ser un entero mayor o igual a cero.";
            return;
        }

        if (!ESTADOS_CITAS.includes(estado)) {
            mensaje.textContent = "Estado inválido.";
            return;
        }

        if (descripcion.length < 10) {
            mensaje.textContent =
                "Describe el problema con al menos 10 caracteres.";
            return;
        }

        if (modelo.length < 2) {

            mensaje.textContent =
                "El modelo debe tener al menos 2 caracteres.";
            return;
        }

        if (descripcion.length > 500) {

            mensaje.textContent =
                "La descripción no puede superar los 500 caracteres.";
            return;
        }


        const citas = obtenerCitas();

        const citaAnterior = idTexto
            ? citas.find(c => c.id === Number(idTexto))
            : null;

        if (idTexto && !citaAnterior) {
            mensaje.textContent =
                "La solicitud que intentas editar ya no existe.";
            return;
        }

        // Se puede conservar una fecha pasada al editar
        const conservaFechaAnterior =
            citaAnterior && citaAnterior.fecha === fecha;

        if (fecha < obtenerFechaLocal() &&
            !conservaFechaAnterior) {

            mensaje.textContent =
                "La nueva fecha no puede estar en el pasado.";
            return;
        }

        const dia = new Date(
            fecha + "T12:00:00"
        ).getDay();

        if (dia === 0 && !conservaFechaAnterior) {
            mensaje.textContent =
                "El taller no atiende los domingos.";
            return;
        }

        if (hora < "08:00" || hora > "17:30") {
            mensaje.textContent =
                "Selecciona una hora entre 08:00 y 17:30.";
            return;
        }

        const datos = {
            
            clienteId: cliente.id,
            nombre: cliente.nombre,
            correo: cliente.correo,
            telefono: cliente.telefono,
            placa: placa,
            marca: marca,
            modelo: modelo,
            anio: anio,
            kilometraje: kilometraje,
            servicio: servicio,
            fecha: fecha,
            hora: hora,
            descripcion: descripcion,
            estado: estado
        };

        if (citaAnterior) {

            // UPDATE
            Object.assign(citaAnterior, datos);

            registrarLogAdmin(
                "Editó la solicitud de mantenimiento #" +
                citaAnterior.id
            );

        } else {

            // CREATE
            const nuevoId = citas.length > 0
                ? Math.max(...citas.map(c => c.id)) + 1
                : 1;

            citas.push({
                id: nuevoId,
                ...datos,
                prioridad: "Normal",
                revisiones: [],
                fechaRegistro: new Date().toISOString()
            });

            registrarLogAdmin(
                "Creó la solicitud de mantenimiento #" +
                nuevoId + " para " + cliente.nombre
            );
        }

        guardarCitas(citas);

        limpiarFormularioMantenimientoAdmin();
        mostrarMantenimientosAdmin();

        avisoAdmin("Mantenimiento guardado correctamente.");
    });

// ==============================================
// 14. ELIMINAR MANTENIMIENTO
// ==============================================

async function eliminarMantenimientoAdmin(id) {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const citas = obtenerCitas();
    const cita = citas.find(c => c.id === id);

    if (!cita) {
        return;
    }

    const confirmado = await confirmarAccionAdmin(
        "Se eliminará la solicitud #" + id
    );

    if (!confirmado || !obtenerAdministradorActivo()) {
        return;
    }

    const nuevasCitas = obtenerCitas().filter(
        c => c.id !== id
    );

    guardarCitas(nuevasCitas);

    registrarLogAdmin(
        "Eliminó la solicitud de mantenimiento #" + id
    );

    limpiarFormularioMantenimientoAdmin();
    mostrarMantenimientosAdmin();

    avisoAdmin("Solicitud eliminada.");
}

// ==============================================
// 15. MOSTRAR INVENTARIO DE REPUESTOS
// ==============================================

function mostrarInventarioAdmin() {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const tabla = document.getElementById(
        "tablaAdminProductos"
    );

    tabla.replaceChildren();

    const productos = obtenerProductos();

    if (productos.length === 0) {
        tablaAdminVacia(
            tabla, 6, "No hay productos registrados."
        );
        return;
    }

    productos.forEach(function (producto) {

        const fila = document.createElement("tr");

        fila.appendChild(
            crearCeldaAdmin("#" + producto.id)
        );

        fila.appendChild(
            crearCeldaAdmin(producto.nombre)
        );

        fila.appendChild(
            crearCeldaAdmin(producto.categoria)
        );

        fila.appendChild(
            crearCeldaAdmin(formatoPrecio(producto.precio))
        );

        fila.appendChild(
            crearCeldaAdmin(producto.stock)
        );

        const acciones = document.createElement("td");

        const editar = crearBotonAdmin(
            "Editar",
            "admin-btn-editar",
            function () {
                editarProductoAdmin(producto.id);
            }
        );

        const eliminar = crearBotonAdmin(
            "Eliminar",
            "admin-btn-eliminar",
            function () {
                eliminarProductoAdmin(producto.id);
            }
        );

        acciones.append(editar, eliminar);

        fila.appendChild(acciones);
        tabla.appendChild(fila);
    });
}

// ==============================================
// 16. EDITAR REPUESTOS
// ==============================================

function editarProductoAdmin(id) {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const producto = obtenerProductos().find(
        p => p.id === id
    );

    if (!producto) {
        return;
    }

    document.getElementById("adminProductoId").value =
        producto.id;

    document.getElementById("adminProductoNombre").value =
        producto.nombre;

    document.getElementById("adminProductoCategoria").value =
        producto.categoria;

    document.getElementById("adminProductoPrecio").value =
        producto.precio;

    document.getElementById("adminProductoStock").value =
        producto.stock;

    document.getElementById("adminProductoImagen").value =
        producto.imagen || "";

    document.getElementById(
        "tituloFormularioProducto"
    ).textContent = "Editar repuesto #" + producto.id;

    document.getElementById("formAdminProducto")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}

// ==============================================
// 17. LIMPIAR FORMULARIO DE PRODUCTOS
// ==============================================

function limpiarFormularioProductoAdmin() {

    document.getElementById("formAdminProducto")
        .reset();

    document.getElementById("adminProductoId").value = "";

    document.getElementById(
        "tituloFormularioProducto"
    ).textContent = "Registrar nuevo repuesto";

    document.getElementById(
        "adminMensajeProducto"
    ).textContent = "";
}

document.getElementById("cancelarEdicionProductoAdmin")
    .addEventListener(
        "click",
        limpiarFormularioProductoAdmin
    );

// ==============================================
// 18. GUARDAR PRODUCTO (CREATE / UPDATE)
// ==============================================

document.getElementById("formAdminProducto")
    .addEventListener("submit", function (evento) {

        evento.preventDefault();

        if (!obtenerAdministradorActivo()) {
            return;
        }

        const mensaje = document.getElementById(
            "adminMensajeProducto"
        );

        mensaje.textContent = "";

        const idTexto = document.getElementById(
            "adminProductoId"
        ).value;

        const nombre = document.getElementById(
            "adminProductoNombre"
        ).value.trim();

        const categoria = document.getElementById(
            "adminProductoCategoria"
        ).value;

        const precioTexto = document.getElementById(
            "adminProductoPrecio"
        ).value;

        const stockTexto = document.getElementById(
            "adminProductoStock"
        ).value;

        const imagenTexto = document.getElementById(
            "adminProductoImagen"
        ).value.trim();

        const precio = Number(precioTexto);
        const stock = Number(stockTexto);

        if (!nombre || !categoria ||
            precioTexto === "" || stockTexto === "") {

            mensaje.textContent =
                "Completa los campos obligatorios.";
            return;
        }

        if (nombre.length < 3) {
            mensaje.textContent =
                "El nombre debe tener al menos 3 caracteres.";
            return;
        }

        // Precio positivo, máximo dos decimales
        const regexPrecio = /^\d+(\.\d{1,2})?$/;

        if (!regexPrecio.test(precioTexto) ||
            !Number.isFinite(precio) || precio <= 0) {

            mensaje.textContent =
                "Ingresa un precio válido con máximo 2 decimales.";
            return;
        }

        if (!Number.isInteger(stock) || stock < 0) {
            mensaje.textContent =
                "El stock debe ser un número entero no negativo.";
            return;
        }

        // Solo rutas de imágenes locales o HTTPS
        if (imagenTexto &&
            !imagenTexto.startsWith("assets/img/") &&
            !imagenTexto.startsWith("https://")) {

            mensaje.textContent =
                "Utiliza una ruta assets/img/ o una URL HTTPS.";
            return;
        }

        const productos = obtenerProductos();

        const productoAnterior = idTexto
            ? productos.find(p => p.id === Number(idTexto))
            : null;

        if (idTexto && !productoAnterior) {
            mensaje.textContent =
                "El producto que intentas editar ya no existe.";
            return;
        }

        const datos = {
            nombre: nombre,
            categoria: categoria,
            precio: precio,
            stock: stock,
            imagen: imagenTexto ||
                "assets/img/taller-principal.jpg"
        };

        if (productoAnterior) {

            // UPDATE
            Object.assign(productoAnterior, datos);

            registrarLogAdmin(
                "Editó el repuesto '" + nombre +
                "' (#" + productoAnterior.id + ")"
            );

        } else {

            // CREATE
            const nuevoId = productos.length > 0
                ? Math.max(...productos.map(p => p.id)) + 1
                : 1;

            productos.push({
                id: nuevoId,
                ...datos
            });

            registrarLogAdmin(
                "Creó el repuesto '" + nombre + "'"
            );
        }

        guardarProductos(productos);

        limpiarFormularioProductoAdmin();
        mostrarInventarioAdmin();

        avisoAdmin("Repuesto guardado correctamente.");
    });

// ==============================================
// 19. ELIMINAR PRODUCTOS
// ==============================================

async function eliminarProductoAdmin(id) {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const producto = obtenerProductos().find(
        p => p.id === id
    );

    if (!producto) {
        return;
    }

    const confirmado = await confirmarAccionAdmin(
        "¿Eliminar el repuesto '" + producto.nombre + "'?"
    );

    if (!confirmado || !obtenerAdministradorActivo()) {
        return;
    }

    const productosActuales = obtenerProductos();

    const productoActual = productosActuales.find(
        p => p.id === id
    );

    if (!productoActual) {
        return;
    }

    guardarProductos(
        productosActuales.filter(p => p.id !== id)
    );

    registrarLogAdmin(
        "Eliminó el repuesto '" +
        productoActual.nombre + "' (#" + id + ")"
    );

    limpiarFormularioProductoAdmin();
    mostrarInventarioAdmin();

    avisoAdmin("Repuesto eliminado correctamente.");
}

// ==============================================
// 20. MOSTRAR PEDIDOS DE TODOS LOS CLIENTES
// ==============================================

function mostrarPedidosAdmin() {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const tabla = document.getElementById(
        "tablaAdminPedidos"
    );

    tabla.replaceChildren();

    const pedidos = obtenerPedidos();

    if (pedidos.length === 0) {
        tablaAdminVacia(
            tabla, 7, "Todavía no existen pedidos."
        );
        return;
    }

    pedidos.forEach(function (pedido) {

        const fila = document.createElement("tr");

        const detalle = pedido.productos.map(function (p) {
            return p.nombre + " x" + p.cantidad;
        }).join(", ");

        fila.appendChild(
            crearCeldaAdmin("#" + pedido.id)
        );

        fila.appendChild(
            crearCeldaAdmin(pedido.clienteNombre)
        );

        fila.appendChild(
            crearCeldaAdmin(pedido.fecha)
        );

        fila.appendChild(
            crearCeldaAdmin(detalle)
        );

        fila.appendChild(
            crearCeldaAdmin(formatoPrecio(pedido.total))
        );

        // Selector de estados
        const celdaEstado = document.createElement("td");

        const select = document.createElement("select");

        ESTADOS_PEDIDOS.forEach(function (estado) {

            const opcion = document.createElement("option");

            opcion.value = estado;
            opcion.textContent = estado;

            select.appendChild(opcion);
        });

        select.value = pedido.estado;

        celdaEstado.appendChild(select);
        fila.appendChild(celdaEstado);

        // Botón para guardar el nuevo estado
        const celdaAccion = document.createElement("td");

        const guardar = crearBotonAdmin(
            "Guardar",
            "admin-btn-guardar",
            function () {

                cambiarEstadoPedidoAdmin(
                    pedido.id,
                    select.value
                );
            }
        );

        celdaAccion.appendChild(guardar);
        fila.appendChild(celdaAccion);

        tabla.appendChild(fila);
    });
}

// ==============================================
// 21. ACTUALIZAR ESTADO DE PEDIDOS
// ==============================================

function cambiarEstadoPedidoAdmin(id, nuevoEstado) {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    if (!ESTADOS_PEDIDOS.includes(nuevoEstado)) {
        return;
    }

    const pedidos = obtenerPedidos();

    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) {
        return;
    }

    if (pedido.estado === nuevoEstado) {
        avisoAdmin("El pedido ya tiene ese estado.", "info");
        return;
    }

    const anterior = pedido.estado;

    pedido.estado = nuevoEstado;

    guardarPedidos(pedidos);

    registrarLogAdmin(
        "Cambió el pedido #" + id +
        " de " + anterior + " a " + nuevoEstado
    );

    mostrarPedidosAdmin();

    avisoAdmin("Estado del pedido actualizado.");
}

// ==============================================
// 22. MOSTRAR HISTORIAL DE AUDITORÍA
// ==============================================

function mostrarAuditoriaAdmin() {

    if (!obtenerAdministradorActivo()) {
        return;
    }

    const tabla = document.getElementById(
        "tablaAdminLogs"
    );

    tabla.replaceChildren();

    const logs = obtenerLogsAdmin().slice().reverse();

    if (logs.length === 0) {
        tablaAdminVacia(
            tabla, 4, "No se han registrado acciones."
        );
        return;
    }

    logs.forEach(function (log) {

        const fila = document.createElement("tr");

        fila.appendChild(
            crearCeldaAdmin("#" + log.id)
        );

        fila.appendChild(
            crearCeldaAdmin(log.fecha)
        );

        fila.appendChild(
            crearCeldaAdmin(log.administrador)
        );

        fila.appendChild(
            crearCeldaAdmin(log.accion)
        );

        tabla.appendChild(fila);
    });
}

// ==============================================
// FIN DEL PASO 5
// ==============================================

// ==============================================
// PASO 6 - VALIDACIONES ADICIONALES
// ==============================================

// Comprobar si una fecha y hora ya están ocupadas
function horarioOcupado(fecha, hora, idExcluir = null) {

    const citas = obtenerCitas();

    return citas.some(function (cita) {

        return cita.fecha === fecha &&
               cita.hora === hora &&
               cita.estado !== "Cancelado" &&
               cita.id !== idExcluir;

    });
}

// Comprobar si el horario pertenece a la lista permitida
function validarHorarioCita(hora) {

    const horarios = [
        "08:00", "08:30", "09:00", "09:30",
        "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30"
    ];

    return horarios.includes(hora);
}

// Comprobar que la fecha y hora sean futuras
function fechaHoraFutura(fecha, hora) {

    const fechaSeleccionada = new Date(
        fecha + "T" + hora + ":00"
    );

    return !Number.isNaN(fechaSeleccionada.getTime()) &&
           fechaSeleccionada.getTime() > Date.now();
}
