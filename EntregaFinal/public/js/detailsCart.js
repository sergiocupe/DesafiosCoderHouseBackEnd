let apiUrl = ''
fetch('/env')
  .then(response => response.json())
  .then(envVariables => {
    // Utiliza las variables de entorno recibidas
    apiUrl=envVariables.apiUrl
    // Etc.
  })
  .catch(error => console.error('Error fetching environment variables:', error));
  

const viewCartBtn=document.getElementById("okCartBtn")

viewCartBtn.addEventListener("click", async (e)=>{

  if (sessionStorage.getItem("cart")){
    const result = await fetch(`${apiUrl}/api/carts/${sessionStorage.getItem("cart")}/purchase`,
    {
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      }
    })

    const resultado = await result.json()

    if (resultado.message==="OK")
    {
      Swal.fire({
        icon: "success",
        text: resultado.rdo,
        confirmButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href='/products'
        }
      });
    }
    else
    {
      Swal.fire({
        icon: "error",
        text: resultado.error,
        timer: 1500
      })
    }
  }

})