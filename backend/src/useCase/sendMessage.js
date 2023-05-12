const { Message } = require('../services/message');

class SendMessage {
  //constructor(){}

  async execute (question,answer) {
    const m = new Message();

    if ((question) && (answer)) {
      await m.insertQuestion(question,answer);
      return {
        msg: "Thank you for teaching me",
        status: 202,
        response: [],
      }
    }


    const r = await m.buscarSimilaridadeTexto(question);
   
    if ( r.length === 0) {
     
      return {
        msg: "I don't know how to answer this question, let me know how I should answer it, and ask me again to see if I understand",
        status:200,
        response: [],
      }
    } else {
      return {
        msg: "Data Found",
        status:201,
        response: r
      }
    }
    
  }

}

module.exports = {
  SendMessage
};

//const run = new sendMessage();

//run.execute();

