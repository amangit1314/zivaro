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

    const products = await db.product.findMany({
      where: { sellerId },
      include: {
        category: true,
        sizes: true,
        _count: { select: { reviews: true, orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { sellerId, name, description, price, comparePrice, discount, categoryId, tags, imageUrl, images, sizes, isFeatured, isOnSale } = body;

    if (!sellerId || !name || !price) {
      return NextResponse.json({ success: false, message: "sellerId, name, price required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

    const product = await db.product.create({
      data: {
        sellerId,
        name,
        slug,
        description: description || "",
        price,
        comparePrice: comparePrice || null,
        discount: discount || 0,
        categoryId: categoryId || null,
        tags: tags || [],
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        images: images || [],
        isFeatured: isFeatured || false,
        isOnSale: isOnSale || false,
        sizes: sizes?.length > 0
          ? { create: sizes.map((s: { name: string; availableQuantity?: number }) => ({ name: s.name, availableQuantity: s.availableQuantity || 10, inStock: true })) }
          : undefined,
      },
      include: { sizes: true, category: true },
    });

    return NextResponse.json({ success: true, data: product, message: "Product created!" }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, message: "Error creating product" }, { status: 500 });
  }
};
