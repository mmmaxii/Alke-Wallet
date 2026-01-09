# 💰 Alke Wallet

Este proyecto consiste en el desarrollo de una billetera digital (E-Wallet) segura y funcional, diseñada con un enfoque _Mobile-First_. Permite a los usuarios gestionar sus activos financieros, realizar transferencias simuladas, depositar dinero y visualizar su historial de movimientos.

## 📂 Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

### 📄 Páginas (HTML)

*   **`index.html` (Login)**: Pantalla de inicio de sesión. Contiene el formulario validado para ingresar correo y contraseña.
*   **`pages/menu.html`**: Panel principal (Dashboard). Muestra el saldo actual y ofrece botones de acceso rápido a las funcionalidades principales.
*   **`pages/deposit.html`**: Pantalla para simular depósitos de dinero a la cuenta.
*   **`pages/sendmoney.html`**: Pantalla de envío de dinero. Permite gestionar contactos y realizar transferencias.
*   **`pages/transactions.html`**: Historial de movimientos. Muestra una lista paginada de todas las transacciones realizadas.

---

### 🎨 Estilos (CSS) and Librerías

Se utiliza **Bootstrap 4** para la maquetación responsiva y archivos CSS personalizados para el diseño "Glassmorphism" (Efecto vidrio).
Las alertas y notificaciones están manejadas por **SweetAlert2**.
Se incluye **jQuery** para funcionalidades específicas de filtrado y manipulación del DOM.

---

### ⚙️ Funcionalidad (JavaScript)

Aquí se describen brevemente las funciones principales de cada archivo JS:

#### `assets/js/index.js` (Lógica del Login)
*   **`extraerDatos()`**: Obtiene los valores del formulario de login.
*   **`validarEmail(email)`** y **`validarPassword(password)`**: Verifican que el formato del correo y la longitud de la contraseña sean correctos.
*   **`cambiarPagina(url)`**: Maneja la redirección al menú principal con una animación de carga simulada.

#### `assets/js/menu.js` (Lógica del Menú)
*   **`cambiarPagina(url, nombrePagina)`**: Función reutilizable para navegar entre secciones con transiciones animadas.
*   *Lógica de Saldo*: Al cargar, lee el `localStorage` para mostrar el balance actualizado.

#### `assets/js/deposit.js` (Lógica de Depósitos)
*   **Evento Click (Depositar)**: Valida que el monto sea positivo, actualiza el saldo en `localStorage` y muestra una confirmación.
*   **`registrarDeposito(monto)`**: Crea un objeto de transacción con fecha actual y lo guarda en el historial.

#### `assets/js/sendmoney.js` (Lógica de Envíos)
*   **`configurarBotones()`**: Asigna eventos a los botones de "Agregar Contacto" y "Volver".
*   **`cargarContactos()`**: Lee la lista de contactos guardada. Si no existe, crea una por defecto.
*   **`renderizarLista(contactos)`**: Dibuja dinámicamente la lista de contactos en el HTML.
*   **`agregarContactoNuevo()`**: Muestra un popup (SweetAlert) para ingresar datos de un nuevo contacto y lo guarda.
*   **`activarBusquedaContacto()` (jQuery)**: Filtra la lista de contactos en tiempo real mientras el usuario escribe, priorizando coincidencias por Nombre, luego Alias y finalmente CBU.
*   **`activarBotonesAccion()`**: Maneja la lógica de eliminar contactos y de transferir dinero (validando saldo suficiente).

#### `assets/js/transactions.js` (Lógica del Historial)
*   **`cargarMovimientos()`**: Obtiene el historial de transacciones. Si está vacío, muestra un mensaje indicándolo.
*   **`renderizarPagina(movimientos)` (jQuery)**: Muestra una porción de las transacciones (paginación) y actualiza el DOM.
*   **`actualizarBotonesPaginacion(totalItems)`**: Calcula cuántas páginas son necesarias y habilita/deshabilita los botones de "Anterior" y "Siguiente".

---

## 🚀 Cómo probar el proyecto

1.  Abre el archivo `index.html` en tu navegador.
2.  Ingresa un correo válido (con @) y una contraseña de al menos 8 caracteres.
3.  Usa el menú para navegar:
    *   Prueba **Depositar** dinero para ver subir tu saldo.
    *   Ve a **Enviar Dinero**, prueba el **buscador de contactos** y realiza una transferencia.
    *   Revisa en **Últimos Movimientos** que tus acciones hayan quedado registradas.
