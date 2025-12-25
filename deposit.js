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
        timer: 1500
    });

    setTimeout(() => {
        window.location.href = url;
    }, 1700);
}


// Ahora haremos lo correspondiente a depositar dinero
// Se supone que deberia almacenarse en una base de datos,
// pero como no tenemos usaremos un localstorage