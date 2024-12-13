document.addEventListener('DOMContentLoaded', () => {
    class ProductoFarmacia {
        constructor(id, img, nombre, categoria, principioActivo, presentacion, precioNormal, precioOferta = null, stock) {
            this.id = id;
            this.img = img;
            this.nombre = nombre;
            this.categoria = categoria;
            this.presentacion = presentacion;
            this.principioActivo = principioActivo;
            this.precioNormal = precioNormal;
            this.precioOferta = precioOferta;
            this.stock = stock;
        }
    }
    const productos = [
        new ProductoFarmacia(1, "./public/amoxidal.jpg", "Amoxidal", "Antibióticos", "Amoxicilina", "500mg", 5080, 3100, 30),
        new ProductoFarmacia(2, "./public/novalgina.jpg", "Novalgina", "Antifebriles", "Dipirona sódica", "50mg/ml", 8699, null, 12),
        new ProductoFarmacia(3, "./public/actron.jpg", "Actron", "Analgésicos", "Ibuprofeno", "600mg", 6599, 4669, 18),
        new ProductoFarmacia(4, "./public/tafirol.jpg", "Tafirol", "Analgésicos", "Paracetamol", "500mg", 2560, null, 26),
        new ProductoFarmacia(5, "./public/dipirona-klonal.jpg", "Dipirona Klonal", "Antifebriles", "Dipirona", "250mg", 2899, null, 5),
        new ProductoFarmacia(6, "./public/azibiotic.png", "Azibiotic", "Antibióticos", "Azitromicina", "500mg", 14599, 7000, 12),
        new ProductoFarmacia(7, "./public/rivotril.jpg", "Rivotril", "Benzodiacepinas", "Clonazepam", "0.5mg", 20599, null, 2),
        new ProductoFarmacia(8, "./public/tensium.jpg", "Tensium", "Benzodiacepinas", "Alprazolam", "2mg", 34599, 19000, 1),
        new ProductoFarmacia(9, "./public/fabogesic.jpg", "Fabogesic", "Analgésicos", "Ibuprofeno", "400mg", 2499, null, 20),
        new ProductoFarmacia(10, "./public/aziatop.jpg", "Aziatop", "Inhibidores", "Omeoprazol", "20mg", 1459, null, 8),
    ];

    const container = document.getElementById('product-cards');
    const carrito = [];
    renderProductos(productos);
    
    function filtrarProductos(categoria) {
        return categoria === '' || categoria === 'todos'
            ? productos
            : productos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    }
    function renderProductos(productosFiltrados) {
        container.innerHTML = '';
        productosFiltrados.forEach(({id, img, nombre, categoria, principioActivo, presentacion, precioNormal, precioOferta, stock }) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
            <img src="${img}" alt="${nombre}"/>
            <h3>${nombre}</h3>
            <h5>(${categoria})</h5>
            <p>Principio Activo: ${principioActivo} ${presentacion}</p>
            <h5>Stock disponible: ${stock}</h5>
            <p class="price">
                Precio: ${precioOferta ? `<span class="discounted-price">$${precioNormal}</span> $${precioOferta}` : `$${precioNormal}`}
            </p>
            <label for="cantidad-${id}">Cantidad:</label>
            <input type="number" id="cantidad-${id}" class="cantidad" 
                min="1" max="${stock}" value="1" ${stock === 0 ? 'disabled' : ''}>
            <button class="btn btn-primary agregar-carrito" data-id="${id}">Agregar al Carrito</button>
        `;
            container.appendChild(card);
        });
    }
    
    const botonesCategorias = document.querySelectorAll('.boton-categoria');
    botonesCategorias.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoria = boton.id;
            botonesCategorias.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');
            if (categoria === 'todos') {
                renderProductos(productos);
            } else {
                const productosFiltrados = productos.filter(producto => producto.categoria.toLowerCase() === categoria);
                renderProductos(productosFiltrados);
            }
        });
    });

    const selectCategorias = document.getElementById('category-filter');
    selectCategorias.addEventListener('change', () => {
        const categoriaSeleccionada = selectCategorias.value;
        const productosFiltrados = filtrarProductos(categoriaSeleccionada);
        renderProductos(productosFiltrados);
    });

    function agregarProductoAlCarrito(e) {
        const productId = parseInt(e.target.dataset.id);
        const cantidadInput = document.getElementById(`cantidad-${id}`);
        const cantidad = parseInt(cantidadInput.value);
        if (cantidad > 0) {
            const producto = productos.find(p => p.id === productId);
            if (producto.stock >= cantidad) {
                const productoEnCarrito = carrito.find(item => item.id === productId);
                if (productoEnCarrito) {
                    productoEnCarrito.cantidad += cantidad;
                } else {
                    carrito.push({ ...producto, cantidad });
                }        
                producto.stock -= cantidad;
                cantidadInput.max = producto.stock;
                cantidadInput.value = Math.min(cantidad, producto.stock);
                guardarCarrito();
                mostrarToast(`${producto.nombre} agregado al carrito (${cantidad} unidades).`, 'success');
            } else {
                mostrarToast(`Stock insuficiente para ${producto.nombre}.`, 'error');
            }
        }
    }
    
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('agregar-carrito')) {
            agregarProductoAlCarrito(e);  
        }
        cargarCarrito();
    });

    function renderCarrito() {
        const carritoContainer = document.querySelector('.carrito-container');
        const carritoIcon = document.querySelector('.carrito');
        const numerito = document.querySelector("#numerito");

        if (carrito.length === 0) {
            carritoContainer.innerHTML = '';
            return; 
        }
        const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        let carritoContent = `<span class="badge bg-danger rounded-pill">${totalCantidad}</span>`;
        carritoContent += carrito.map(item => `<p class="carrito-item">${item.nombre} (${item.cantidad})</p>`).join('');
        carritoContainer.innerHTML = carritoContent;
        carritoIcon.style.display = 'block';
    }
    function mostrarToast(mensaje, tipo = 'success') {
        Toastify({
            text: mensaje,
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: {
                background: tipo === 'success' 
                    ? "linear-gradient(to right, #97eaf0, #1ee0d6)" 
                    : "linear-gradient(to right,rgb(230, 40, 224),rgb(233, 126, 245))",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            },
        }).showToast();
    }
    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
    function actualizarNumerito() {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.innerText = nuevoNumerito;
    }
    function cargarCarrito() {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(...carritoGuardado);
        renderCarrito();
    }
    actualizarNumerito();
    document.getElementById('finalizar-compra').addEventListener('click', () => {
        Swal.fire({
            title: 'Compra realizada!',
            text: '¡Gracias por tu compra! Recibirás un email con los detalles.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
        renderCarrito();
    });
});