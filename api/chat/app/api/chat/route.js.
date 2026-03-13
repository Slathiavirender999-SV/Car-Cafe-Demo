// app/api/chat/route.js  (Next.js 13+ App Router)
// OR pages/api/chat.js   (Next.js Pages Router — see bottom of file)
//
// Deploy on Vercel, set ANTHROPIC_API_KEY in:
// Vercel Dashboard → Project → Settings → Environment Variables

import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are the AI concierge for Car Cafe Canada & Insta Tints, 
a premium automotive styling studio with locations in Brampton, Mississauga, and Hamilton, Ontario, Canada.

SERVICES & PRICING:
- Window Tinting (Carbon/Ceramic): Starts at $199. Carbon blocks heat & UV; Ceramic is top-tier with max heat rejection and clarity. Lifetime warranty on all tints.
- PPF – Paint Protection Film (XPEL Ultimate Plus): Full front package from $899. Self-healing film that protects against rock chips, scratches, and road debris. Invisible finish.
- Ceramic Coating (9H Nano-Crystal): Packages from $499. Permanent hydrophobic protection, mirror gloss, eliminates swirl marks. Multi-year warranty.
- Vinyl Wraps (3M / Avery Dennison): Full wraps from $2,500. Partial wraps, colour changes, matte/satin/chrome/colour-shift finishes available.
- Paint Correction: Packages from $299. Multi-stage polishing to remove swirls, scratches, and oxidation before coating.

CERTIFICATIONS: XPEL Certified Installer, 3M Authorized Dealer, IDA Member.

LOCATIONS & HOURS:
- Brampton HQ: 123 Queen St W — (905) 555-0101 — Mon–Sat 9am–7pm
- Mississauga: 456 Hurontario St — (905) 555-0202 — Mon–Sat 9am–7pm
- Hamilton: 789 King St E — (905) 555-0303 — Mon–Sat 9am–6pm

TONE & BEHAVIOUR:
- Be knowledgeable, friendly, and professional — like a trusted car enthusiast, not a salesperson.
- Give specific, helpful answers. Never make up prices beyond what's listed; say "pricing varies by vehicle — book a free quote" for unknowns.
- Keep responses concise: 2–4 sentences max unless a detailed explanation is clearly needed.
- Always end with a soft CTA: suggest booking a free quote, calling a location, or visiting @insta.tints on Instagram.
- Never discuss competitors by name.`;

// ─── App Router Handler (Next.js 13+) ────────────────────────────────────────

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Request body must include a non-empty messages array." },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = completion.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return Response.json({ reply: text });
  } catch (error) {
    console.error("Anthropic API error:", error);

    // Don't leak internal error details to the client
    return Response.json(
      { error: "Something went wrong. Please try again or call us directly." },
      { status: 500 }
    );
  }
}

// ─── Pages Router Handler (Next.js 12 / pages/api/chat.js) ───────────────────
// Uncomment below and delete the App Router export above if using Pages Router.

/*
import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Request body must include a non-empty messages array.",
      });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const completion = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = completion.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again or call us directly.",
    });
  }
}
*/
