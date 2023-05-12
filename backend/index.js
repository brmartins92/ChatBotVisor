// Importe o módulo do MongoDB

const mongoose = require('mongoose');

// Defina o esquema para a pergunta e resposta
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

// Crie o modelo para a coleção 'questions'
const Question = mongoose.model('Question', questionSchema);

// Função para conectar ao MongoDB
async function connectToMongoDB() {
  try {
    // URL de conexão com o banco de dados MongoDB
    const url = 'mongodb://localhost:27017';

    // Conecte-se ao MongoDB
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}

// Função para inserir uma nova pergunta e resposta
async function insertQuestion(question, answer) {
  try {
    await connectToMongoDB()
    // Crie um novo documento usando o modelo Question
    const novaPergunta = new Question({
      question: question,
      answer: answer
    });

    // Salve o documento no banco de dados
    await novaPergunta.save();
    console.log('Pergunta e resposta inseridas com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir pergunta e resposta:', error);
  } finally {
    // Encerre a conexão com o MongoDB
    mongoose.connection.close();
  }
}

async function buscarSimilaridadeTexto(termoBusca) {
  try {
    // Conecte-se ao MongoDB
    await connectToMongoDB();

    // Acesse a coleção 'questions'
    const collection = mongoose.connection.collection('questions');

    // Execute a consulta de busca por similaridade de texto
    const resultado = await collection.find({
      question: {
        $regex: termoBusca,
        $options: 'i'
      }
    }).toArray();

    // Exiba os resultados da busca
    console.log('Resultados da busca:');
    console.log(resultado);

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar similaridade de texto:', error);
  } finally {
    // Encerre a conexão com o MongoDB
    mongoose.connection.close();
  }
}

let questionWithoutAnswer = '';
// Exemplo de uso
async function start() {
  // Conecte-se ao MongoDB
 // await connectToMongoDB();
  //const question = 'Qual é a capital do Recife ?';
  const question = 'Qual é a capital do Recife?';
  const response = await buscarSimilaridadeTexto(question);

  if (( questionWithoutAnswer ) && ( question ) && ( response.length === 0 )) {
    // Insira uma nova pergunta e resposta
    await insertQuestion(question,questionWithoutAnswer);
    questionWithoutAnswer = '';
    console.log("aprendi a responder");
  }
  
  if (response.length > 0) {
    console.log("encontrado resposta");
    console.log(response);
  }

  if ((response.length === 0) && ( questionWithoutAnswer != '' )) {
    console.log("nao sei responder");
    questionWithoutAnswer = question;
  }

  // Encerre a conexão com o MongoDB
  mongoose.connection.close();
}

// Execute o exemplo
start();



  