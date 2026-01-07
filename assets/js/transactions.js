// 1. Clave para el LocalStorage
const CLAVE_HISTORIAL = "wallet_historial";

// 2. Datos Iniciales (Tus datos estáticos pasados a JSON)
// Usamos números negativos para gastos y positivos para ingresos
const movimientosIniciales = [
    { titulo: "Compra en línea", fecha: "12 Dic 2025", monto: -200 },
    { titulo: "Depósito", fecha: "10 Dic 2025", monto: 100 },
    { titulo: "Transferencia recibida", fecha: "08 Dic 2025", monto: 75 },
    { titulo: "Compra en línea", fecha: "05 Dic 2025", monto: -5550 },
    { titulo: "Depósito misma cuenta", fecha: "02 Dic 2025", monto: 10500 },
    { titulo: "Transferencia recibida", fecha: "30 Nov 2025", monto: 7575 }
];

// 3. Cargar al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarMovimientos();
    configurarBotonVolver();
    
});

function configurarBotonVolver() {
    // Botón Volver
    document.getElementById('btnVolver').addEventListener('click', (e) => {
        e.preventDefault();
        cambiarPagina('menu.html', 'Menú Principal');
    });
}



function cargarMovimientos() {
    // Intentamos leer del almacenamiento
    let historialGuardado = localStorage.getItem(CLAVE_HISTORIAL);

    // Si no hay nada, cargamos los iniciales
    if (!historialGuardado) {
        localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(movimientosIniciales));
        historialGuardado = JSON.stringify(movimientosIniciales);
    }

    // Convertimos a objeto real
    const movimientos = JSON.parse(historialGuardado);

    // Dibujamos
    renderizarMovimientos(movimientos);
}

function renderizarMovimientos(movimientos) {
    const contenedor = document.getElementById('listaMovimientos');
    contenedor.innerHTML = ''; // Limpiar lista

    movimientos.forEach((mov) => {
        // LÓGICA VISUAL:
        // Si el monto es mayor a 0, es positivo (Verde). Si no, negativo (Rojo).
        const esPositivo = mov.monto > 0;
        
        // Asignamos la clase CSS correspondiente
        const claseColor = esPositivo ? 'amount-positive' : 'amount-negative';
        
        // Agregamos el signo "+" solo si es positivo (los negativos ya traen el "-")
        const signo = esPositivo ? '+' : ''; 

        const itemHTML = `
            <li class="list-group-item movement-item">
                <div>
                  <div class="movement-title">${mov.titulo}</div>
                  <small class="text-muted">${mov.fecha}</small>
                </div>
                <div class="movement-amount ${claseColor}">
                  ${signo} $${mov.monto}
                </div>
            </li>
        `;

        contenedor.innerHTML += itemHTML;
    });
}



// Reutilizacion
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

