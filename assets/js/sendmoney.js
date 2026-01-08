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


function cambiarPagina(url, nombrePagina) {
    Swal.fire({
        title: 'Redirigiendo a ' + nombrePagina,
        html: '<p style="margin-top: 10px;">Procesando solicitud...</p>',
        
        icon: 'info',
        iconColor: '#ffffff',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
        
        background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
        color: '#ffffff',

        showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster'
        },
        
        // Estilo de la barrita de carga (blanca semitransparente)
        didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector('.swal2-timer-progress-bar');
            if (b) b.style.backgroundColor = 'rgba(255,255,255,0.5)';
        },
        
        allowOutsideClick: false
    }).then(() => {
        window.location.href = url;
    });
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
        
        // --- FONDO Y TEXTO NUEVOS---
        background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
        color: '#ffffff',
        
        // --- INPUTS DE VIDRIO ---
        // Inyectamos CSS aquí mismo para forzar que los inputs sean transparentes ya que el
        // los inputs al parecer tienen mucha prioridad (Hablando de SweetAlert). 
        // La manera que encontre de modificarlo es la siguiente
        html: `
            <style>
                .swal2-input {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.3) !important;
                    border-radius: 12px !important;
                    color: white !important;
                }
                .swal2-input::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                }
                .swal2-validation-message {
                    background: rgba(0, 0, 0, 0.2) !important;
                    color: #ffcccc !important;
                }
            </style>
            
            <input id="input-nombre" class="swal2-input" placeholder="Nombre y Apellido">
            <input id="input-cbu" class="swal2-input" placeholder="Número de CBU" type="number">
            <input id="input-alias" class="swal2-input" placeholder="Alias (ej: Name.wallet)">
            <input id="input-banco" class="swal2-input" placeholder="Nombre del Banco">
        `,
        
        focusConfirm: false,
        showCancelButton: true,
        
        // --- BOTONES ---
        // Botón Guardar. Esto lo aplique varias veces antes, pero es mas comodo inyectar codigo html directamente
        // para poder modificar el estilo de los botones a gusto.
        confirmButtonText: '<span style="color: #582551; font-weight: bold;">Guardar</span>',
        confirmButtonColor: '#ffffff', 
        
        // Botón Cancelar: Morado oscuro
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#480ca8',

        // Animaciones suaves
        showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster'
        },

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

            // Mensaje de éxito (TAMBIÉN ESTILIZADO)
            Swal.fire({
                title: '¡Guardado!',
                text: 'El contacto se agregó correctamente',
                icon: 'success',
                iconColor: '#ffffff', // Check blanco
                timer: 2000,
                showConfirmButton: false,
                background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                color: '#ffffff'
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

    // --- LÓGICA BOTÓN ELIMINAR ---
    const btnEliminar = document.getElementById('btnEliminarContacto');

    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (indiceSeleccionado === null) {
                // Alerta: Atención 
                Swal.fire({
                    title: 'Atención',
                    text: 'Primero selecciona un contacto de la lista para eliminarlo.',
                    icon: 'warning',
                    iconColor: '#ffffff',
                    background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                    color: '#ffffff',
                    confirmButtonColor: '#ffffff',
                    confirmButtonText: '<span style="color: #582551; font-weight: bold;">Entendido</span>'
                });
                return;
            }

            // Alerta: Confirmación de Borrado 
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Vas a eliminar a este contacto permanentemente.",
                icon: 'warning',
                iconColor: '#ffffff',
                background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                color: '#ffffff',

                showCancelButton: true,
                
                // Botón Eliminar (Rojo brillante para peligro)
                confirmButtonColor: '#ff4d4d',
                confirmButtonText: 'Sí, eliminar',
                
                // Botón Cancelar (Morado oscuro)
                cancelButtonColor: '#480ca8',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let contactos = JSON.parse(localStorage.getItem(CLAVE_CONTACTOS));

                    // Aqui sabemos que el indice seleccionado siempre sera el que el usuario elige.
                    // Ya que este se actualiza cada vez con la función seleccionarContacto.
                    contactos.splice(indiceSeleccionado, 1);
                    // Esto elimina 1 elemento desde el indice seleccionado. Es decir 
                    // Elimina el contacto que se selecciono.

                    localStorage.setItem(CLAVE_CONTACTOS, JSON.stringify(contactos));
                    renderizarLista(contactos);

                    indiceSeleccionado = null;
                    document.getElementById('searchContact').value = '';
                    
                    // Alerta: Eliminado con éxito (Estilo Glass)
                    Swal.fire({
                        title: 'Eliminado',
                        text: 'El contacto ha sido borrado.',
                        icon: 'success',
                        iconColor: '#ffffff',
                        background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                        color: '#ffffff',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        });
    }

    // --- LÓGICA BOTÓN ENVIAR DINERO ---
    const btnEnviar = document.getElementById('btnEnviarDinero');

    if (btnEnviar) {
        btnEnviar.addEventListener('click', () => {
            if (indiceSeleccionado === null) {
                // Alerta: Atención
                Swal.fire({
                    title: 'Atención',
                    text: 'Selecciona un contacto para enviarle dinero.',
                    icon: 'info',
                    iconColor: '#ffffff',
                    background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                    color: '#ffffff',
                    confirmButtonColor: '#ffffff',
                    confirmButtonText: '<span style="color: #582551; font-weight: bold;">Entendido</span>'
                });
                return;
            }

            // Recuperamos el nombre del contacto para el registro
            // (Volvemos a leer la lista porque indiceSeleccionado es solo un número)
            const listaContactos = JSON.parse(localStorage.getItem(CLAVE_CONTACTOS));
            const contactoDestino = listaContactos[indiceSeleccionado];

            let saldoActual = localStorage.getItem("Balance");
            saldoActual = parseFloat(saldoActual); // Asegurar que sea número para mostrarlo

            // Alerta: Ingreso de Monto +
            Swal.fire({
                title: `Enviar a ${contactoDestino.nombre}`, // Muestra el nombre en el título
                
                // Inyectamos estilos CSS aquí para el Input
                html: `
                    <style>
                        .swal2-input {
                            background: rgba(255, 255, 255, 0.05) !important;
                            border: 1px solid rgba(255, 255, 255, 0.3) !important;
                            color: white !important;
                        }
                        .swal2-input::placeholder { color: rgba(255, 255, 255, 0.5) !important; }
                        .swal2-validation-message { background: rgba(0,0,0,0.2) !important; color: #ffcccc !important; }
                    </style>
                    <p>Saldo disponible: <b>$${saldoActual}</b></p>
                    <p style="margin-top:10px; font-size: 0.9em;">Ingresa el monto:</p>
                `,
                
                input: 'number',
                inputAttributes: { min: 0, step: 1 },
                // Esto segun sweetalert es, min: minimo que puede tener el input. Y avanza de 1 en 1 si se hace 
                // con la barra que esta a la derecha del input.
                
                background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                color: '#ffffff',

                showCancelButton: true,
                
                // Botón Transferir (Blanco)
                confirmButtonColor: '#ffffff',
                confirmButtonText: '<span style="color: #582551; font-weight: bold;">Transferir</span>',
                
                // Botón Cancelar (Morado oscuro)
                cancelButtonColor: '#480ca8',
                cancelButtonText: 'Cancelar',

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
                        // Alerta: Error de Saldo 
                        Swal.fire({
                            title: 'Saldo Insuficiente',
                            text: `Solo tienes $${saldo} disponibles.`,
                            icon: 'error',
                            iconColor: '#ffffff',
                            background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                            color: '#ffffff',
                            confirmButtonColor: '#ffffff',
                            confirmButtonText: '<span style="color: #582551; font-weight: bold;">Entendido</span>'
                        });
                        return;
                    }

                    // Si pasa la alerta anterior, entonces la transferencia fue efectiva. Por lo que descontamos el monto de su balance.

                    const nuevoSaldo = saldo - montoEnviar;
                    localStorage.setItem("Balance", nuevoSaldo);

                    // Alerta: Éxito
                    Swal.fire({
                        title: '¡Envío Exitoso!',
                        text: `Has enviado $${montoEnviar} a ${contactoDestino.nombre}`,
                        icon: 'success',
                        iconColor: '#ffffff',
                        background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
                        color: '#ffffff',
                        showConfirmButton: false,
                        timer: 2000
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

    // 2. Creamos el objeto con las propiedades EXACTAS que usa 'renderizarMovimientos'

    const nuevaTransaccion = {
        titulo: `Transferencia a ` + nombreContacto, // Usamos 'titulo' para que se vea en el HTML
        fecha: fechaActual,
        monto: -monto  // Guardamos negativo para que salga en rojo y sin el signo '+'
    }


    // 3. Obtenemos el historial usando la MISMA clave que usas en cargarMovimientos
    let movimientos = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];

        // 4. Agregamos el nuevo movimiento al principio (arriba de todo)
        movimientos.unshift(nuevaTransaccion);

        // 5. Guardamos en LocalStorage
        localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(movimientos));
    }