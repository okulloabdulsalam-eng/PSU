export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txRef = searchParams.get("tx_ref");
  const status = searchParams.get("status");

  if (status === "successful" && txRef) {
    const verifyRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      },
    );
    const data = await verifyRes.json();
    if (data.data?.status === "successful") {
      return NextResponse.redirect(
        new URL("/dashboard?payment=success", req.url),
      );
    }
  }
  return NextResponse.redirect(new URL("/dashboard?payment=failed", req.url));
}
