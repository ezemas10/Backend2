
import { Router } from "express"
import { sendEmailHbs } from "../controllers/email.controller.js"

const router = Router()

router.post("/gmail-hbs", sendEmailHbs)

export default router
