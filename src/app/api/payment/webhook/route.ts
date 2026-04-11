// SeaLearn Nigeria — Paystack Webhook Handler
// Verifies signature · Updates enrolment on successful payment

import { NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Verify Paystack webhook signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference, amount, metadata } = event.data;
    const amountNaira = amount / 100; // Paystack sends kobo

    // Find and update payment record
    const payment = await prisma.payment.findUnique({ where: { reference } });
    if (!payment) return new Response("OK");

    await prisma.payment.update({
      where: { reference },
      data: {
        status: "SUCCESS",
        providerRef: event.data.id?.toString(),
        paidAt: new Date(),
        metadata: event.data,
      },
    });

    // Update enrolment if this was a tuition payment
    if (payment.enrolmentId) {
      const enrolment = await prisma.enrolment.findUnique({
        where: { id: payment.enrolmentId },
      });
      if (enrolment) {
        const newAmountPaid = enrolment.amountPaid + amountNaira;
        const isFullyPaid = newAmountPaid >= enrolment.totalFee - enrolment.discountAmount;
        await prisma.enrolment.update({
          where: { id: payment.enrolmentId },
          data: {
            amountPaid: newAmountPaid,
            status: isFullyPaid ? "ACTIVE" : "PENDING_PAYMENT",
          },
        });
      }
    }
  }

  return new Response("OK");
}
