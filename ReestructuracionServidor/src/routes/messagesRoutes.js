import { Router } from "express"
import { getMessage, postMessage, deleteMessage } from "../controllers/message.controller.js"

const messageRouter = Router()

messageRouter.get("/", getMessage)

messageRouter.post('/', postMessage)

messageRouter.delete('/:mId',deleteMessage)

export default messageRouter