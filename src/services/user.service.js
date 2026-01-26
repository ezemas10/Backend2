import { userRepository } from "../repositories/user.repository.js"
import CustomError from "../utils/custom-error.js"

class UserService {
  constructor(repository) {
    this.repository = repository
  }

  getAll = async () => {
    return await this.repository.getAll()
  }

  getUserById = async (id) => {
    const user = await this.repository.getUserById(id)
    if (!user) {
      throw new CustomError("Usuario not found", 404)
    }
    return user
  }

  getByEmail = async (email) => {
    return await this.repository.getByEmail(email)
  }

  create = async (body) => {
    const user = await this.repository.create(body)
    if (!user) {
      throw new CustomError("Error al crear usuario", 400)
    }
    return user
  }

  update = async (id, body) => {
    const updated = await this.repository.update(id, body)
    if (!updated) {
      throw new CustomError("Error al actualizar usuario", 400)
    }
    return updated
  }

  delete = async (id) => {
    const deleted = await this.repository.delete(id)
    if (!deleted) {
      throw new CustomError("Error al borrar usuario", 400)
    }
    return deleted
  }

  addOrderToUser = async (userId, orderId) => {
    const updatedUser = await this.repository.addOrderToUser(userId, orderId)
    if (!updatedUser) {
      throw new CustomError("Error agregando order al usuario", 400)
    }
    return updatedUser
  }
}

export const userService = new UserService(userRepository)
