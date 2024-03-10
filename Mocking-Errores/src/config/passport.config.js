import passport from "passport";
import local from 'passport-local';
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2"; //Estrategia de Github
import { getVariables } from './config.js';
import { Command } from 'commander';
import UserDTO from "../dtos/user.dto.js";

const LocalStrategy = local.Strategy;

const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'production');
const options = program.parse();
const { userAdmin, passAdmin } = getVariables(options);

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            const rol='Usuario'
            try {
                const user = await userModel.findOne({email: username});
                if(user){
                    return done(null, false);
                }
                const newUser = new UserDTO({first_name,last_name,email,age,password,rol})

                const result = await userModel.create(newUser);
                return done(null, result);
            } catch (error) {
                return done('Error to obtain the user ' + error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async (username, password, done) => {
            try {
                let user

                if(username===userAdmin)
                {
                  if (password===passAdmin)
                    user = {_id: 'admin_id', first_name: "Coder", last_name: "Admin", email: username, age:0, password: createHash(password), rol:"Admin"}
                  else
                    return done(null, false)
                }
                else
                {
                    user = await userModel.findOne({email: username});
                    if(!user){
                        return done(null, false);
                    }
                    if(!isValidPassword(user, password)){
                        return done(null, false);
                    }
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));


    passport.use('github', new GithubStrategy (
        //Credenciales para el Github
        {
        clientID:'Iv1.3a2893ef48dada05',
        callbackURL:'http://localhost:8080/api/session/githubcallback',
        clientSecret: 'c1ad158620ea774e99256def16dd589a40d846a7'
        },
        async (accessToken, refreshToken, profile, done) =>{
            try{
                const user = await userModel.findOne({email: profile._json.email});
                if (!user)
                {
                    const newUser= {
                        first_name: profile._json.name.split(' ')[0],
                        last_name:  profile._json.name.split(' ')[1],
                        age: 18,
                        email: profile._json.email,
                        password:' ',
                        rol: 'Usuario'
                    }
                    const result = await userModel.create(newUser);
                    return done(null, result);
                }
                else
                    return done(null, user)
            }
            catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        if (user.email === userAdmin) {
            done(null, 'admin_id');
        } else {
            done(null, user._id);
        }
    });

    passport.deserializeUser(async (id, done) => {
        if (id!='admin_id') {
            const user = await userModel.findOne({_id: id});
            done(null, user);
        }
        else
            done(null, {_id: 'admin_id', first_name: "Coder", last_name: "Admin", email: userAdmin, age:0, password: createHash(passAdmin), rol:"Admin"});
    });
}

export default initializePassport;