const CLAVE_HISTORIAL = "wallet_historial";
// Agregado de un comentario para ver que pasa con git.
const btnVolver = document.getElementById('btnVolver');

/*Hace lo mismo que se hace en menu.js*/

btnVolver.addEventListener('click', (e) => {
    e.preventDefault();

    cambiarPagina('menu.html', 'Menú Principal');
});

// Este bloque de codigo lo he reutilizado hartas veces, estaria bueno automatizarlo como una funcion exportable.

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

// Ahora haremos lo correspondiente a depositar dinero
// Se supone que deberia almacenarse en una base de datos,
// pero como no tenemos usaremos un localstorage

const botonDepositar = document.getElementById('btnDepositar');
const inputMonto = document.getElementById('depositAmount');

botonDepositar.addEventListener('click', (e) => {
    e.preventDefault();


    // parseFloat convierte el texto "500" a número 500.0
    const montoIngresado = parseFloat(inputMonto.value);

    // 4. Validación: Si no escribió nada o puso negativo
    if (isNaN(montoIngresado) || montoIngresado <= 0) {
        Swal.fire('Error', 'Ingresa un monto válido', 'error');
        return; // Detenemos la ejecución aquí
    }

    // Usamos la llave "Balance" que decidi antes en menu.html
    let saldoActual = localStorage.getItem("Balance");

    if (saldoActual === null) {
        saldoActual = 0;
    } else {
        saldoActual = parseFloat(saldoActual);
    }

    const nuevoSaldo = saldoActual + montoIngresado;

    // Esto sobrescribe el valor viejo con el nuevo
    localStorage.setItem("Balance", nuevoSaldo);



    Swal.fire({
        title: '¡Depósito realizado!',
        // Usamos HTML para poner negrita a los montos y que se vea mejor
        html: `
        <p>Has agregado <b>$${montoIngresado}</b></p>
        <p>Saldo total: <b>$${nuevoSaldo}</b></p>
    `,
        icon: 'success',
        iconColor: '#ffffff', // El check verde ahora es blanco para combinar

        
        background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
        color: '#ffffff',

        showCancelButton: true,

        // Ponemos HTML dentro del texto del botón para forzar el color morado
        confirmButtonText: '<span style="color: #582551; font-weight: bold;">Ir al Menú</span>',
        confirmButtonColor: '#ffffff',

        // Botón SECUNDARIO (Otro depósito)
        cancelButtonText: 'Hacer otro depósito',
        cancelButtonColor: '#480ca8', // Un morado más oscuro

        allowOutsideClick: false,

        
        showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster'
        }

    }).then((result) => {
        registrarDeposito(montoIngresado);

        if (result.isConfirmed) {
            // Si aprieta "Ir al Menú"
            cambiarPagina('menu.html', 'Menú Principal');
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            // Si aprieta "Hacer otro depósito", limpiamos el input
            document.getElementById('depositAmount').value = '';
        }
    });
});



function registrarDeposito(monto) {
    const fechaActual = new Date().toLocaleDateString();

    const nuevaTransaccion = {
        titulo: "Depósito de dinero", // Título fijo para depósitos
        fecha: fechaActual,
        monto: monto  // POSITIVO: Para que se pinte verde
    };

    // Leemos el historial existente
    let movimientos = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL)) || [];

    // Agregamos al principio
    movimientos.unshift(nuevaTransaccion);

    // Guardamos
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(movimientos));
}

