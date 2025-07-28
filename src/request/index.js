import axios from "axios";
import { toast } from "sonner";
import { setUser } from "../lib/redux/slices/auth-slice";

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
    localStorage.setItem("user", JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    const message = error.response?.data?.message || "An error has occurred.";
    throw new Error(message);
  }
};

export const logOut = async (obj) => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`, obj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (error) {
    const message = error.response?.data?.message || "An error has occurred.";
    throw new Error(message);
  }
};

export const upDate = async (obj) => {
  try {
    await axios.put(`${BASE_URL}/profile/me`, obj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    toast.success("Update successfully ");
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (localUser) {
      for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
          localUser[key] = obj[key];
        }
      }

      localStorage.setItem("user", JSON.stringify(localUser));
    }
  } catch (error) {
    const message = error.response?.data?.message || "An error has occurred.";
    throw new Error(message);
  }
};

export const updateImage = async (img) => {
  try {
    await axios.put(`${BASE_URL}/profile/me/avatar`, img, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const updatedUser = res.data;
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (localUser) {
      for (const key in updatedUser) {
        if (Object.hasOwn(updatedUser, key)) {
          // userFile yoki boshqa object bo‘lsa ham to‘liq almashtir
          localUser[key] = updatedUser[key];
        }
      }

      localStorage.setItem("user", JSON.stringify(localUser));
    }

    setUser(updatedUser);
    toast.success("Avatar updated successfully");
  } catch (error) {
    const message = error.response?.data?.message || "An error has occurred.";
    toast.error(message);
  }
};

export const withGoogle = () => {
  try {
    localStorage.setItem("redirect_after_login", window.location.href);
    window.location.href = `${BASE_URL}/auth/google`;
  } catch (error) {
    console.error(error);
  }
};

export const withGithub = async () => {
  try {
    localStorage.setItem("redirect_after_login", window.location.href);

    window.location.href = `${BASE_URL}/auth/github`;
  } catch (error) {
    console.log(error);
  }
};
