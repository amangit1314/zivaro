import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { adId } = await req.json();
    if (!adId) return NextResponse.json({ success: false, message: "adId required" }, { status: 400 });

    const ad = await db.advertisement.findUnique({ where: { id: adId } });
    if (!ad || ad.status !== "ACTIVE") {
      return NextResponse.json({ success: false, message: "Ad not active" }, { status: 400 });
    }

    const newSpent = ad.spent + ad.bidPerClick;
    const update: any = { clicks: { increment: 1 }, spent: newSpent };
    if (newSpent >= ad.totalBudget) update.status = "EXPIRED";

    await db.advertisement.update({ where: { id: adId }, data: update });

    return NextResponse.json({ success: true, message: "Click tracked" });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
