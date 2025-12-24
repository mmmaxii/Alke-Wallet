const botons = document.querySelectorAll(".btn");


/* Reutilizamos el codigo de la calculadora que hicimos*/

botons.forEach(boton => {
    boton.addEventListener("click", (e) => {
        e.preventDefault();
        /*Usamos let para poder cambiar luego y que no nos de errores */
        let url = "";

        if (boton.id === "depositButton") {
            url = "deposit.html";
        } else if (boton.id === "sendMoneyButton") {
            url = "sendmoney.html";
        } else if (boton.id === "transactionsButton") {
            url = "transactions.html";
        }

        cambiarPagina(url);
    });
});

function cambiarPagina(url) {
    /*Esto lo hice para que aparezca una pagina de carga,
    pero finalmente no pude hacer que cambie */
    setTimeout(() => {
        window.location.href = url;
    }, 500); // tiempo de carga visual
}
