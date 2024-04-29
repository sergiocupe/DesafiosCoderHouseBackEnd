export const idErrorInfo = (clave,pId) => {
    return `El ${clave} con el id ${pId} no se pudo eliminar`
}

export const postProductErrorInfo = (prod) => {

    if (prod)
        return `Una o mas propiedades son invalidas:
        title: Debe ser un string, se recibió ${typeof prod.title}
        description: Debe ser un string, se recibió ${typeof prod.description}
        price: Debe ser un number, se recibió ${typeof prod.price}
        code: Debe ser un string, se recibió ${typeof prod.code}
        stock: Debe ser un number, se recibió ${typeof prod.stock}
        status: Debe ser un boolean, se recibió ${typeof prod.status}
        category: Debe ser un string, se recibió ${typeof prod.category}
        thunbnail: Debe ser un array, se recibió ${typeof prod.thunbnail}`
    else
        return `El producto que quiere dar de alta contiene errores.` 
}

export const postCartErrorInfo = () => {
    return `No se pudo actualizar el carrito en la base de datos`
}

export const productsNotFound = () => {
    return 'No se pudieron recuperar los productos'
}

export const postChangeRolUser = () => {
    return 'No se pudo cambiar el rol del usuario'
}

export const postChangeLastLogin = () => {
    return 'No se pudo actualizar la fecha de login del usuario'
}

export const cartsNotFound = () => {
    return 'No se pudieron recuperar los carritos'
}

export const recoveryPassFaild = () => {
    return 'No se pudo recuperar el usuario de la base, no se puede recuperar la contraseña'
}

export const passwordRepet = () => {
    return 'La contraseña no puede ser igual a la actual'
}

export const postAddDocumentsUser = () => {
    return 'No se pudo agregar los documentos al usuarios informado'
}

export const postErrorDocumentsUser = () => {
    return 'No se pudo cambiar el rol del usuario porque falta documentacion'
}
