import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) return NextResponse.json({ success: false, message: "productId required" }, { status: 400 });

    const reviews = await db.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    });

    const mapped = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      images: r.images,
      userName: r.user.name || r.user.email.split("@")[0],
      userAvatar: r.user.avatar,
      isVerified: r.isVerified,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const { userId, productId, rating, title, comment } = await req.json();
    if (!userId || !productId || !rating) {
      return NextResponse.json({ success: false, message: "userId, productId, rating required" }, { status: 400 });
    }

    const review = await db.review.create({
      data: { userId, productId, rating, title: title || null, comment: comment || null, isVerified: true },
    });

    // Update product rating
    const allReviews = await db.review.findMany({ where: { productId }, select: { rating: true } });
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await db.product.update({
      where: { id: productId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    });

    // Award points for review
    await db.rewardPoint.create({
      data: { userId, points: 50, reason: "review", description: "Points for writing a product review" },
    });
    await db.user.update({
      where: { id: userId },
      data: { totalPoints: { increment: 50 } },
    });

    return NextResponse.json({ success: true, data: review, message: "Review submitted! +50 points" }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, message: "You already reviewed this product" }, { status: 409 });
    }
    console.error("Error creating review:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
