import TicketModel from "../models/ticket.models.js"

export class Ticket {
  constructor(code, purchase_datetime, amount, purchaser) {
    this.code = code;
    this.purchase_datetime = purchase_datetime;
    this.amount = amount;
    this.purchaser = purchaser;
  }
}

export class TicketProductManager {  
  async getTicketbyId(id) {
    try
    {
      const ticket=await TicketModel.findOne({_id: id}).lean()

      if (ticket) 
        return {message: "OK" , rdo: ticket}
      else 
        return {message: "ERROR" , rdo: "El ticket no existe"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al obtener el ticket solicitado - " + e.message}
   }
  }

  
  async addTicket(ticket) {
    try {
      const added = await TicketModel.create(ticket)      
      return {message: "OK" , rdo: added._id}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al agregar el ticket." + e.message}
    }
  }
}
