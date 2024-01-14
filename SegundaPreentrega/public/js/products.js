
// Función para construir la URL y redireccionar
const redirectToPageView = (pId) => {
  const url = "/product?pId=" + pId
  document.location.href = url;
};

document.addEventListener('DOMContentLoaded', () => {
  let btnsProd = document.querySelectorAll('.btnProd');

    // Agrega un listener a cada botón
    btnsProd.forEach(btnProd => {
      btnProd.addEventListener('click', async (event) => {
            event.preventDefault();
            redirectToPageView(event.target.id)
        })
      })
})

