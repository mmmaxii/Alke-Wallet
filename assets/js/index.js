/*Este es un comentario para ver como funciona los branch's en git*/
const form = document.getElementById("login-form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    /*Desenpaquetamos el email password y el check para posibles actualizaciones*/
    const { email, password, rememberMe } = extraerDatos();

    /*Validamos email y password*/
    const emailValido = validarEmail(email);
    const passwordValido = validarPassword(password);

    if (!emailValido) {
        alert("El email ingresado no es válido. Por favor, ingresa un email con formato correcto.");
        return;
    }
    if (!passwordValido) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    let dineroGuardado = localStorage.getItem("Balance");

    if (dineroGuardado != null) {
        dineroGuardado = Number(dineroGuardado);
        if (dineroGuardado >= 1000000000) {
            alert("Se ha detectado un saldo guardado de: $" + dineroGuardado + ". Por seguridad, si el saldo es excesivamente alto, se reiniciará el balance.");
            localStorage.setItem("Balance", "0");
        }
    }
    cambiarPagina("pages/menu.html");

});

function extraerDatos() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;
    return { email, password, rememberMe };
}

function validarEmail(email) {
    /* Esto a grandes rasgos es una expresion regular que verifica si el email 
    tiene un formato válido
    
    El formato que buscamos es 
    
    [nombre] + @ + [dominio] + . + TLD respectivo
    Retornato True si es válido, False si no lo es
    */
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validarPassword(password) {
    /*Verifica que solo tenga mas de 8 numeros */
    return password.length >= 8;
}

function cambiarPagina(url) {
    Swal.fire({
        title: '¡Ingreso exitoso!',
        text: 'Redirigiendo a tu billetera...',
        icon: 'success',

        /* Color principal acorde al diseño */
        // confirmButtonColor: '#7b2cbf',

        /* Hace que no se vea tan "alerta" y mas fluido */
        showConfirmButton: false,

        /* Tiempo de espera antes de redirigir */
        timer: 2200,
        timerProgressBar: true,

        /* Estilos personalizados */
        background: '#ffffff',
        color: '#2b2b2b',

        /* Evita que el usuario cierre la alerta manualmente */
        allowOutsideClick: false,
        allowEscapeKey: false
    }).then(() => {
        window.location.href = url;
    });
}

