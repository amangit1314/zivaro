import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });

    const items = await db.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            seller: { select: { shopName: true } },
            sizes: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        productName: item.product.name,
        productDescription: item.product.description,
        productImageLink: item.product.imageUrl,
        productPrice: item.product.price,
        originalPrice: item.product.comparePrice,
        discount: item.product.discount,
        productRating: item.product.rating,
        sellerName: item.product.seller.shopName,
        category: item.product.category?.slug || "",
        sizes: item.product.sizes.map((s) => ({ name: s.name, availableQuantity: s.availableQuantity, inStock: s.inStock })),
      },
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ success: false, message: "userId and productId required" }, { status: 400 });

    const existing = await db.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } });
    if (existing) return NextResponse.json({ success: true, data: existing, message: "Already in wishlist" });

    const item = await db.wishlistItem.create({ data: { userId, productId } });
    return NextResponse.json({ success: true, data: item, message: "Added to wishlist" }, { status: 201 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ success: false, message: "userId and productId required" }, { status: 400 });

    await db.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
    return NextResponse.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
