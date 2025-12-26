
const btnVolver = document.getElementById('btnVolver');

/*Hace lo mismo que se hace en menu.js*/

btnVolver.addEventListener('click', (e) => {
    e.preventDefault();

    cambiarPagina('menu.html', 'Menú Principal');
});


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
        text: `Has agregado $${montoIngresado}. Saldo total: $${nuevoSaldo}`,
        icon: 'success',
        
        showCancelButton: true, // Habilita el segundo botón
        
        // Configuramos el botón Principal (Ir al Menú)
        confirmButtonText: 'Ir al Menú',
        confirmButtonColor: '#28a745', // Verde (éxito)
        
        // Configuramos el botón Secundario (Otro depósito)
        cancelButtonText: 'Hacer otro depósito',
        cancelButtonColor: '#3085d6', // Azul
        
        // Esto hace que si dan clic fuera, no se cierre solo
        allowOutsideClick: false 
    }).then((result) => {
        
        if (result.isConfirmed) {
            window.location.href = 'menu.html';
        } 
        else if (result.dismiss === Swal.DismissReason.cancel) {
            inputMonto.value = ''; 
        }
    });
});