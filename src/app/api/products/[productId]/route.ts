import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  try {
    const product = await db.product.findUnique({
      where: { id: params.productId },
      include: {
        category: true,
        seller: { select: { id: true, shopName: true, shopSlug: true, rating: true, userId: true } },
        sizes: true,
        reviews: {
          include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await db.product.update({
      where: { id: params.productId },
      data: { viewCount: { increment: 1 } },
    });

    const mapped = {
      id: product.id,
      productRating: product.rating,
      productName: product.name,
      productDescription: product.description,
      productImageLink: product.imageUrl,
      images: product.images,
      productPrice: product.price,
      originalPrice: product.comparePrice,
      discount: product.discount,
      category: product.category?.slug || "",
      categoryName: product.category?.name || "",
      tags: product.tags,
      sellerName: product.seller.shopName,
      sellerId: product.seller.id,
      sellerSlug: product.seller.shopSlug,
      sellerRating: product.seller.rating,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      isPromoted: product.isPromoted,
      reviewCount: product._count.reviews,
      viewCount: product.viewCount,
      salesCount: product.salesCount,
      slug: product.slug,
      sizes: product.sizes.map((s) => ({
        name: s.name,
        availableQuantity: s.availableQuantity,
        inStock: s.inStock,
      })),
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        images: r.images,
        userName: r.user.name || r.user.email.split("@")[0],
        userAvatar: r.user.avatar,
        isVerified: r.isVerified,
        createdAt: r.createdAt,
      })),
    };

    return NextResponse.json(
      { success: true, data: mapped, message: "Product fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching product" },
      { status: 500 }
    );
  }
};
