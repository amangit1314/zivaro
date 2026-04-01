import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastCheckIn: true, totalPoints: true, rewardTier: true },
    });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const today = new Date().toDateString();
    if (user.lastCheckIn && new Date(user.lastCheckIn).toDateString() === today) {
      return NextResponse.json({ success: false, message: "Already checked in today" }, { status: 400 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = user.lastCheckIn && new Date(user.lastCheckIn).toDateString() === yesterday.toDateString();
    const newStreak = isConsecutive ? user.streak + 1 : 1;
    const points = newStreak > 7 ? 20 : 10;

    await db.rewardPoint.create({
      data: { userId, points, reason: "check_in", description: `Daily check-in (Day ${newStreak})` },
    });

    const newTotal = user.totalPoints + points;
    const newTier = newTotal >= 5001 ? "PLATINUM" : newTotal >= 2001 ? "GOLD" : newTotal >= 501 ? "SILVER" : "BRONZE";

    const updated = await db.user.update({
      where: { id: userId },
      data: { streak: newStreak, lastCheckIn: new Date(), totalPoints: newTotal, rewardTier: newTier },
      select: { totalPoints: true, streak: true, rewardTier: true },
    });

    return NextResponse.json({
      success: true,
      data: { ...updated, pointsEarned: points },
      message: `+${points} points! Streak: ${newStreak} days`,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
