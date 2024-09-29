"use client"
import axios from "axios";

const createApi = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null; // Check if window is defined

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
    withCredentials: true,
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
};

export const api = createApi();
