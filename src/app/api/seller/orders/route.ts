import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");
    if (!sellerId) {
      return NextResponse.json({ success: false, message: "sellerId required" }, { status: 400 });
    }

    const sellerProducts = await db.product.findMany({
      where: { sellerId },
      select: { id: true },
    });
    const productIds = sellerProducts.map((p) => p.id);

    const orders = await db.order.findMany({
      where: {
        orderItems: { some: { productId: { in: productIds } } },
      },
      include: {
        orderItems: {
          where: { productId: { in: productIds } },
        },
        User: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
