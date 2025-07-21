import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "https://people-find.duckdns.org/api";

export const signUp = async (obj) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, obj, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.access_token);
    return data.user;
  } catch (error) {
    const message = error.response?.data?.message || "Xatolik yuz berdi";
    toast.error("Xatolik:", message);
    throw new Error(message);
  }
};

export const login = async (obj) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/login`, obj, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.access_token);
    return data.user;
  } catch (error) {
    const message = error.response?.data?.message || "Xatolik yuz berdi";
    throw new Error(message);
  }
};

export const getMeInformation = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return data.data;
  } catch (error) {
    const message = error.response?.data?.message || "Xatolik yuz berdi";
    throw new Error(message);
  }
};
