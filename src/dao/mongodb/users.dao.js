import usersModel from "./models/users.model.js"

export default class UsersDAO {
  getAll = async () => {
    try {
      return await usersModel.find()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  getUserById = async (id) => {
    try {
      return await usersModel.findById(id)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  getByEmail = async (email) => {
    try {
      return await usersModel.findOne({ email })
    } catch (error) {
      console.log(error)
      return null
    }
  }

  create = async (userData) => {
    try {
      return await usersModel.create(userData)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  update = async (id, data) => {
    try {
      return await usersModel.updateOne({ _id: id }, data)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  delete = async (id) => {
    try {
      return await usersModel.deleteOne({ _id: id })
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
