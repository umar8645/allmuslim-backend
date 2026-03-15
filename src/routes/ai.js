import express from "express"
import { islamicChat } from "../services/islamicChat.js"

const router = express.Router()

router.post("/chat", islamicChat)

export default router