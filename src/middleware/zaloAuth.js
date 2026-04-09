import crypto from "crypto";

function makeAppSecretProof(accessToken, appSecret) {
  return crypto
    .createHmac("sha256", appSecret)
    .update(accessToken)
    .digest("hex");
}

export async function zaloAuth(req, res, next) {
  try {
    const raw = req.headers["zalo-access-token"] || "";
    const accessToken = String(raw).replace(/^Bearer\s+/i, "").trim();

    if (!accessToken) {
      return res.status(401).json({
        ok: false,
        message: "Thiếu zalo-access-token",
      });
    }

    const appsecretProof = makeAppSecretProof(
      accessToken,
      process.env.ZALO_APP_SECRET
    );

    const resp = await fetch(
      "https://graph.zalo.me/v2.0/me?fields=id,name,picture",
      {
        method: "GET",
        headers: {
          access_token: accessToken,
          appsecret_proof: appsecretProof,
        },
      }
    );

    const data = await resp.json();

    if (!resp.ok || data.error) {
      return res.status(401).json({
        ok: false,
        message: data.message || "Token Zalo không hợp lệ",
      });
    }

    req.zaloProfile = {
      id: data.id,
      name: data.name || "",
      avatar: data.picture?.data?.url || "",
    };

    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message || "Lỗi xác thực Zalo",
    });
  }
}