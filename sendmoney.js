// Definimos una clave única para el almacenamiento
const CLAVE_CONTACTOS = "wallet_contactos";

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
    cargarContactos();
    configurarBotones();
});

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

function configurarBotones() {
    // Botón Volver
    document.getElementById('btnVolver').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'menu.html';
    });

    // Botón Agregar Contacto 
    const btnAgregar = document.querySelector('.btn-outline-primary'); // El botón de "+ Agregar"
    if (btnAgregar) {
        btnAgregar.addEventListener('click', agregarContactoNuevo);
    }
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
Funcion todavia en desarrollo.
*/
function seleccionarContacto(nombre) {
    // Ponemos el nombre en el input de búsqueda para simular selección
    document.getElementById('searchContact').value = nombre;
}