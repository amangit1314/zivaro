"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useUserStore } from "@/zustand/user-store";
import { useRewardStore } from "@/zustand/reward-store";
import Link from "next/link";
import { Gift, Flame, Star, Trophy, Zap, ShoppingBag, MessageSquare, UserPlus, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const TIER_CONFIG = {
  BRONZE: { color: "#CD7F32", bg: "bg-amber-50", text: "text-amber-700", next: 501, label: "Bronze" },
  SILVER: { color: "#C0C0C0", bg: "bg-gray-100", text: "text-gray-600", next: 2001, label: "Silver" },
  GOLD: { color: "#FFD700", bg: "bg-yellow-50", text: "text-yellow-700", next: 5001, label: "Gold" },
  PLATINUM: { color: "#8B5CF6", bg: "bg-purple-50", text: "text-purple-700", next: 999999, label: "Platinum" },
};

const TIER_THRESHOLDS = [0, 501, 2001, 5001];

export default function RewardsPage() {
  const { user, isAuthenticated } = useUserStore();
  const { totalPoints, tier, streak, history, lastCheckIn, fetchRewards, dailyCheckIn, spinWheel, canSpin, canCheckIn } = useRewardStore();
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?.id) fetchRewards(user.id);
  }, [isAuthenticated, user?.id, fetchRewards]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <Gift className="w-16 h-16 text-gray-300 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Sign in to access Rewards</h1>
          <Link href="/login" className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">Sign In</Link>
        </div>
      </div>
    );
  }

  const tierConfig = TIER_CONFIG[tier];
  const currentIdx = ["BRONZE", "SILVER", "GOLD", "PLATINUM"].indexOf(tier);
  const nextThreshold = TIER_THRESHOLDS[currentIdx + 1] || 5001;
  const prevThreshold = TIER_THRESHOLDS[currentIdx] || 0;
  const progress = Math.min(100, ((totalPoints - prevThreshold) / (nextThreshold - prevThreshold)) * 100);

  const handleCheckIn = async () => {
    if (user?.id) await dailyCheckIn(user.id);
  };

  const handleSpin = async () => {
    if (!user?.id || spinning || !canSpin()) return;
    setSpinning(true);
    setSpinResult(null);
    const newRotation = rotation + 1440 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(async () => {
      const points = await spinWheel(user.id);
      setSpinResult(points);
      setSpinning(false);
      if (points > 0) toast.success(`You won ${points} points!`);
    }, 3000);
  };

  const earnMethods = [
    { icon: ShoppingBag, label: "Purchase", desc: "1 point per $1 spent", color: "bg-blue-50 text-blue-600" },
    { icon: MessageSquare, label: "Review", desc: "50 points per review", color: "bg-green-50 text-green-600" },
    { icon: CheckCircle, label: "Daily Check-in", desc: "10-20 points daily", color: "bg-amber-50 text-amber-600" },
    { icon: Zap, label: "Spin Wheel", desc: "5-100 points", color: "bg-purple-50 text-purple-600" },
    { icon: UserPlus, label: "Referral", desc: "200 points each", color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rewards</h1>
          <p className="text-sm text-gray-500 mt-1">Earn points, unlock perks, level up</p>
        </div>

        {/* Tier Card */}
        <div className={`${tierConfig.bg} rounded-2xl border p-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Trophy className="w-full h-full" style={{ color: tierConfig.color }} />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: tierConfig.color + "20" }}>
                  <Star className="w-6 h-6" style={{ color: tierConfig.color }} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Tier</p>
                  <p className="text-2xl font-bold" style={{ color: tierConfig.color }}>{tierConfig.label}</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mt-4">{totalPoints.toLocaleString()} <span className="text-lg font-normal text-gray-500">points</span></p>
            </div>
            {tier !== "PLATINUM" && (
              <div className="md:w-1/3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">{tierConfig.label}</span>
                  <span className="font-medium text-gray-900">{TIER_CONFIG[["BRONZE", "SILVER", "GOLD", "PLATINUM"][currentIdx + 1] as keyof typeof TIER_CONFIG]?.label}</span>
                </div>
                <div className="h-3 bg-white rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: tierConfig.color }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{nextThreshold - totalPoints} points to next tier</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Check-in */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Daily Check-in</h2>
              <div className="flex items-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-bold text-orange-500">{streak}</span>
                <span className="text-sm text-gray-500">day streak</span>
              </div>
            </div>
            <div className="flex gap-2 mb-6">
              {Array.from({ length: 7 }).map((_, i) => {
                const filled = i < (streak % 7 || (streak > 0 ? 7 : 0));
                return (
                  <div key={i} className={`flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-medium ${filled ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </div>
                );
              })}
            </div>
            <button
              onClick={handleCheckIn}
              disabled={!canCheckIn()}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${canCheckIn() ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              {canCheckIn() ? `Check In (+${streak >= 7 ? 20 : 10} points)` : "Already checked in today"}
            </button>
          </div>

          {/* Spin Wheel */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Spin the Wheel</h2>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <div
                  className="w-full h-full rounded-full border-4 border-gray-200 transition-transform"
                  style={{
                    background: "conic-gradient(#ef4444 0deg 72deg, #f59e0b 72deg 144deg, #22c55e 144deg 216deg, #3b82f6 216deg 288deg, #6b7280 288deg 360deg)",
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                    {spinResult !== null ? (
                      <span className="text-lg font-bold text-green-600">+{spinResult}</span>
                    ) : (
                      <Zap className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-gray-800" />
              </div>
              <div className="flex gap-2 text-xs mb-4">
                {[{ pts: "100", c: "bg-red-100 text-red-600" }, { pts: "50", c: "bg-amber-100 text-amber-600" }, { pts: "25", c: "bg-green-100 text-green-600" }, { pts: "10", c: "bg-blue-100 text-blue-600" }, { pts: "5", c: "bg-gray-100 text-gray-600" }].map((s) => (
                  <span key={s.pts} className={`px-2 py-1 rounded-full font-medium ${s.c}`}>{s.pts}pts</span>
                ))}
              </div>
              <button
                onClick={handleSpin}
                disabled={spinning || !canSpin()}
                className={`w-full py-3 rounded-xl text-sm font-medium transition-all ${!spinning && canSpin() ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/25" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                {spinning ? "Spinning..." : !canSpin() ? "Come back tomorrow" : "Spin (1 free/day)"}
              </button>
            </div>
          </div>
        </div>

        {/* How to Earn */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">How to Earn Points</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {earnMethods.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                  <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{m.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier Benefits */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tier Benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Bronze", range: "0-500", perks: ["1x points", "Basic member"], color: "#CD7F32" },
              { name: "Silver", range: "501-2000", perks: ["1.5x points", "Free shipping $50+"], color: "#C0C0C0" },
              { name: "Gold", range: "2001-5000", perks: ["2x points", "Free shipping", "Early access"], color: "#FFD700" },
              { name: "Platinum", range: "5001+", perks: ["3x points", "Free shipping", "Priority support", "Exclusive deals"], color: "#8B5CF6" },
            ].map((t) => (
              <div key={t.name} className={`rounded-2xl border p-4 ${tier === t.name.toUpperCase() ? "ring-2 ring-offset-2 border-gray-300" : "border-gray-100"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: t.color + "20" }}>
                    <Star className="w-4 h-4" style={{ color: t.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: t.color }}>{t.name}</p>
                    <p className="text-[10px] text-gray-400">{t.range} pts</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {t.perks.map((p) => (
                    <li key={p} className="text-xs text-gray-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Points History */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Points History</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No points earned yet</p>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 15).map((h) => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{h.reason.replace("_", " ")}</p>
                    <p className="text-xs text-gray-500">{h.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">+{h.points}</p>
                    <p className="text-[10px] text-gray-400">{new Date(h.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
