import dotenv from 'dotenv';

export const getVariables = (options) => {
    const enviroment = options.opts().mode;

    dotenv.config({
        path: enviroment === 'production' ? './.env.production' : './.env.development'
    });

    return {
        port: process.env.PORT,
        mongoUrl: process.env.MONGOURL,
        tockenSecret: process.env.TOCKENSECRET,
        userAdmin: process.env.USEADMIN,
        passAdmin: process.env.PASSADMIN
    }
}