import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const products = await db.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        seller: { select: { id: true, shopName: true, shopSlug: true, rating: true } },
        sizes: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const mapped = products.map((p) => ({
      id: p.id,
      productRating: p.rating,
      productName: p.name,
      productDescription: p.description,
      productImageLink: p.imageUrl,
      images: p.images,
      productPrice: p.price,
      originalPrice: p.comparePrice,
      discount: p.discount,
      category: p.category?.slug || "",
      categoryName: p.category?.name || "",
      tags: p.tags,
      sellerName: p.seller.shopName,
      sellerId: p.seller.id,
      sellerSlug: p.seller.shopSlug,
      isFeatured: p.isFeatured,
      isOnSale: p.isOnSale,
      isPromoted: p.isPromoted,
      reviewCount: p._count.reviews,
      viewCount: p.viewCount,
      salesCount: p.salesCount,
      slug: p.slug,
      sizes: p.sizes.map((s) => ({
        name: s.name,
        availableQuantity: s.availableQuantity,
        inStock: s.inStock,
      })),
    }));

    return NextResponse.json(
      { success: true, data: mapped, message: "Products fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching products" },
      { status: 500 }
    );
  }
};
