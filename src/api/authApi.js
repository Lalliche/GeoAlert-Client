"use client";
import axios from "./authBase";
import Cookies from "js-cookie";

export const getUsersByDateRange = async (startDate, endDate) => {
  const accessToken = Cookies.get("access");
  console.log("Fetching users from", startDate, "to", endDate);

  try {
    const response = await axios.get("/users/by-date", {
      params: {
        startDate,
        endDate,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(
      `Fetched users between ${startDate} and ${endDate}:`,
      response.data?.data
    );
    return response.data?.data || [];
  } catch (error) {
    console.error(
      `Error fetching users between ${startDate} and ${endDate}:`,
      error
    );
    throw error;
  }
};

export const handleLogin = async (email, password) => {
  console.log("Auth base URL:", process.env.NEXT_PUBLIC_API_BASE_URL_AUTH);

  console.log(
    "Login function called with email:",
    email,
    "and password:",
    password
  );
  try {
    const response = await axios.post(
      "/login",
      JSON.stringify({ email, password }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get("/users/all");
    console.log("Fetched users:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUser = async (id) => {
  console.log("Fetching user with ID:", id);

  try {
    const response = await axios.post("/users", [
      {
        UserId: id,
      },
    ]);

    console.log(`Fetched user with ID ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};
