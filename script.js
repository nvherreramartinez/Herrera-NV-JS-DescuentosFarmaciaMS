let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetch('productos.json')
        .then(response => response.json())
        .then(products => {
            renderProducts(products);
            updateCart();
            updateCartCount();
        })
        .catch(error => console.error("Error al cargar productos:", error));
});

function renderProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}" style="width: 100px; height: 100px;">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p><strong>${product.presentacion}</strong></p>
            <p>Stock: <span id="stock-${product.id}">${product.stock}</span></p>
            <p>Precio: ${product.precioOferta !== null ? `
                <span style="color: red;">${product.precioOferta} $</span> <s>${product.precioNormal} $</s>` : 
                `${product.precioNormal} $`}</p>
            <input type="number" id="cantidad-${product.id}" value="1" min="1" max="${product.stock}" />
            <button style="background-color: #0b80b6"${product.stock === 0 ? 'disabled' : ''} onclick="addToCart(${product.id})">
                ${product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
        `;
        productList.appendChild(productDiv);
    });
}

function addToCart(productId) {
    fetch('productos.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            const quantityInput = document.getElementById(`cantidad-${productId}`);
            const quantity = parseInt(quantityInput.value);
            const stockElement = document.getElementById(`stock-${productId}`);
            const currentStock = parseInt(stockElement.textContent);

            if (quantity > currentStock) {
                mostrarAlerta("error", "Cantidad insuficiente", `No puedes agregar más de ${currentStock} unidades.`);
                return;
            }

            stockElement.textContent = currentStock - quantity;

            const existingProduct = cart.find(p => p.id === productId);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({ ...product, quantity });
            }

            mostrarToast(`${product.name} agregado al carrito (${quantity} unidades).`, "success");
            updateCart();
            updateCartCount();
            saveCart();
        });
}

function removeFromCart(productId) {
    const productIndex = cart.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        const product = cart[productIndex];
        const stockElement = document.getElementById(`stock-${product.id}`);
        stockElement.textContent = parseInt(stockElement.textContent) + product.quantity;

        cart.splice(productIndex, 1);
        updateCart();
        updateCartCount();
        saveCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = "";

    let total = 0;
    cart.forEach(product => {
        const productPrice = product.precioOferta || product.precioNormal;
        const subtotal = productPrice * product.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            ${product.name} (x${product.quantity}) - Subtotal: ${subtotal.toFixed(2)} $
            <button onclick="removeFromCart(${product.id})">Eliminar</button>
        `;
        cartItems.appendChild(li);
        total += subtotal;
    });

    cartTotal.textContent = total.toFixed(2);
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    cartCountElement.textContent = totalItems;
}

function mostrarAlerta(tipo, titulo, mensaje) {
    Swal.fire({
        icon: tipo,
        title: titulo,
        text: mensaje,
    });
}

function mostrarToast(mensaje, tipo = "success") {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: tipo === "success"
                ? "linear-gradient(to right, #97eaf0, #1ee0d6)"
                : "linear-gradient(to right, #f5576c, #f093fb)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem",
        },
        onClick: function () { }
    }).showToast();
}

document.getElementById("checkout").addEventListener("click", () => {
    if (cart.length === 0) {
        mostrarAlerta(
            "error",
            "Carrito vacío",
            "No puedes finalizar la compra sin productos en el carrito."
        );
        return;
    }
    generarFormulario();
});

function generarFormulario() {
    const mainElement = document.querySelector("main"); 
    mainElement.innerHTML = `
        <section id="checkout-form" class="checkout-form">
            <h2>Datos de Envío</h2>
            <form id="order-form">
                <label for="name">Nombre Completo:</label>
                <input type="text" id="name" name="name" required>
                
                <label for="address">Dirección:</label>
                <input type="text" id="address" name="address" required>
                
                <label for="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" required>
                
                <label for="email-confirm">Confirmar Correo Electrónico:</label>
                <input type="email" id="email-confirm" name="email-confirm" required>
                
                <button type="submit" class="btn-confirmar">Confirmar Compra</button>
                <button type="button" id="cancelar" class="btn-cancelar">Cancelar Compra</button>
            </form>
        </section>
    `;

    document.getElementById("order-form").addEventListener("submit", confirmarCompra);
    document.getElementById("cancelar").addEventListener("click", cancelarCompra);
}

function confirmarCompra(event) {
    event.preventDefault(); 

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const emailConfirm = document.getElementById("email-confirm").value;

    if (email !== emailConfirm) {
        mostrarAlerta("error", "Error de validación", "Los correos electrónicos no coinciden.");
        return;
    }

    Swal.fire({
        icon: "success",
        title: "¡Compra realizada!",
        text: `Gracias por tu compra, ${name}. Enviaremos los productos a: ${address}.`,
    }).then(() => {

        cart = [];
        saveCart();
        location.reload();
    });
}

function cancelarCompra() {
    cart = [];
    saveCart();

    Swal.fire({
        icon: "info",
        title: "Compra cancelada",
        text: "El carrito ha sido vaciado y la compra fue cancelada.",
    }).then(() => {
        location.reload(); 
    });
}