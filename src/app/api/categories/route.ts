import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const categories = await db.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
      orderBy: { displayOrder: "asc" },
    });

    const mapped = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      image: c.image,
      description: c.description,
      productCount: c._count.products,
    }));

    return NextResponse.json({
      success: true,
      data: mapped,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching categories" },
      { status: 500 }
    );
  }
};
