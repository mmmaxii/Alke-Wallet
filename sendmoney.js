// Definimos una clave única para el almacenamiento
const CLAVE_CONTACTOS = "wallet_contactos";
const CLAVE_HISTORIAL = "wallet_historial";

// Esto es lo que se cargará si el usuario no tiene contactos guardados
const contactosIniciales = [
    { nombre: "James Dev", cbu: "000000321", banco: "Banco Python", alias: "James.code" },
    { nombre: "John Doe", cbu: "123456789", banco: "Banco ABC", alias: "john.doe" },
    { nombre: "Jane Smith", cbu: "987654321", banco: "Banco XYZ", alias: "jane.smith" }
];

/*
Lo que quiero hacer con esta función es lo siguiente: Ya que quiero manipular la lista de contactos
y agregar nuevos, no puedo hacerlo directamente en el HTML. Por lo tanto, al cargar la página,
voy a traer los contactos del LocalStorage (o los iniciales si no hay) y los voy a dibujar
dinámicamente en el HTML usando JavaScript.
*/

/*
De esta manera creamos primero un "listener" que espera a que todo el HTML esté cargado,
con esto nos aseguramos de que los elementos que queremos manipular ya existen en el DOM.
Aquí verificamos si hay contactos guardados en el LocalStorage y si no, inicializamos con los de ejemplo.
A su vez llamamos a la función que configura los botones (volver y agregar contacto).
*/
document.addEventListener('DOMContentLoaded', () => {
    configurarBotones();
    cargarContactos();
    activarBotonesAccion();
});


function configurarBotones() {
    // Botón Volver
    document.getElementById('btnVolver').addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPagina('menu.html', 'Menú Principal');
    });

    // Botón Agregar Contacto 
    const btnAgregar = document.querySelector('.btn-outline-primary'); // El botón de "+ Agregar"
    if (btnAgregar) {
        btnAgregar.addEventListener('click', agregarContactoNuevo);
    }
}


// Reutilizacion
function cambiarPagina(url, nombrePagina) {
    /*Muestra que se redirige en la parte superior derecha*/
    Swal.fire({
        position: "top-end",
        icon: "info",
        iconColor: "#d14fd3ff",
        width: "350px",
        title: "Redirigiendo a " + nombrePagina,
        showConfirmButton: false,
        timer: 1000
    });

    setTimeout(() => {
        window.location.href = url;
    }, 1000);
}



function cargarContactos() {

    let contactosGuardados = localStorage.getItem(CLAVE_CONTACTOS);

    // Guardado de contactos si no hay datos.
    if (!contactosGuardados) {
        // Ya que LocalStorge no puede guardar un diccionario {key: value},
        // usamos JSON.stringify para pasar el diccionario a texto legible
        localStorage.setItem(CLAVE_CONTACTOS, JSON.stringify(contactosIniciales));
        contactosGuardados = JSON.stringify(contactosIniciales);
    }

    // Con JSON.parse convertimos el texto legible a un diccionario en js.
    const listaContactos = JSON.parse(contactosGuardados);

    renderizarLista(listaContactos);
}


function renderizarLista(contactos) {
    const contenedor = document.getElementById('listaContactos');
    contenedor.innerHTML = ''; // Limpiamos la lista antes de dibujar

    // Recorremos el Array (Bucle)
    contactos.forEach((contacto) => {
        // Creamos un lop donde se renderiza cada contacto que le agremaos
        // en el HTML.

        const itemHTML = `
            <li class="list-group-item contact-item" onclick="seleccionarContacto('${contacto.nombre}')">
                <div class="contact-name">${contacto.nombre}</div>
                <div class="contact-details">
                    CBU: ${contacto.cbu} · Alias: ${contacto.alias} · ${contacto.banco}
                </div>
            </li>
        `;

        // Lo agregamos al HTML
        contenedor.innerHTML += itemHTML;
    });
}




/*
Esta funcion se encarga de mostrar el popup para agregar un nuevo contacto.
Luego valida los datos ingresados y si todo está bien, lo guarda en el LocalStorage
y actualiza la lista en pantalla.
*/
function agregarContactoNuevo() {
    Swal.fire({
        title: 'Nuevo Contacto',
        // HTML personalizado con los 4 inputs que nos pide el enunciado.
        html: `
            <input id="input-nombre" class="swal2-input" placeholder="Nombre y Apellido">
            <input id="input-cbu" class="swal2-input" placeholder="Número de CBU" type="number">
            <input id="input-alias" class="swal2-input" placeholder="Alias (ej: Name.wallet)">
            <input id="input-banco" class="swal2-input" placeholder="Nombre del Banco">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        // preConfirm: Se ejecuta antes de cerrar para validar los datos
        preConfirm: () => {
            const nombre = document.getElementById('input-nombre').value;
            const cbu = document.getElementById('input-cbu').value;
            const alias = document.getElementById('input-alias').value;
            const banco = document.getElementById('input-banco').value;

            // Validación: Si falta algún dato, mostramos error
            if (!nombre || !cbu || !alias || !banco) {
                Swal.showValidationMessage('Por favor completa todos los campos');
                return false;
            }

            // Si todo está bien, retornamos un array con los 4 valores
            return [nombre, cbu, alias, banco];
        }
    }).then((result) => {
        // Si el usuario confirmó (apretó Guardar)
        if (result.isConfirmed) {

            // Desempaquetamos los valores del array que retornamos arriba
            const [nombre, cbu, alias, banco] = result.value;

            // 1. Crear el objeto nuevo con los datos NUEVOS.
            const nuevoContacto = {
                nombre: nombre,
                cbu: cbu,
                alias: alias,
                banco: banco
            };

            // 2. Traer la lista actual del LocalStorage
            let contactos = JSON.parse(localStorage.getItem(CLAVE_CONTACTOS));

            // 3. Agregar el nuevo a la lista (PUSH)
            contactos.push(nuevoContacto);

            // 4. GUARDAR DE NUEVO (JSON.stringify)
            localStorage.setItem(CLAVE_CONTACTOS, JSON.stringify(contactos));

            // 5. Volver a pintar la lista para ver el cambio al instante
            renderizarLista(contactos);

            // Mensaje de éxito
            Swal.fire({
                title: '¡Guardado!',
                text: 'El contacto se agregó correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
}

/*
Ahora nos preocuparmos por los botones de Enviar dinero y Eliminar Contactao
*/

// La necesitamos para guardar "en memoria" a quién le hiciste clic
let indiceSeleccionado = null;

/* Función encargada de gestionar la selección de un contacto.
Realiza dos tareas principales: 
1. Actualizar el estado lógico (saber qué índice se eligió).
2. Actualizar el estado visual (resaltar el elemento en el HTML).
*/
function seleccionarContacto(nombre) {

    // --- PASO 1: FEEDBACK VISUAL INMEDIATO ---
    // Rellenamos el input de búsqueda con el nombre para que el usuario 
    // tenga una confirmación visual clara de a quién seleccionó.
    document.getElementById('searchContact').value = nombre;


    // --- Paso 2: Busqueda en la base de datos que tenemos  (LocalStorage) ---
    const contactos = JSON.parse(localStorage.getItem(CLAVE_CONTACTOS));

    // Usamos el método .findIndex() para localizar la posición exacta (0, 1, 2...)
    // del contacto dentro del Array. 
    // Comparamos el nombre del contacto en memoria con el nombre que recibimos por parámetro.
    indiceSeleccionado = contactos.findIndex(contacto => contacto.nombre === nombre);


    // --- PASO 3: MANIPULACIÓN DEL DOM (CAMBIO DE ESTILOS) ---
    // Seleccionamos todos los elementos de la lista renderizada en el HTML (los <li>)
    // para poder manipular sus clases CSS.
    const itemsHTML = document.querySelectorAll('.contact-item');

    // Primero, recorremos TODOS los elementos y les quitamos la clase 'active-contact'
    // que indica cuando el mouse esta por encima.
    // Esto sirve para "des-seleccionar" cualquier contacto que estuviera marcado antes.

    itemsHTML.forEach(item => item.classList.remove('active-contact'));

    // Finalmente, si encontramos un índice válido (distinto de -1),
    // le agregamos la clase de estilo activo SOLO a ese elemento específico.
    if (indiceSeleccionado !== -1 &&
        itemsHTML[indiceSeleccionado] // existe. Manias de astro.
    ) {
        itemsHTML[indiceSeleccionado].classList.add('active-contact');
    }
}



/* Configura los "Listeners" para los botones de acción.
Gestiona la lógica de eliminación (actualizando el Array) y el envío de dinero (actualizando el saldo).
*/
function activarBotonesAccion() {

    // --- A. LÓGICA BOTÓN ELIMINAR (Sin cambios) ---
    const btnEliminar = document.getElementById('btnEliminarContacto');

    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (indiceSeleccionado === null) {
                Swal.fire('Atención', 'Primero selecciona un contacto de la lista para eliminarlo.', 'warning');
                return;
            }

            Swal.fire({
                title: '¿Estás seguro?',
                text: "Vas a eliminar a este contacto permanentemente.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let contactos = JSON.parse(localStorage.getItem(CLAVE_CONTACTOS));
                    contactos.splice(indiceSeleccionado, 1);
                    localStorage.setItem(CLAVE_CONTACTOS, JSON.stringify(contactos));
                    renderizarLista(contactos);

                    indiceSeleccionado = null;
                    document.getElementById('searchContact').value = '';
                    Swal.fire('Eliminado', 'El contacto ha sido borrado.', 'success');
                }
            });
        });
    }

    // --- B. LÓGICA BOTÓN ENVIAR DINERO (Modificada) ---
    const btnEnviar = document.getElementById('btnEnviarDinero');

    if (btnEnviar) {
        btnEnviar.addEventListener('click', () => {
            if (indiceSeleccionado === null) {
                Swal.fire('Atención', 'Selecciona un contacto para enviarle dinero.', 'info');
                return;
            }

            // Recuperamos el nombre del contacto para el registro
            // (Volvemos a leer la lista porque indiceSeleccionado es solo un número)
            const listaContactos = JSON.parse(localStorage.getItem(CLAVE_CONTACTOS));
            const contactoDestino = listaContactos[indiceSeleccionado];

            let saldoActual = localStorage.getItem("Balance");
            saldoActual = parseFloat(saldoActual); // Asegurar que sea número para mostrarlo

            Swal.fire({
                title: `Enviar a ${contactoDestino.nombre}`, // Muestra el nombre en el título
                html: `Saldo disponible: <b>$${saldoActual}</b><br>Ingresa el monto:`,
                input: 'number',
                inputAttributes: { min: 0, step: 1 },
                showCancelButton: true,
                confirmButtonText: 'Transferir',
                preConfirm: (monto) => {
                    if (!monto || monto <= 0) {
                        Swal.showValidationMessage('Ingresa un monto válido mayor a 0');
                    }
                    return monto;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const montoEnviar = parseFloat(result.value);

                    // Volvemos a leer saldo por seguridad
                    let saldo = localStorage.getItem("Balance");
                    saldo = saldo ? parseFloat(saldo) : 0;

                    if (saldo < montoEnviar) {
                        Swal.fire('Saldo Insuficiente', `Solo tienes $${saldo} disponibles.`, 'error');
                        return;
                    }

                    // Descontar dinero
                    const nuevoSaldo = saldo - montoEnviar;
                    localStorage.setItem("Balance", nuevoSaldo);

                    Swal.fire({
                        title: '¡Envío Exitoso!',
                        text: `Has enviado $${montoEnviar} a ${contactoDestino.nombre}`,
                        icon: 'success'
                    }).then(() => {
                        // Registramos antes de irnos.
                        registrarTransaccion(contactoDestino.nombre, montoEnviar, Boolean(false));

                        window.location.href = 'menu.html';
                    });
                }
            });
        });
    }
}




function registrarTransaccion(nombreContacto, monto, deposito) {


    // 1. Obtenemos la fecha actual
    const fechaActual = new Date().toLocaleDateString();

    // 2. Creamos el objeto con las propiedades EXACTAS que usa tu 'renderizarMovimientos'

    const nuevaTransaccion = {
        titulo: `Transferencia a ` + nombreContacto, // Usamos 'titulo' para que se vea en el HTML
        fecha: fechaActual,
        monto: -monto  // Guardamos negativo para que salga en rojo y sin el signo '+'
    }


    // 3. Obtenemos el historial usando la MISMA clave que usas en cargarMovimientos
    // (Asegúrate de que esta variable sea accesible aquí o pon el string directo "wallet_historial")
    let movimientos = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];

        // 4. Agregamos el nuevo movimiento al principio (arriba de todo)
        movimientos.unshift(nuevaTransaccion);

        // 5. Guardamos en LocalStorage
        localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(movimientos));
    }