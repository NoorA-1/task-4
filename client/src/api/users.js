import { api } from "./client";

export async function fetchUsers() {
  const res = await api.get("/users");
  return res.data; // expect array or {users:[]}
}

export async function blockUsers(ids) {
  const res = await api.post("/users/block", { ids });
  return res.data;
}

export async function unblockUsers(ids) {
  const res = await api.post("/users/unblock", { ids });
  return res.data;
}

export async function deleteUsers(ids) {
  const res = await api.delete("/users", { data: { ids } });
  return res.data;
}

export async function deleteUnverified() {
  const res = await api.delete("/users/unverified");
  return res.data;
}
