// src/api.js
const BASE_URL = "http://localhost:5000/api";

export const registerUser = async (formData) => {
  try {
    // FormData banayein
    const data = new FormData();
    
    // Object ke saare keys FormData mein append karein
    for (const key in formData) {
      // Agar profilePic null hai, toh usko skip karein
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      // JSON header mat lagayein, browser khud multipart/form-data set karega
      body: data,
    });

    return await response.json();
  } catch (error) {
    console.error("Register API Error:", error);
    return { error: "Server se connect nahi ho paya" };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    return { error: "Server se connect nahi ho paya" };
  }
};