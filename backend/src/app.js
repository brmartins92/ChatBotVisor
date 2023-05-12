const express = require('express');
const cors = require('cors');
const app = express();

const { SendMessage } = require('./useCase/sendMessage');
const { DeleteMessage } = require('./useCase/deleteMessage');

app.use(express.json());
app.use(cors());

app.post('/message/create', async (req,res) =>  {
  const { question, answer } = req.body;
  const sendMessage = new SendMessage();
  const r = await sendMessage.execute(question,answer);
  
  res.status(r.status).json({
    msg: r.msg,
    status: r.status,
    response: r.response[0]
  })
});

app.delete('/message/delete/:id', async(req,res) => {
  
  const { id } = req.params;
  const deleteMessage = new DeleteMessage();
  
  await deleteMessage.execute(id);
  
  res.status(200).json({
    msg: "thanks for correcting me",
    status: 200,
  })

});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado na porta ${PORT}`);
});