import api from "./api";

export const fetchTransactionsByDateRange = async ({
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

export const addTransaction = async (data) => {
  const { userId } = "1";
  return api.post("/transactions", { ...data, userId });
};

export const updateTransaction = async (id, updates) => {
  const { userId } = "1";
  const { data: existing } = await api.get(`/transactions/${id}`);
  if (existing.userId !== userId) {
    throw new Error("권한이 없습니다.");
  }
  return api.patch(`/transactions/${id}`, updates);
};

export const deleteTransaction = async (id) => {
  const { userId } = "1";
  const { data: existing } = await api.get(`/transactions/${id}`);
  if (existing.userId !== userId) {
    throw new Error("권한이 없습니다.");
  }
  return api.delete(`/transactions/${id}`);
};
