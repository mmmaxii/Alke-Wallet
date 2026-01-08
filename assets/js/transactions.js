// Clave para el LocalStorage
const CLAVE_HISTORIAL = "wallet_historial";
const ITEMS_POR_PAGINA = 5; 
let paginaActual = 1;

// Datos Iniciales
const movimientosIniciales = [
    { titulo: "Compra en línea", fecha: "12 Dic 2025", monto: -200 },
    { titulo: "Depósito", fecha: "10 Dic 2025", monto: 100 },
    { titulo: "Transferencia recibida", fecha: "08 Dic 2025", monto: 75 },
    { titulo: "Compra en línea", fecha: "05 Dic 2025", monto: -5550 },
    { titulo: "Depósito misma cuenta", fecha: "02 Dic 2025", monto: 10500 },
    { titulo: "Transferencia recibida", fecha: "30 Nov 2025", monto: 7575 },
    { titulo: "Netflix", fecha: "28 Nov 2025", monto: -15 },
    { titulo: "Spotify", fecha: "28 Nov 2025", monto: -10 }
];

// $(document).ready() es la versión jQuery de DOMContentLoaded
$(document).ready(function() {
    cargarMovimientos();
    
    // Botón Volver con jQuery
    $('#btnVolver').click(function(e) {
        e.preventDefault();
        cambiarPagina('menu.html', 'Menú Principal');
    });
});

function cargarMovimientos() {
    let historialGuardado = localStorage.getItem(CLAVE_HISTORIAL);

    if (!historialGuardado) {
        localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(movimientosIniciales));
        historialGuardado = JSON.stringify(movimientosIniciales);
    }

    const movimientos = JSON.parse(historialGuardado);

    // jQuery para manipular el DOM si no hay datos
    if (movimientos.length === 0) {
        $('#listaMovimientos').html('<li class="list-group-item text-center text-muted" style="border:none;">No hay movimientos.</li>');
        $('#paginacion-container').hide(); // Ocultar con jQuery
        return;
    }

    renderizarPagina(movimientos);
}

/* ======================================================
   AQUÍ ESTÁ LA LÓGICA CON JQUERY
   ====================================================== */

function renderizarPagina(movimientos) {
    // 1. Limpiar lista con jQuery (.empty)
    const $contenedor = $('#listaMovimientos');
    $contenedor.empty(); 

    // 2. Lógica matemática (la misma que tenia en la version de js puro)
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;
    const movimientosPagina = movimientos.slice(inicio, fin);

    // 3. Dibujar Items (Usando append de jQuery)
    // Usamos $.each para iterar al estilo jQuery
    $.each(movimientosPagina, function(index, mov) {
        const esPositivo = mov.monto > 0;
        const claseColor = esPositivo ? 'amount-positive' : 'amount-negative';
        const signo = esPositivo ? '+' : ''; 

        const itemHTML = `
            <li class="list-group-item movement-item animate__animated animate__fadeIn">
                <div>
                  <div class="movement-title">${mov.titulo}</div>
                  <small class="text-muted" style="color: #ccc !important;">${mov.fecha}</small>
                </div>
                <div class="movement-amount ${claseColor}">
                  ${signo} $${mov.monto}
                </div>
            </li>
        `;
        
        $contenedor.append(itemHTML);
    });

    actualizarBotonesPaginacion(movimientos.length);
}

function actualizarBotonesPaginacion(totalItems) {
    const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA);
    
    // Mostrar el contenedor (jQuery .css o .show)
    // Usamos .css('display', 'flex') para mantener el diseño flexbox de bootstrap
    $('#paginacion-container').css('display', 'flex');

    // Actualizar texto
    $('#infoPagina').text(`Pág ${paginaActual} de ${totalPaginas}`);

    // Habilitar/Deshabilitar botones con .prop()
    $('#btnAnterior').prop('disabled', paginaActual === 1);
    $('#btnSiguiente').prop('disabled', paginaActual === totalPaginas);

    /* TRUCO JQUERY QUE ENCONTRE
       Primero apagamos (.off) cualquier click previo para que no se dupliquen,
       luego encendemos (.on) el nuevo click. Es mucho más limpio que clonar nodos.
    */

    // --- Botón ANTERIOR ---
    $('#btnAnterior').off('click').on('click', function() {
        if (paginaActual > 1) {
            paginaActual--;
            const historial = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL));
            renderizarPagina(historial);
        }
    });

    // --- Botón SIGUIENTE ---
    $('#btnSiguiente').off('click').on('click', function() {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            const historial = JSON.parse(localStorage.getItem(CLAVE_HISTORIAL));
            renderizarPagina(historial);
        }
    });
}


function cambiarPagina(url, nombrePagina) {
    Swal.fire({
        title: 'Redirigiendo a ' + nombrePagina,
        html: '<p style="margin-top: 10px;">Cargando información...</p>',
        icon: 'info',
        iconColor: '#ffffff',        
        timer: 1500, 
        timerProgressBar: true,
        showConfirmButton: false,
        background: 'linear-gradient(135deg, #3c096c, #7b2cbf)',
        color: '#ffffff',        
        showClass: { popup: 'animate__animated animate__fadeInUp animate__faster' },
        hideClass: { popup: 'animate__animated animate__fadeOut animate__faster' },
        didOpen: () => {
            const b = Swal.getHtmlContainer().querySelector('.swal2-timer-progress-bar');
            if (b) b.style.backgroundColor = 'rgba(255,255,255,0.5)';
        },
        allowOutsideClick: false
    }).then(() => {
        window.location.href = url;
    });
}