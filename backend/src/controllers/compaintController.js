
import prisma from "../utils/prisma.js";

export const createComplaint = async (req, res) => {
  const { description, location } = req.body;

  const complaint = await prisma.complaint.create({
    data: {
      description,
      location,
      userId: 1, // temporary
    },
  });

  res.json(complaint);
};

export const getComplaints = async (req, res) => {
  const data = await prisma.complaint.findMany();
  res.json(data);
};