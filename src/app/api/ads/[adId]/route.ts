import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const PUT = async (
  req: Request,
  { params }: { params: { adId: string } }
) => {
  try {
    const body = await req.json();
    const ad = await db.advertisement.update({
      where: { id: params.adId },
      data: body,
    });
    return NextResponse.json({ success: true, data: ad, message: "Ad updated" });
  } catch (error) {
    console.error("Error updating ad:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: { adId: string } }
) => {
  try {
    const ad = await db.advertisement.update({
      where: { id: params.adId },
      data: { status: "EXPIRED" },
    });
    // Unmark product as promoted if no other active ads
    const otherAds = await db.advertisement.count({
      where: { productId: ad.productId, status: "ACTIVE", id: { not: ad.id } },
    });
    if (otherAds === 0) {
      await db.product.update({ where: { id: ad.productId }, data: { isPromoted: false } });
    }
    return NextResponse.json({ success: true, message: "Ad cancelled" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
