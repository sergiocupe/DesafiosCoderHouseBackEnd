
const addProductoCart = async (pId) =>{
  
  try{
    let cartId

    //Si no existe el carrito para la sesion lo creo en primera instancia, para luego poder agregar los items
    //Si existe lo recupero del sessionStorage
    if (!sessionStorage.getItem("cart")) 
    {
      const responseCartCreate = await fetch(`${await obtenerApiUrl()}/api/carts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
      })
      const responseCart = await responseCartCreate.json()

      if (responseCart.message==="OK")
      {
        cartId = responseCart.rdo
        sessionStorage.setItem("cart",cartId)
      }
    }
    else
      cartId = sessionStorage.getItem("cart")

    //Ahora agrego el producto seleccionado al carrito
    const responseCartAddProd = await fetch(`${await obtenerApiUrl()}/api/carts/${cartId}/products/${pId}`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },    
      body:JSON.stringify({"quantity": 1})
    })

    const responseCartProd = await responseCartAddProd.json()

    if (responseCartProd.message==="OK")
    {
      Swal.fire({
        icon: "success",
        text: responseCartProd.rdo,
        timer: 1500
      })
    }
    else
    {
      Swal.fire({
        icon: "error",
        text: responseCartProd.error,
        timer: 1500
      })
    }

  } catch (error) {
    console.error('Hubo un error al realizar la solicitud POST:', error)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let btnsAddCart = document.querySelectorAll('.btnAddCart')

    // Agrega un listener a cada botón
    btnsAddCart.forEach(btnAddCart => {
        btnAddCart.addEventListener('click', async (event) => {
            event.preventDefault()
            addProductoCart(event.target.id)
        })
      })
})


document.getElementsByName('btn-add-cart')[0].addEventListener('click', event => addProductoCart(event.target.id))
