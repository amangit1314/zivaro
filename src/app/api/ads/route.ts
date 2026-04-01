import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("sellerId");
    const placement = searchParams.get("placement");
    const status = searchParams.get("status");

    const where: any = {};
    if (sellerId) where.sellerId = sellerId;
    if (placement) where.placement = placement;
    if (status) where.status = status;

    // For public queries (no sellerId), only show active ads within date range
    if (!sellerId && !status) {
      const now = new Date();
      where.status = "ACTIVE";
      where.startsAt = { lte: now };
      where.endsAt = { gte: now };
    }

    const ads = await db.advertisement.findMany({
      where,
      include: {
        product: {
          include: {
            seller: { select: { shopName: true } },
            sizes: true,
            category: true,
          },
        },
      },
      orderBy: { bidPerClick: "desc" },
    });

    // Filter ads that haven't exceeded budget
    const activeAds = sellerId ? ads : ads.filter((ad) => ad.spent < ad.totalBudget);

    return NextResponse.json({ success: true, data: activeAds });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { sellerId, productId, title, placement, dailyBudget, totalBudget, bidPerClick, startsAt, endsAt } = body;

    if (!sellerId || !productId || !title || !placement || !totalBudget) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const ad = await db.advertisement.create({
      data: {
        sellerId,
        productId,
        title,
        placement,
        dailyBudget: dailyBudget || totalBudget / 30,
        totalBudget,
        bidPerClick: bidPerClick || 0.5,
        startsAt: new Date(startsAt || Date.now()),
        endsAt: new Date(endsAt || Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
      include: { product: true },
    });

    // Mark product as promoted
    await db.product.update({ where: { id: productId }, data: { isPromoted: true } });

    return NextResponse.json({ success: true, data: ad, message: "Ad created!" }, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
