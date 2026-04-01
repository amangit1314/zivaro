import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });
    }

    const seller = await db.seller.findUnique({
      where: { userId },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!seller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: seller });
  } catch (error) {
    console.error("Error fetching seller:", error);
    return NextResponse.json({ success: false, message: "Error fetching seller" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const { userId, shopName, description } = await req.json();
    if (!userId || !shopName) {
      return NextResponse.json({ success: false, message: "userId and shopName required" }, { status: 400 });
    }

    const shopSlug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const existing = await db.seller.findUnique({ where: { shopSlug } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Shop name already taken" }, { status: 409 });
    }

    const seller = await db.seller.create({
      data: { userId, shopName, shopSlug, description },
    });

    await db.user.update({
      where: { id: userId },
      data: { role: "SELLER" },
    });

    return NextResponse.json({ success: true, data: seller, message: "Shop created!" }, { status: 201 });
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json({ success: false, message: "Error creating shop" }, { status: 500 });
  }
};
