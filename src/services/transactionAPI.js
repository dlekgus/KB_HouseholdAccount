import api from "./api";

const userId = localStorage.getItem("userId");

export const fetchTransactionsByDateRangeAPI = async ({
  userId,
  startDate,
  endDate,
  page = 1,
  limit = 10000,
}) => {
  return api.get("/transactions", {
    params: {
      userId,
      date_gte: startDate,
      date_lte: endDate,
      _sort: "date",
      _order: "asc",
      _page: page,
      _limit: limit,
    },
  });
};

export const addTransactionAPI = async (data) => {
  return api.post("/transactions", { ...data, userId });
};

export const updateTransactionAPI = async (id, updates) => {
  return api.patch(`/transactions/${id}`, updates);
};

export const deleteTransactionAPI = async (id) => {
  return api.delete(`/transactions/${id}`);
};
