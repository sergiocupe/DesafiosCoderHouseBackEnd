export const idErrorInfo = (clave,pId) => {
    return `El ${clave} con el id ${pId} no existe en la base de datos`;
}

export const postProductErrorInfo = (prod) => {
    return `Una o mas propiedades son invalidas:
    title: Debe ser un string, se recibió ${typeof prod.title}
    description: Debe ser un string, se recibió ${typeof prod.description}
    price: Debe ser un number, se recibió ${typeof prod.price}
    code: Debe ser un string, se recibió ${typeof prod.code}
    stock: Debe ser un number, se recibió ${typeof prod.stock}
    status: Debe ser un boolean, se recibió ${typeof prod.status}
    category: Debe ser un string, se recibió ${typeof prod.category}
    thunbnail: Debe ser un array, se recibió ${typeof prod.thunbnail}`
}

export const postCartErrorInfo = () => {
    return `No se pudo actualizar el carrito en la base de datos`
}

export const productsNotFound = () => {
    return 'No se pudieron recuperar los productos';
}

export const cartsNotFound = () => {
    return 'No se pudieron recuperar los carritos';
}