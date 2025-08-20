const CHAT_API_URL = process.env.REACT_APP_CHAT_API_URL || 'http://localhost:3001/api/chat';

export const sendMessage = async (messages) => {
  try {
    // Los mensajes ya están en el formato correcto para la API
    console.log('Enviando mensajes a la API:', messages);

    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('errorData', errorData);
      throw new Error(errorData.error || 'Error en la API de chat');
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);
    
    // Verificar que la respuesta tenga el formato esperado
    if (data.reply) {
      return { success: true, data: { reply: data.reply } };
    } else {
      throw new Error('Formato de respuesta inesperado de la API');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
