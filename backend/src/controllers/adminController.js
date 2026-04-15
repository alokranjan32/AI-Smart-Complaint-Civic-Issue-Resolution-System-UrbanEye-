import { getAnalytics, listComplaints, listUsers } from "../data/mockStore.js";

export function getAdminOverview(req, res) {
  res.json(getAnalytics());
}

export function getAdminComplaints(req, res) {
  res.json(listComplaints());
}

export function getAdminUsers(req, res) {
  res.json(listUsers());
}
