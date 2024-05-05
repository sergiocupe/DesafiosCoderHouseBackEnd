const logoutBtn=document.getElementById("logoutBtn")
const viewCartBtn=document.getElementById("viewCartBtn")

logoutBtn.addEventListener("click", async (e)=>{
  const result = await fetch("http://localhost:8080/api/session/logout",
  {
    method: "post",
    headers:{
      "Content-Type":"application/json"
    }
  })

  const {url} = await result
  window.location.href=url
  
})

viewCartBtn.addEventListener("click", async (e)=>{
  if (sessionStorage.getItem("cart"))
    window.location.href='http://localhost:8080/carts/' + sessionStorage.getItem("cart") 
})

// Función para construir la URL y redireccionar
const redirectToPageView = (pId) => {
  const url = "/product?pId=" + pId
  document.location.href = url
}

document.addEventListener('DOMContentLoaded', () => {
  let btnsProd = document.querySelectorAll('.btnProd')

    // Agrega un listener a cada botón
    btnsProd.forEach(btnProd => {
      btnProd.addEventListener('click', async (event) => {
            event.preventDefault()
            redirectToPageView(event.target.id)
        })
      })
})

