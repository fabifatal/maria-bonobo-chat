// src/api.js
const API_URL = process.env.REACT_APP_API_URL;

function defaultHeaders() {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  // Para Día 3 (auth): incluir Bearer si existe
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...defaultHeaders(), ...(options.headers || {}) },
    });

    const status = res.status;
    let data = null;
    try {
      // puede fallar si la respuesta es vacía
      data = await res.json();
    } catch (_) {}

    if (!res.ok) {
      return {
        data: null,
        error: { message: data?.message || res.statusText || "Request error" },
        status,
      };
    }

    return { data, error: null, status };
  } catch (err) {
    return { data: null, error: { message: err.message }, status: 0 };
  }
}

// --- Endpoints Día 2 (GET) ---
export function getRevelaciones({ page, limit } = {}) {
  const qs =
    page && limit
      ? `?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`
      : "";
  return request(`/revelaciones${qs}`);
}

export function getRevelacion(id) {
  return request(`/revelaciones/${encodeURIComponent(id)}`);
}

export function getLogin(email, password) {
  return request(`/users?email=${email}&password=${password}`, {
    method: "GET",
  });
}
