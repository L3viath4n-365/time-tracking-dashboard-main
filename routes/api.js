import { Router } from "express";
import localData from "../services/data.json" with { type: "json" };

const router = Router();
const colours = ['bg-orange-300', 'bg-blue-300', 'bg-pink-400', 'bg-green-400', 'bg-purple-700', 'bg-yellow-300'];

router.get(['/', '/daily', '/weekly', '/monthly'], (req, res) => {
  const timeframe = req.path.replace(/\//g, '') || 'daily';

  const timeframeLabels = {
    daily: 'Yesterday',
    weekly: 'Last Week',
    monthly: 'Last Month'
  };

  try {
    res.render("index", {
      data: localData,
      bgcolour: colours,
      timeframe,
      label: timeframeLabels[timeframe] || 'Yesterday',
      error: null,
    });
  } catch (error) {
    console.error('Failed to render template:', error.message);
    res.status(500).send("Template rendering error");
  }
});

export default router;