export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRICING_PLANS } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { months, method, phone } = await req.json();
  const plan = PRICING_PLANS.find((p) => p.months === months);
  if (!plan)
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  const txRef = `PP-${session.user.id}-${Date.now()}`;

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      amount: plan.price,
      currency: "UGX",
      method,
      txRef,
      status: "PENDING",
      planPurchased: "PREMIUM",
      months,
    },
  });

  const payload: any = {
    tx_ref: txRef,
    amount: plan.price,
    currency: "UGX",
    redirect_url: `${process.env.NEXTAUTH_URL}/payment/verify`,
    customer: {
      email: session.user.email,
      name: session.user.name,
      phonenumber: phone || "",
    },
    customizations: {
      title: "PharmaPrep Uganda Premium",
      description: `${plan.label} Premium Access`,
      logo: `${process.env.NEXTAUTH_URL}/logo.png`,
    },
  };

  if (method === "MTN_MOMO") {
    payload.payment_options = "mobilemoneyrwanda,mobilemoneyuganda";
  } else if (method === "AIRTEL_MONEY") {
    payload.payment_options = "mobilemoneyuganda";
  } else {
    payload.payment_options = "card";
  }

  const fwRes = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const fwData = await fwRes.json();
  if (fwData.status === "success") {
    return NextResponse.json({ link: fwData.data.link, txRef });
  }
  return NextResponse.json(
    { error: "Payment initiation failed" },
    { status: 500 },
  );
}
