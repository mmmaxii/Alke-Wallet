const botons = document.querySelectorAll(".btn");

/* Reutilizamos el codigo de la calculadora que hicimos*/

botons.forEach(boton => {
    boton.addEventListener("click", (e) => {
        e.preventDefault();
        /*Usamos let para poder cambiar luego y que no nos de errores */
        let url = "";
        let nombrePagina = "";

        if (boton.id === "depositButton") {
            url = "deposit.html";
            nombrePagina = "Depósitos";
        } else if (boton.id === "sendMoneyButton") {
            url = "sendmoney.html";
            nombrePagina = "Enviar Dinero";
        } else if (boton.id === "transactionsButton") {
            url = "transactions.html";
            nombrePagina = "Transacciones";
        }

        cambiarPagina(url, nombrePagina);
    });
});

function cambiarPagina(url, nombrePagina) {
    /*Muestra que se redirige en la parte superior derecha*/
    Swal.fire({
        position: "top-end",
        icon: "info",
        iconColor: "#d14fd3ff",
        // Agregando mas personalización 
        width: "350px",
        title: "Redirigiendo a " + nombrePagina,
        showConfirmButton: false,
        timer: 1500
    });

    setTimeout(() => {
        window.location.href = url;
    }, 1700);
}
