import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const { notificationId, markAll, userId } = await req.json();

    if (markAll && userId) {
      await db.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
      return NextResponse.json({ success: true, message: "All marked as read" });
    }

    if (!notificationId) return NextResponse.json({ success: false, message: "notificationId required" }, { status: 400 });

    await db.notification.update({ where: { id: notificationId }, data: { isRead: true } });
    return NextResponse.json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
