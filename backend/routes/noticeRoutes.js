import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const notices = [
    {
      id: 1,
      title: "First Terminal Examination Notice",
      date: "2083-02-15",
      category: "Examination",
    },
    {
      id: 2,
      title: "School Reopening Notice",
      date: "2083-02-08",
      category: "Academic",
    },
    {
      id: 3,
      title: "Parents Meeting Notice",
      date: "2083-02-01",
      category: "Parents",
    },
  ];

  res.json(notices);
});

router.get("/:id", async (req, res) => {
  const notice = {
    id: req.params.id,
    title: "First Terminal Examination Notice",
    date: "2083-02-15",
    category: "Examination",
    description:
      "Important notice regarding First Terminal Examination schedule, routines and guidelines.",
  };

  res.json(notice);
});

export default router;