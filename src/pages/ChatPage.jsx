import React, { useState } from 'react';

const ChatPage = () => {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: 'Soy María Bonobo. ¿Qué alma canta hoy? ✨' },
  ]);
  const [input, setInput] = useState('');

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMsgs((m) => [...m, userMsg, { role: 'assistant', content: 'respuesta simulada.' }]);
    setInput('');
  };

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}>
      <h1>María Bonobo Chat</h1>
      <div style={{ display: 'grid', gap: 8, margin: '16px 0' }}>
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'end' : 'start',
              background: m.role === 'user' ? '#e6f7ff' : '#f5f5f5',
              padding: 12,
              borderRadius: 8,
            }}
          >
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Escribe un mensaje"
          style={{ flex: 1 }}
        />
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
};

export default ChatPage;