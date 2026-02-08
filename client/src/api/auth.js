import { api } from "./client";

export async function register({ name, email, password }) {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // should include token
}

export async function confirmEmail(token) {
  const res = await api.get("/auth/confirm", { params: { token } });
  return res.data;
}
