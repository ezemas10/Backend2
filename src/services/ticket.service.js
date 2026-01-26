import { ticketRepository } from "../repositories/ticket.repository.js"

import CustomError from "../utils/custom-error.js"

class TicketService {
  constructor(repository) {
    this.repository = repository
  }


  getAll = async () => {
    return await this.repository.getAll()
  }


  getById = async (id) => {
    const ticket = await this.repository.getById(id)
    if (!ticket) throw new CustomError("ticket not found", 404)
    return ticket
  }

  
  create = async (body) => {
    const ticket = await this.repository.create(body)
    if (!ticket) throw new CustomError("error create ticket", 400)
    return ticket
  }
}

export const ticketService = new TicketService(ticketRepository)
