import { NextRequest, NextResponse } from "next/server";

// ─── Contact form API route ────────────────────────────────────────────────────
// Uses Web3Forms (free — https://web3forms.com) to deliver emails.
// Set WEB3FORMS_KEY in .env.local / Vercel environment variables.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city, interest, message } = body;

    // Basic server-side validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const accessKey = process.env.WEB3FORMS_KEY;
    if (!accessKey) {
      // Key not configured — log and return success so UX isn't broken during dev
      console.warn("[contact] WEB3FORMS_KEY not set — email not sent.");
      return NextResponse.json({ success: true });
    }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New enquiry from ${name} — Innovation Designer Furniture`,
        from_name: "IDF Website",
        redirect: "https://innovationfurniture.in/contact",
        name,
        email,
        phone: phone || "—",
        city: city || "—",
        interest: interest || "—",
        message,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message ?? "Web3Forms error");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
