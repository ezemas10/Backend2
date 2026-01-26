import BaseRepository from "./base-repository.js"
import UsersDAO from "../dao/mongodb/users.dao.js"

const usersDao = new UsersDAO()

class UserRepository extends BaseRepository {
  constructor(dao) {
    super(dao)
  }

  getUserById = async (id) => {
    return await this.dao.getUserById(id)
  }

  getByEmail = async (email) => {
    return await this.dao.getByEmail(email)
  }

  update = async (id, data) => {
    return await this.dao.update(id, data)
  }

  delete = async (id) => {
    return await this.dao.delete(id)
  }

  addOrderToUser = async (userId, orderId) => {
    return await this.dao.update(userId, { cart: orderId })
  }
}

export const userRepository = new UserRepository(usersDao)
