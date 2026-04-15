import { listUsers } from "../data/mockStore.js";

export function getCurrentUser(req, res) {
  res.json(listUsers()[0] || null);
}
