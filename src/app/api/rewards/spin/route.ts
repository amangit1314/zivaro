import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const SPIN_REWARDS = [
  { points: 5, weight: 40 },
  { points: 10, weight: 30 },
  { points: 25, weight: 15 },
  { points: 50, weight: 10 },
  { points: 100, weight: 5 },
];

function spinWheel(): number {
  const totalWeight = SPIN_REWARDS.reduce((s, r) => s + r.weight, 0);
  let random = Math.random() * totalWeight;
  for (const reward of SPIN_REWARDS) {
    random -= reward.weight;
    if (random <= 0) return reward.points;
  }
  return SPIN_REWARDS[0].points;
}

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ success: false, message: "userId required" }, { status: 400 });

    // Check if already spun today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingSpin = await db.rewardPoint.findFirst({
      where: { userId, reason: "spin", createdAt: { gte: today } },
    });

    if (existingSpin) {
      return NextResponse.json({ success: false, message: "Already spun today! Come back tomorrow" }, { status: 400 });
    }

    const points = spinWheel();

    await db.rewardPoint.create({
      data: { userId, points, reason: "spin", description: `Spin the wheel - won ${points} points!` },
    });

    const user = await db.user.findUnique({ where: { id: userId }, select: { totalPoints: true } });
    const newTotal = (user?.totalPoints || 0) + points;
    const newTier = newTotal >= 5001 ? "PLATINUM" : newTotal >= 2001 ? "GOLD" : newTotal >= 501 ? "SILVER" : "BRONZE";

    await db.user.update({
      where: { id: userId },
      data: { totalPoints: newTotal, rewardTier: newTier },
    });

    return NextResponse.json({
      success: true,
      data: { pointsWon: points, totalPoints: newTotal, tier: newTier },
      message: `You won ${points} points!`,
    });
  } catch (error) {
    console.error("Spin error:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
};
