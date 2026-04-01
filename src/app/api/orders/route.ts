import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (request: Request) => {
  try {
    const reqBody = await request.json();
    const { userId, shippingAddress, mobileNumber, email, paymentMethod, orderItems, orderTotalPrice } = reqBody;

    if (!userId || !orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const orderNumber = `ZIV-${Date.now().toString(36).toUpperCase()}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        userId,
        shippingAddress,
        mobileNumber,
        email,
        paymentMethod,
        totalPrice: orderTotalPrice,
      },
    });

    const createdOrderItems = await Promise.all(
      orderItems.map((item: any) =>
        db.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            productName: item.productName,
            productImageLink: item.productImageLink || item.productImage,
            selectedSize: typeof item.selectedSize === "object" ? item.selectedSize.name : item.selectedSize,
            totalPrice: item.totalPrice,
            quantity: item.quantity,
            sellerName: item.sellerName,
            selectedProductSize: typeof item.selectedProductSize === "object" ? item.selectedProductSize.name : item.selectedProductSize,
            unitPrice: item.unitPrice || item.productPrice,
          },
        })
      )
    );

    const updatedOrder = await db.order.findUnique({
      where: { id: order.id },
      include: { orderItems: true },
    });

    // Award reward points (1 point per dollar)
    const pointsEarned = Math.floor(orderTotalPrice);
    if (pointsEarned > 0) {
      await db.rewardPoint.create({
        data: { userId, points: pointsEarned, reason: "purchase", description: `Points for order ${orderNumber}`, orderId: order.id },
      });
      const user = await db.user.findUnique({ where: { id: userId }, select: { totalPoints: true } });
      const newTotal = (user?.totalPoints || 0) + pointsEarned;
      const newTier = newTotal >= 5001 ? "PLATINUM" : newTotal >= 2001 ? "GOLD" : newTotal >= 501 ? "SILVER" : "BRONZE";
      await db.user.update({ where: { id: userId }, data: { totalPoints: newTotal, rewardTier: newTier } });
    }

    return NextResponse.json({
      success: true,
      status: "OK",
      message: `Order placed! +${pointsEarned} reward points`,
      data: updatedOrder,
    }, { status: 200 });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ success: false, status: "ERROR", message: "Failed to place order" }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    const orders = await db.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, status: "OK", data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, status: "ERROR", message: "Failed to fetch orders" }, { status: 500 });
  }
};
