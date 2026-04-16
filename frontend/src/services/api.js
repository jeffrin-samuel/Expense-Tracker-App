// src/services/api.js
// Drop this file into your frontend/src/services/ folder.
// It replaces direct localStorage calls with backend API calls.

import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Response interceptor: normalize errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ─── Transaction API calls ────────────────────────────────────────────────────

/**
 * Fetch all transactions.
 * @param {Object} filters - { type, category, search, startDate, endDate }
 * @returns { success, count, summary, data }
 */
export const getTransactions = async (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
  );
  const { data } = await api.get("/transactions", { params });
  return data;
};

/**
 * Get a single transaction by ID.
 * @param {string} id - MongoDB ObjectId
 */
export const getTransactionById = async (id) => {
  const { data } = await api.get(`/transactions/${id}`);
  return data;
};

/**
 * Add a new transaction.
 * @param {Object} payload - { description, amount, type, category, date, currency? }
 * @returns { success, message, data }
 */
export const addTransaction = async (payload) => {
  const { data } = await api.post("/transactions", payload);
  return data;
};

/**
 * Update an existing transaction.
 * @param {string} id
 * @param {Object} payload
 */
export const updateTransaction = async (id, payload) => {
  const { data } = await api.put(`/transactions/${id}`, payload);
  return data;
};

/**
 * Delete a transaction by ID.
 * @param {string} id
 */
export const deleteTransaction = async (id) => {
  const { data } = await api.delete(`/transactions/${id}`);
  return data;
};

/**
 * Get category-wise stats for charts.
 * @returns { success, data: [{ _id: { type, category }, total, count }] }
 */
export const getStats = async () => {
  const { data } = await api.get("/transactions/stats/summary");
  return data;
};

export default api;