import dotenv from 'dotenv'

export const getVariables = (options) => {
    const enviroment = options.opts().mode

    dotenv.config({
        path: enviroment === 'production' ? './.env.production' : './.env.development'
    })

    return {
        port: process.env.PORT,
        mongoUrl: process.env.MONGOURL,
        tockenSecret: process.env.TOCKENSECRET,
        userAdmin: process.env.USEADMIN,
        passAdmin: process.env.PASSADMIN,
        modoLogger: process.env.MODO_LOGGER,
        webUrl: process.env.WEB_URL,
        mailing:{
            USER: process.env.MAILING_USER,
            SERVICE: process.env.MAILING_SERVER,
            PASSWORD: process.env.MAILING_PASSWORD
        }
    }
}