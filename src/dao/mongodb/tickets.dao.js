import ticketModel from "./models/ticket.model.js"

export default class TicketsDAO {
  getAll = async () => {
    return await ticketModel.find()
  }


  getById = async (id) => {
    return await ticketModel.findById(id)
  }


  create = async (data) => {
    return await ticketModel.create(data)
  }
  
}
