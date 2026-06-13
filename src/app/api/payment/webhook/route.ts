import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/resend";
import crypto from "crypto";
import { addMonths } from "date-fns";

export async function POST(req: NextRequest) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET!;
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== secretHash) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = await req.json();
  const { data } = body;
  if (!data || data.status !== "successful") {
    return NextResponse.json({ ok: true });
  }

  const payment = await prisma.payment.findUnique({
    where: { txRef: data.tx_ref },
    include: { user: true },
  });

  if (!payment || payment.status === "SUCCESS") {
    return NextResponse.json({ ok: true });
  }

  const expiresAt = addMonths(new Date(), payment.months);

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS" },
    }),
    prisma.user.update({
      where: { id: payment.userId },
      data: { plan: "PREMIUM", planExpiresAt: expiresAt },
    }),
  ]);

  await sendPaymentConfirmationEmail({
    to: payment.user.email!,
    name: payment.user.name || "Student",
    plan: "PREMIUM",
    months: payment.months,
    amount: payment.amount,
    expiresAt,
  });

  return NextResponse.json({ ok: true });
}
