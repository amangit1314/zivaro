import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CartItem } from "@/types/cart-item";

export async function POST(request: Request) {
  try {
    const { userId, shippingAddress, mobileNumber, email, paymentMethod, cartItems, totalPrice } = await request.json();

    if (!userId || !cartItems || cartItems.length === 0) {
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
        totalPrice: totalPrice || cartItems.reduce((s: number, i: CartItem) => s + i.totalPrice, 0),
        orderItems: {
          create: cartItems.map((item: CartItem) => ({
            productId: item.productId,
            productName: item.productName,
            productImageLink: item.productImage,
            selectedSize: typeof item.selectedProductSize === "object" ? item.selectedProductSize.name : String(item.selectedProductSize),
            totalPrice: item.totalPrice,
            quantity: item.totalQuantity,
            sellerName: item.sellerName,
            selectedProductSize: typeof item.selectedProductSize === "object" ? item.selectedProductSize.name : String(item.selectedProductSize),
            unitPrice: item.productPrice,
          })),
        },
      },
      include: { orderItems: true },
    });

    // Award reward points
    const pointsEarned = Math.floor(totalPrice || 0);
    if (pointsEarned > 0 && userId) {
      await db.rewardPoint.create({
        data: { userId, points: pointsEarned, reason: "purchase", description: `Points for order ${orderNumber}`, orderId: order.id },
      });
      const user = await db.user.findUnique({ where: { id: userId }, select: { totalPoints: true } });
      const newTotal = (user?.totalPoints || 0) + pointsEarned;
      const newTier = newTotal >= 5001 ? "PLATINUM" : newTotal >= 2001 ? "GOLD" : newTotal >= 501 ? "SILVER" : "BRONZE";
      await db.user.update({ where: { id: userId }, data: { totalPoints: newTotal, rewardTier: newTier } });
    }

    return NextResponse.json({ success: true, order, message: `Order placed! +${pointsEarned} reward points` });
  } catch (error) {
    console.error("Error placing cart order:", error);
    return NextResponse.json({ message: "Failed to place order" }, { status: 500 });
  }
}
