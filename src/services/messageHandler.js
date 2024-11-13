import whatsappService from './whatsappService.js';

class MessageHandler {
  async handleIncomingMessage(message, senderInfo) {
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim()

      if (this.isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(message.from, message.id, senderInfo)
        await this.sendWelcomeMenu(message.from)
      } else {
        const response = `Echo: ${message.text.body}`;
        await whatsappService.sendMessage(message.from, response, message.id);
      }
      await whatsappService.markAsRead(message.id);
    }
  }

  isGreeting(message){
    const greetings = ["hola", "hello", "buenas"]
    return greetings.includes(message)
  }

  getSenderName(senderInfo){
    return senderInfo.profile?.name || senderInfo.wa_id
  }

  async sendWelcomeMessage(to, messageId, senderInfo) {
    const name = this.getSenderName(senderInfo)
    const welcomeMessage = `Hola ${name}, bienvenido a nuestro servicio de Veterinario Online. " + "¿En qué te puedo ayudar?`
    await whatsappService.sendMessage(to, welcomeMessage, messageId)
  }

  async sendWelcomeMenu(to){
    const menuMessage = "Elige una opción"
    const buttons = [
      {
        type: "reply", reply: { id: "option_1", title: "Agendar", }
      },
      {
        type: "reply", reply: { id: "option_2", title: "Consultar", }
      },
      {
        type: "reply", reply: { id: "option_3", title: "Ubicación", }
      },
    ]

    await whatsappService.sendInteractiveButtons(to, menuMessage, buttons)
  }
}

export default new MessageHandler();