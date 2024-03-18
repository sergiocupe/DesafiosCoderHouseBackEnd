import winston from 'winston';
import { getVariables } from '../config/config.js';
import { Command } from 'commander';

const customLevelOptions = {
  levels:{
    debug: 0,
    http: 1,
    info: 2, 
    warning: 3,
    error: 4,
    fatal: 5
  },
  colors:{
    debug: 'white',
    http: 'green',
    info: 'blue', 
    warning: 'yellow',
    error: 'magenta',
    fatal: 'red'
  }
}

const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize({colors: customLevelOptions.colors}),
        winston.format.simple()
        )
    })
  ]
})

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.File({filename:'./erros.log', 
      level: 'info',
      format: winston.format.simple()
    })
  ]
})

export const addLogger = (req,res,next) =>{
  const program = new Command();
  program.option('--mode <mode>', 'Modo de trabajo', 'production');
  const options = program.parse();
  const { modoLogger } = getVariables(options);

  switch(modoLogger){
    case 'development':
      req.logger= devLogger
      break;
    case 'production':
        req.logger= prodLogger
      break;
    default:
      throw new Error('Enviroment no existe')
  }
  next()
}