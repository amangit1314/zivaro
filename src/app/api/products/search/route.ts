import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { hasSome: q.toLowerCase().split(" ") } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === "price_asc" ? { price: "asc" } :
      sort === "price_desc" ? { price: "desc" } :
      sort === "rating" ? { rating: "desc" } :
      sort === "popular" ? { salesCount: "desc" } :
      { createdAt: "desc" };

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          seller: { select: { id: true, shopName: true, shopSlug: true } },
          sizes: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    const mapped = products.map((p) => ({
      id: p.id,
      productRating: p.rating,
      productName: p.name,
      productDescription: p.description,
      productImageLink: p.imageUrl,
      productPrice: p.price,
      originalPrice: p.comparePrice,
      discount: p.discount,
      category: p.category?.slug || "",
      tags: p.tags,
      sellerName: p.seller.shopName,
      sellerId: p.seller.id,
      isFeatured: p.isFeatured,
      isOnSale: p.isOnSale,
      isPromoted: p.isPromoted,
      slug: p.slug,
      sizes: p.sizes.map((s) => ({
        name: s.name,
        availableQuantity: s.availableQuantity,
        inStock: s.inStock,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: mapped,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      message: "Search results fetched",
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, message: "Search failed" },
      { status: 500 }
    );
  }
};
