const productsContainer = document.getElementById('listadoProductos');

async function getProducts() {
    const url = `http://localhost:8080/api/products?limit=100`;
    const requestOptions = {
        method: "GET",
    };

    await fetch(url, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo cargar los productos");
            }
            return response.json();
        })
        .then((data) => {

          console.log(data)
            let content = "";
            content += data.map((prod) => `<div class="product-item">
            <p>Id: ${prod.id}</p>
            <p>Title: ${prod.title}</p>
            <p>Description: ${prod.description}</p>
            <p>Price: ${prod.price}</p>
            <p>Status: ${prod.status}</p>
            <p>Code: ${prod.code}</p>
            <p>Stock: ${prod.stock}</p>
            </div>`).join('');
            productsContainer.innerHTML = content;
        })
        .catch((error) => {
            console.error(error);
        });
}


getProducts();

