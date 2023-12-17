const socket = io()

const form = document.getElementById('add-prod')
const btnForm = document.getElementById('btn-form')
const productsContainer = document.getElementById('listadoProductos')

/*Me comunico con el socket para llenar la lista de productos*/
function listProducts(){
  
  socket.on('getAllProducts', products => {
    productsContainer.innerHTML = products.map((prod) => `<div class="product-item">
      <p>Id: ${prod.id}</p>
      <p>Title: ${prod.title}</p>
      <p>Description: ${prod.description}</p>
      <p>Price: ${prod.price}</p>
      <p>Status: ${prod.status}</p>
      <p>Code: ${prod.code}</p>
      <p>Stock: ${prod.stock}</p>
      <button id=${prod.id} class='btn-del'>Eliminar</button>
      </div>`).join('');
      }
  )
}

/*Llamada al socket para agregar un nuevo producto*/
const newProd = e => {
	e.preventDefault();
	const data = new FormData(form);
	const prod = {
		title: data.get('title'),
		description: data.get('description'),
		price: data.get('price'),
		category: data.get('category'),
		code: data.get('code'),
		stock: data.get('stock'),
    status: true,
    thunbnail: ""
	};

  socket.emit('addProd', prod);
  //listProducts()

	form.reset()
};

btnForm.addEventListener('click', newProd)

/*Llamada al socket para eliminar un producto*/
document.addEventListener('click', e => e.target.matches('.btn-del') && delProd(e));
const delProd = async e => socket.emit('delProd', Number(e.target.id))

listProducts()