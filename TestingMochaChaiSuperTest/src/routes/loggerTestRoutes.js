import express from "express"
import { checkLoggers } from "../controllers/loggertest.controller.js"

const loggerTestRoutes = express.Router()

loggerTestRoutes.get("/", checkLoggers)

export default loggerTestRoutes