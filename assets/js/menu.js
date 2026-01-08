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
    Swal.fire({
        // Usamos el nombre de la página como título principal
        title: nombrePagina, 
        html: '<p style="margin-top:8px;">Redirigiendo...</p>',
        
        // Icono de información, pero en blanco para que resalte
        icon: 'info',
        iconColor: '#ffffff',

        showConfirmButton: false,
        timer: 1500, // Un poco más rápido que el login (1.5 seg) para que sea ágil
        timerProgressBar: true,

        // El mismo fondo gradiente del Login
        background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
        color: '#ffffff',

        // Las mismas animaciones
        showClass: {
            popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster'
        },

        // Personalización de la barra de progreso (blanca semitransparente)
        didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector('.swal2-timer-progress-bar');
            if (b) b.style.backgroundColor = 'rgba(255,255,255,0.5)';
        },

        allowOutsideClick: false
    }).then(() => {
        window.location.href = url;
    });
}
