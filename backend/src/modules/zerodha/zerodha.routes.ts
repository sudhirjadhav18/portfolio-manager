import { Router, Request, Response } from "express";
import { KiteConnect } from "kiteconnect";

const router = Router();

router.post("/generate-token", async (req: Request, res: Response) => {
  const { requestToken } = req.body;
  const apiKey = process.env.ZERODHA_API_KEY;
  const apiSecret = process.env.ZERODHA_API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "API key/secret not configured" });
  }
  if (!requestToken) {
    return res.status(400).json({ error: "Missing request token" });
  }

  try {
    const kite = new KiteConnect({ api_key: apiKey });
    const session = await kite.generateSession(requestToken, apiSecret);
    res.json({ access_token: session.access_token, user_id: session.user_id });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate access token", details: err.message });
  }
});

export default router;
