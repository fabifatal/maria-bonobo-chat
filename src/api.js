const API_URL = process.env.REACT_APP_API_URL;

export async function getRevelaciones(token) {
  const res = await fetch(`${API_URL}/revelaciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al cargar');
  return res.json();
}

export async function getRevelacionById(id, token) {
  const res = await fetch(`${API_URL}/revelaciones/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('No encontrada');
  return res.json();
}