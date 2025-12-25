
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
    cambiarPagina("menu.html");

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
        text: 'Redirigiendo...',
        icon: 'success',
        confirmButtonText: 'Genial',
        confirmButtonColor: '#3085d6',
        timer: 2500, // 2.5 segundos demora en entrar.
        timerProgressBar: true //  Muestra una barrita de progreso
    }).then((result) => {
        // ALERTA: Al poner el código aquí directamente sin "if",
        // se ejecutará SIEMPRE, ya sea que el tiempo se acabe 
        // o que el usuario presione el botón.
        window.location.href = url;
    });
}
