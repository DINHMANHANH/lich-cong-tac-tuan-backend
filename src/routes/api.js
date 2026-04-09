import express from "express";
import { getWeekInfo } from "../lib/date.js";
import {
  setNotificationOptIn,
  setShortcutCreated,
  upsertUser,
} from "../services/userService.js";
import { createWeeklyPlan, getWeeklyPlan } from "../services/planService.js";
import { zaloAuth } from "../middleware/zaloAuth.js";

const router = express.Router();

router.use(zaloAuth);

router.use(async (req, res, next) => {
  try {
    const user = await upsertUser({
      zaloId: req.zaloProfile.id,
      fullName: req.zaloProfile.name || "",
      avatar: req.zaloProfile.avatar || "",
    });

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

router.get("/me", async (req, res) => {
  res.json({
    ok: true,
    user: req.user,
    zaloProfile: req.zaloProfile,
  });
});

router.put("/me/notification-opt-in", async (req, res) => {
  await setNotificationOptIn(req.user.userId, !!req.body.enabled);
  res.json({ ok: true });
});

router.put("/me/shortcut-created", async (req, res) => {
  await setShortcutCreated(req.user.userId, !!req.body.enabled);
  res.json({ ok: true });
});

router.get("/plans/current-week", async (req, res) => {
  const { weekStart } = getWeekInfo(new Date());
  const plan = await getWeeklyPlan(req.user.userId, weekStart);
  res.json({ ok: true, weekStart, plan });
});

router.get("/plans/week", async (req, res) => {
  const { weekStart } = req.query;

  if (!weekStart) {
    return res.status(400).json({
      ok: false,
      message: "Thiếu weekStart",
    });
  }

  const plan = await getWeeklyPlan(req.user.userId, weekStart);
  res.json({ ok: true, plan });
});

router.post("/plans/week", async (req, res) => {
  const { weekStart, weekEnd, title, note, items } = req.body;

  if (!weekStart || !weekEnd || !Array.isArray(items)) {
    return res.status(400).json({
      ok: false,
      message: "Thiếu dữ liệu tuần hoặc danh sách công tác",
    });
  }

  const { weekNumber } = getWeekInfo(weekStart);

  const result = await createWeeklyPlan({
    userId: req.user.userId,
    weekNumber,
    weekStart,
    weekEnd,
    title,
    note,
    items,
  });

  res.json({ ok: true, ...result });
});

export default router;