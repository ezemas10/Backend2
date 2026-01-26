import BaseRepository from "./base-repository.js"

import TicketsDAO from "../dao/mongodb/tickets.dao.js"


const ticketsDao = new TicketsDAO()


class TicketRepository extends BaseRepository {
  
    constructor(dao) { super(dao) }

  getById = async (id) => {
    return await this.dao.getById(id)
  }

}


export const ticketRepository = new TicketRepository(ticketsDao)
