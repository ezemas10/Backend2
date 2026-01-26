export default class BaseRepository {
  constructor(dao) {
    this.dao = dao
  }

  getAll = async () => {
    if (this.dao.getAll) return await this.dao.getAll()
    if (this.dao.getCarts) return await this.dao.getCarts()
    return null
  }

  getById = async (id) => {
    if (this.dao.getById) return await this.dao.getById(id)
    if (this.dao.getUserById) return await this.dao.getUserById(id)
    if (this.dao.getCartById) return await this.dao.getCartById(id)
    return null
  }

  create = async (data) => {
    if (this.dao.create) return await this.dao.create(data)
    if (this.dao.createCart) return await this.dao.createCart()
    return null
  }

  update = async (id, data) => {
    if (this.dao.update) return await this.dao.update(id, data)
    if (this.dao.updateCart) return await this.dao.updateCart(id, data)
    return null
  }

  delete = async (id) => {
    if (this.dao.delete) return await this.dao.delete(id)
    return null
  }
}
