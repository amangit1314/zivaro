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

    const seller = await db.seller.findUnique({ where: { id: sellerId } });
    if (!seller) {
      return NextResponse.json({ success: false, message: "Seller not found" }, { status: 404 });
    }

    const products = await db.product.findMany({
      where: { sellerId },
      select: { id: true, name: true, salesCount: true, rating: true, price: true, imageUrl: true },
    });
    const productIds = products.map((p) => p.id);

    const orders = await db.order.findMany({
      where: { orderItems: { some: { productId: { in: productIds } } } },
      include: { orderItems: { where: { productId: { in: productIds } } } },
    });

    const totalRevenue = orders.reduce((sum, o) => {
      const sellerItems = o.orderItems;
      return sum + sellerItems.reduce((s, i) => s + (i.totalPrice || 0), 0);
    }, 0);

    const ordersByStatus: Record<string, number> = {};
    orders.forEach((o) => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    // Revenue by month (last 6 months)
    const now = new Date();
    const revenueByMonth: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const monthOrders = orders.filter((o) => {
        const created = new Date(o.createdAt || 0);
        return created >= d && created <= monthEnd;
      });
      const revenue = monthOrders.reduce((s, o) =>
        s + o.orderItems.reduce((is, i) => is + (i.totalPrice || 0), 0), 0);
      revenueByMonth.push({
        month: d.toLocaleString("en-US", { month: "short", year: "2-digit" }),
        revenue,
      });
    }

    const topProducts = [...products]
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    const avgRating = products.length > 0
      ? products.reduce((s, p) => s + p.rating, 0) / products.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        pendingPayout: seller.pendingPayout,
        commissionRate: seller.commissionRate,
        totalOrders: orders.length,
        totalProducts: products.length,
        avgRating: Math.round(avgRating * 10) / 10,
        revenueByMonth,
        topProducts,
        ordersByStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
