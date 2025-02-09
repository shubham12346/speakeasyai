// File: /pages/api/webhooks.js

import crypto from "crypto";

export default function handler(req: any, res: any) {
  if (req.method === "POST") {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret!)
      .update(body)
      .digest("hex");

    if (signature === expectedSignature) {
      console.log("Webhook Verified:", req.body);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
