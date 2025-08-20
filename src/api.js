// src/api.js
const API_URL = process.env.REACT_APP_API_URL;

function defaultHeaders() {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
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

export function getRevelaciones({ page, limit, userId } = {}) {
  let qs = "";
  const params = [];
  
  if (page && limit) {
    params.push(`page=${encodeURIComponent(page)}`);
    params.push(`limit=${encodeURIComponent(limit)}`);
  }
  
  if (userId) {
    params.push(`userId=${encodeURIComponent(userId)}`);
  }
  
  if (params.length > 0) {
    qs = `?${params.join('&')}`;
  }
  
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

export function postRegister(userData) {
  return request(`/users`, {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function postRevelacion(data) {
  // Asegurar que siempre se incluya el userId
  const revelacionData = {
    ...data,
    userId: data.userId || localStorage.getItem('userId')
  };
  
  return request(`/revelaciones`, {
    method: "POST",
    body: JSON.stringify(revelacionData),
  });
}

export function updateRevelacion(id, data) {
  return request(`/revelaciones/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteRevelacion(id) {
  return request(`/revelaciones/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}