import type { VercelRequest, VercelResponse } from "@vercel/node";
import twilio from "twilio";

// Expected env vars configured in Vercel project settings
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_TWIML_APP_SID = process.env.TWILIO_TWIML_APP_SID || "";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const identity = (req.body?.identity as string) || (req.query.identity as string) || "anonymous";

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_TWIML_APP_SID) {
    return res.status(500).json({ message: "Missing Twilio credentials" });
  }

  try {
    const AccessToken = (twilio as any).jwt.AccessToken as typeof twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, identity, { identity });
    token.ttl = 3600;

    const voiceGrant = new VoiceGrant({ outgoingApplicationSid: TWILIO_TWIML_APP_SID, incomingAllow: true });
    token.addGrant(voiceGrant);

    const jwt = token.toJwt();
    return res.status(200).json({ token: jwt });
  } catch (err: any) {
    return res.status(500).json({ message: "Failed to generate Twilio token", error: err?.message || String(err) });
  }
}