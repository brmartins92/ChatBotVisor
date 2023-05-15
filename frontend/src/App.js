import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './App.css';

function App() {
  const [questionAbout, setQuestionAbout] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const deleteMessage = async (id) => {
    
    try {
      const response = await axios.delete(`http://localhost:3000/message/delete/${id}`);
      const botResponse = {
        user: 'Bot',
        message: response.data.msg,
        time: getCurrentTime()
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Erro ao remover mensagem:', error);
    }
  };

  const sendMessage = () => {
    const input = document.getElementById('message-input');
    const message = input.value;
    input.value = '';
    if ( message ) {
      const newMessage = {
        user: 'User',
        message: message,
        time: getCurrentTime()
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);

      if (!questionAbout) {
        axios
          .post('http://localhost:3000/message/create', { question: message })
          .then(response => {
            if (response.data.status === 201) {
              const botResponse = {
                user: 'Bot',
                message: response.data.response.answer,
                id: response.data.response._id,
                time: getCurrentTime()
              };
              setMessages(prevMessages => [...prevMessages, botResponse]);
            } else if (response.data.status === 200) {
              setQuestionAbout(message);
              const botResponse = {
                user: 'Bot',
                message: response.data.msg,
                time: getCurrentTime()
              };
              setMessages(prevMessages => [...prevMessages, botResponse]);
            }
          })
          .catch(error => {
            console.error('Error sending question:', error);
          });
      } else {
        axios
          .post('http://localhost:3000/message/create', {
            question: questionAbout,
            answer: message
          })
          .then(response => {
            if (response.data.status === 202) {
              const botResponse = {
                user: 'Bot',
                message: response.data.msg,
                time: getCurrentTime()
              };
              setMessages(prevMessages => [...prevMessages, botResponse]);
              setQuestionAbout('');
            }
          })
          .catch(error => {
            console.error('Error sending question:', error);
          });
      }
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  };

  const scrollToBottom = () => {
    const chatBody = document.getElementById('chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat</h2>
      </div>
      <div className="chat-body" id="chat-body">
        {messages.map((message, index) => (
          <div key={index} className="chat-message">
            <span className="user">
              <b> {message.user}: </b>
            </span>
            <span className="message"> {message.message} </span>
            <span className="time"> {message.time} </span>
            {
              message.id && <FaTimes className="remove-icon" onClick={() => deleteMessage(message?.id)} />
            }
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input type="text" id="message-input" placeholder="Type your message..." onKeyDown={handleKeyDown} />
        <input type="submit" value="Send" onClick={sendMessage}  />
      </div>
    </div>
  );
}

export default App;
