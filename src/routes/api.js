import express from "express";

const router = express.Router();

function getAccessTokenFromHeader(req) {
  const header = req.headers["zalo-access-token"];

  if (!header) {
    return null;
  }

  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return header;
}

router.get("/", async (req, res) => {
  try {
    const accessToken = getAccessTokenFromHeader(req);

    if (!accessToken) {
      return res.status(401).json({
        ok: false,
        message: "Thiếu zalo-access-token",
      });
    }

    return res.json({
      ok: true,
      message: "Frontend -> backend OK",
      tokenPreview: `${String(accessToken).slice(0, 12)}...`,
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
    const accessToken = getAccessTokenFromHeader(req);

    if (!accessToken) {
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