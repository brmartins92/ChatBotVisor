const { Message } = require('../services/message');

class DeleteMessage {
  //constructor(){}

  async execute (messageId) {
    const m = new Message();

      await m.deleteMessageById(messageId);
      return {
        msg: "Delete Question",
        status: 200,
        response: [],
      }
  }
}

module.exports = {
  DeleteMessage
};