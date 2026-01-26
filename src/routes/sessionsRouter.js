import express from "express"
import { passportCall } from "../middlewares/passportAuth.js"
import { userService } from "../services/user.service.js"
import UsersDTO from "../dto/users.dto.js"
import { forgotPassword, resetPassword } from "../controllers/userController.js"

const router = express.Router()

router.get("/current", passportCall("jwt"), async (req, res) => {

    try {
    const user = await userService.getUserById(req.user.id)
    const userDTO = new UsersDTO(user)

    return res.send({
      payload: userDTO,
    })
  }

  catch (error) {

    console.log(error)
    return res.status(500).send("Internal Server Error")

  }
})


router.get("/reset-password/:token", (req, res) => {

  const { token } = req.params

  return res.send(`
    <h2>Reset password</h2>
    <form method="POST" action="/api/sessions/reset-password/${token}">
      <input type="password" name="password" placeholder="Nuevo password" required />
      <button type="submit">Cambiar password</button>
    </form>
  `)

})


router.post("/forgot-password", async (req, res) => {
  return forgotPassword(req, res)
})


router.post("/reset-password/:token", async (req, res) => {
  return resetPassword(req, res)
})


export default router
