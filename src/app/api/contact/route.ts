import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSiteValue } from "@/lib/site-config";

// POST /api/contact — sends enquiry email to the admin-configured recipient address
export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Dev/test: log and succeed silently so the form still works without config
      console.warn("[contact] RESEND_API_KEY not set — email not sent.");
      console.info({ name, email, subject, message });
      return NextResponse.json({ ok: true });
    }

    // Fetch the admin-configured recipient email from CMS
    const recipient = await getSiteValue("contact", "enquiry_recipient") || "info@sealearn.edu.ng";

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "SeaLearn Nigeria Enquiries <onboarding@resend.dev>",
      to: [recipient],
      replyTo: email,
      subject: `[SeaLearn Enquiry] ${subject || "Contact Form Submission"}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <div style="background:#0a1628;padding:20px 24px;border-radius:12px 12px 0 0">
            <h2 style="color:#f4c430;font-size:18px;margin:0">⚓ SeaLearn Nigeria — New Enquiry</h2>
          </div>
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr style="border-bottom:1px solid #f3f4f6">
                <td style="padding:10px 0;color:#6b7280;width:120px">From</td>
                <td style="padding:10px 0;font-weight:600;color:#0a1628">${name}</td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6">
                <td style="padding:10px 0;color:#6b7280">Email</td>
                <td style="padding:10px 0"><a href="mailto:${email}" style="color:#0369a1">${email}</a></td>
              </tr>
              <tr style="border-bottom:1px solid #f3f4f6">
                <td style="padding:10px 0;color:#6b7280">Subject</td>
                <td style="padding:10px 0;color:#0a1628">${subject || "General Enquiry"}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#6b7280;vertical-align:top">Message</td>
                <td style="padding:10px 0;color:#374151;white-space:pre-wrap">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
              </tr>
            </table>
            <div style="margin-top:20px;padding:12px 16px;background:#f0fdf4;border-radius:8px;font-size:12px;color:#4b5563">
              Reply directly to this email to respond to <strong>${name}</strong>.
            </div>
          </div>
          <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:12px">
            SeaLearn Nigeria · Apapa Port Road, Lagos
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
