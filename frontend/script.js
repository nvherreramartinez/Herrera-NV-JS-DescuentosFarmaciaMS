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
        new ProductoFarmacia(1, "./public/amoxidal.jpg", "Amoxidal", "Antibióticos", "Amoxicilina", "500mg", 5080, 3100, 50),
        new ProductoFarmacia(2, "./public/novalgina.jpg", "Novalgina", "Antifebriles", "Dipirona sódica", "50mg/ml", 8699, null, 12),
        new ProductoFarmacia(3, "./public/actron.jpg", "Actron", "Analgésicos", "Ibuprofeno", "600mg", 6599, 4669, 38),
        new ProductoFarmacia(4, "./public/tafirol.jpg", "Tafirol", "Analgésicos", "Paracetamol", "500mg", 2560, null, 76),
        new ProductoFarmacia(5, "./public/dipirona-klonal.jpg", "Dipirona Klonal", "Antifebriles", "Dipirona", "250mg", 2899, null, 5),
        new ProductoFarmacia(6, "./public/azibiotic.png", "Azibiotic", "Antibióticos", "Azitromicina", "500mg", 14599, 7000, 12),
        new ProductoFarmacia(7, "./public/rivotril.jpg", "Rivotril", "Benzodiacepinas", "Clonazepam", "0.5mg", 20599, null, 2),
        new ProductoFarmacia(8, "./public/tensium.jpg", "Tensium", "Benzodiacepinas", "Alprazolam", "2mg", 34599, 19000, 1),
    ];

    const container = document.getElementById('product-cards');
    const form = document.createElement('form');
    form.className = 'form';
    form.innerHTML = `
        <label for="medicamento" class="form-label">Seleccionar Medicamento:</label>
        <select id="medicamento" class="form-select">
        ${productos.map(product => `<option value="${product.id}">${product.nombre} (${product.presentacion})</option>`).join('')}
        </select>
        <label for="cantidad" class="form-label mt-3">Cantidad:</label>
        <input type="number" id="cantidad" class="form-control" min="1" value="1">
        <button type="button" id="agregar-carrito" class="btn btn-primary mt-3">Agregar al Carrito</button>
    `;
    document.getElementById('form-container').appendChild(form);

    productos.forEach((producto) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src = "${producto.img}"/>
            <h3>${producto.nombre}</h3>
            <h5>(${producto.categoria})</h5>
            <p>Principio Activo: ${producto.principioActivo} ${producto.presentacion}</></p>
            <h5>Stock disponible: ${producto.stock}</h5>
            <p class="price">
                Precio: ${producto.precioOferta ? `<span class="discounted-price">$${producto.precioNormal}</span> $${producto.precioOferta}`
                : `$${producto.precioNormal}`
            }
            </p>
        `;
        container.appendChild(card);
    });
    document.getElementById('agregar-carrito').addEventListener('click', () => {
        const medicamentoId = parseInt(
            document.getElementById('medicamento').value
        );
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const productoSeleccionado = productos.find(
            (product) => product.id === medicamentoId
        );
        if (cantidad > productoSeleccionado.stock) {
            alert(
                `No hay suficiente stock para ${productoSeleccionado.nombre}. Stock disponible: ${productoSeleccionado.stock}`
            );
        } else {
            alert(
                `Producto agregado: ${productoSeleccionado.nombre}\nCantidad: ${cantidad}`
            );
        }
    });
});
