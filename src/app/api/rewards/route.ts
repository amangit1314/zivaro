import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { totalPoints: true, rewardTier: true, streak: true, lastCheckIn: true },
    });

    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const history = await db.rewardPoint.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: {
        totalPoints: user.totalPoints,
        tier: user.rewardTier,
        streak: user.streak,
        lastCheckIn: user.lastCheckIn,
        history,
      },
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
