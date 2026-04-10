import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const zaloAccessTokenHeader = req.headers["zalo-access-token"];

    if (!zaloAccessTokenHeader) {
      return res.status(401).json({
        ok: false,
        message: "Thiếu zalo-access-token",
      });
    }

    const accessToken = zaloAccessTokenHeader.startsWith("Bearer ")
      ? zaloAccessTokenHeader.split(" ")[1]
      : zaloAccessTokenHeader;

    return res.json({
      ok: true,
      message: "Frontend -> backend OK",
      tokenPreview: accessToken ? accessToken.slice(0, 12) + "..." : null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Lỗi server",
    });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    const zaloAccessTokenHeader = req.headers["zalo-access-token"];

    if (!zaloAccessTokenHeader) {
      return res.status(401).json({
        ok: false,
        message: "Thiếu zalo-access-token",
      });
    }

    return res.json({
      ok: true,
      data: [
        {
          id: 1,
          ngay: "10/04/2026",
          buoi: "Sáng",
          gio: "08:00",
          noiDung: "Họp giao ban",
          diaDiem: "Phòng họp A",
        },
        {
          id: 2,
          ngay: "10/04/2026",
          buoi: "Chiều",
          gio: "14:00",
          noiDung: "Làm việc với đơn vị B",
          diaDiem: "Phòng họp B",
        },
      ],
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Lỗi server",
    });
  }
});

export default router;