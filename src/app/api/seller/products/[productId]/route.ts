import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const PUT = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  try {
    const body = await req.json();
    const { name, description, price, comparePrice, discount, categoryId, tags, imageUrl, images, sizes, isFeatured, isOnSale } = body;

    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
    }
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (comparePrice !== undefined) updateData.comparePrice = comparePrice;
    if (discount !== undefined) updateData.discount = discount;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (tags !== undefined) updateData.tags = tags;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (images !== undefined) updateData.images = images;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isOnSale !== undefined) updateData.isOnSale = isOnSale;

    if (sizes) {
      await db.productSize.deleteMany({ where: { productId: params.productId } });
      await db.productSize.createMany({
        data: sizes.map((s: { name: string; availableQuantity?: number; inStock?: boolean }) => ({
          productId: params.productId,
          name: s.name,
          availableQuantity: s.availableQuantity || 10,
          inStock: s.inStock !== false,
        })),
      });
    }

    const product = await db.product.update({
      where: { id: params.productId },
      data: updateData,
      include: { sizes: true, category: true },
    });

    return NextResponse.json({ success: true, data: product, message: "Product updated!" });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: "Error updating product" }, { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: { productId: string } }
) => {
  try {
    await db.product.update({
      where: { id: params.productId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "Error deleting product" }, { status: 500 });
  }
};
