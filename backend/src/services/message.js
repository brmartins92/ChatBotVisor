const mongoose = require('mongoose');
const Database = require('../dataBase/mongoDb');
const questionSchema = require('../schemas/question');
const Question = mongoose.model('Question', questionSchema);
 
class Message {

  constructor() { }
   
  // Função para conectar ao MongoDB
  async connectToMongoDB() {
    await Database.connect();
  }

  async deleteMessageById(messageId) {
    try {
      await this.connectToMongoDB();
      // Encontre a mensagem com o ID fornecido e remova-a
      await Question.findByIdAndRemove(messageId);
    } catch (error) {
      console.error('Error to delete menssage:', error);
    } finally {
      // Encerre a conexão com o MongoDB
      Database.close();
    }
  }

  async insertQuestion(question, answer) {
    try {
      await this.connectToMongoDB()
      // Crie um novo documento usando o modelo Question
      const novaPergunta = new Question({
        question: question,
        answer: answer
      });

      // Salve o documento no banco de dados
      await novaPergunta.save();
    } catch (error) {
      console.error('"Error while inserting question and answer:', error);
    } finally {
      // Encerre a conexão com o MongoDB
      Database.close();
    }
  }

  async buscarSimilaridadeTexto(termoBusca) {
    try {
      // Conecte-se ao MongoDB
      await this.connectToMongoDB();
      // Acesse a coleção 'questions'
      const collection = mongoose.connection.collection('questions');
      // Execute a consulta de busca por similaridade de texto
      const resultado = await collection.find({
        question: {
          $regex: termoBusca,
          $options: 'i'
        }
      }).toArray();

      return resultado;
    } catch (error) {
      console.error('Error while searching for text similarity:', error);
    } finally {
      // Encerre a conexão com o MongoDB
      Database.close();
    }
  }
  
}

module.exports = {
  Message
};
