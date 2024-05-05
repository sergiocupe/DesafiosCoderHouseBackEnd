const viewCartBtn=document.getElementById("okCartBtn")

viewCartBtn.addEventListener("click", async (e)=>{

  if (sessionStorage.getItem("cart")){
    const result = await fetch('http://localhost:8080/api/carts/' + sessionStorage.getItem("cart") + "/purchase",
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