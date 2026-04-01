import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { code, orderTotal } = await req.json();
    if (!code) return NextResponse.json({ success: false, message: "Coupon code required" }, { status: 400 });

    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 404 });
    if (!coupon.isActive) return NextResponse.json({ success: false, message: "Coupon is no longer active" }, { status: 400 });
    if (new Date() > coupon.expiresAt) return NextResponse.json({ success: false, message: "Coupon has expired" }, { status: 400 });
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) return NextResponse.json({ success: false, message: "Coupon usage limit reached" }, { status: 400 });
    if (orderTotal && orderTotal < coupon.minOrderAmount) {
      return NextResponse.json({ success: false, message: `Minimum order amount is $${coupon.minOrderAmount}` }, { status: 400 });
    }

    let discountAmount = (orderTotal || 0) * (coupon.discountPercent / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: Math.round(discountAmount * 100) / 100,
        maxDiscount: coupon.maxDiscount,
      },
      message: `${coupon.discountPercent}% discount applied!`,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
