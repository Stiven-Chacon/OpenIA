import './App.css';
import React, { useState } from 'react';

function App() {
  const [conversations, setConversations] = useState([]); // Estado para almacenar todas las conversaciones
  const [currentConversation, setCurrentConversation] = useState([]); // Estado para almacenar la conversación actual
  const [inputMessage, setInputMessage] = useState(''); // Estado para almacenar el mensaje de entrada del usuario
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(null); // Estado para almacenar el índice de la conversación seleccionada

  // Función para enviar un mensaje
  const sendMessage = async () => {
    if (!inputMessage.trim()) return; // Verifica si el mensaje de entrada está vacío

    // Crea un mensaje del usuario
    const userMessage = {
      role: 'user',
      content: inputMessage.trim()
    };

    // Agrega el mensaje del usuario a la conversación actual
    setCurrentConversation(prevConversation => [...prevConversation, userMessage]);
    setInputMessage(''); // Reinicia el mensaje de entrada

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: inputMessage.trim() })
      });
      const data = await response.json();// Convierte la respuesta en formato JSON
      // Crea un mensaje de respuesta del servidor
      const openaiReply = {
        role: 'server',
        content: data.reply
      };
      // Agrega el mensaje de respuesta del servidor a la conversación actual
      setCurrentConversation(prevConversation => [...prevConversation, openaiReply]);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Función para iniciar una nueva conversación
  const startNewConversation = () => {
    // Agrega la conversación actual al estado de todas las conversaciones
    setConversations(prevConversations => [...prevConversations, currentConversation]);
    setCurrentConversation([]); // Reinicia la conversación actual
    setSelectedConversationIndex(null); // Reinicia el índice de la conversación seleccionada
  };

  // Función para seleccionar una conversación existente
  const selectConversation = (conversation, index) => {
    // Establece la conversación actual y el índice de la conversación seleccionada
    setCurrentConversation(conversation);
    setSelectedConversationIndex(index);
  };

  return (
    <>
      <nav class="navbar navbar-dark bg-dark">
        <div class="container-fluid">
          <span class="navbar-brand mb-0 h1">OpenAI</span>
        </div>
      </nav>

      <div class="container py-4">
        <div class="row clearfix">
          <div class="col-lg-12">
            <div class="card chat-app">
              <div id="plist" class="people-list">
                <div class="input-group">
                  <button class="btn btn-dark" onClick={startNewConversation}>Start New Conversation</button>
                </div>
                <ul className="list-unstyled chat-list mt-2 mb-0">
                  {conversations.map((conversation, index) => (
                    <li key={index} className={selectedConversationIndex === index ? 'selected' : ''} onClick={() => selectConversation(conversation, index)}>
                      <div className="d-flex align-items-center">
                        <img src="https://icons.iconarchive.com/icons/simpleicons-team/simple/256/openai-icon.png" alt="avatar" className="avatar mr-4" />
                        <div className="chat-content">
                          <div className="name">Conversation {index + 1}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div class="chat">
                <div class="chat-header clearfix">
                  <div class="row">
                    <div class="col-lg-6">
                      <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                        <img src="https://icons.iconarchive.com/icons/simpleicons-team/simple/256/openai-icon.png" alt="avatar" />
                      </a>
                      <div class="chat-about">
                        <h6 class="m-b-0">OpenAI</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chat-history">
                  <ul class="m-b-0">
                    {currentConversation.map((message, index) => (
                      <li key={index} class="clearfix">
                        <div class={message.role === 'user' ? 'message other-message float-right' : 'message my-message'}>
                          {message.content}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div class="chat-message clearfix">
                  <div class="input-group mb-0">
                    <input type="text" class="form-control" value={inputMessage} required="" placeholder="Message..." id="messageInput" onChange={(e) => setInputMessage(e.target.value)} />
                    <button class="btn btn-dark" id="sendButton" onClick={sendMessage}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
