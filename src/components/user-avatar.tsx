"use client";

import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CiDeliveryTruck,
} from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, User, Store, Heart } from "lucide-react";
import { useUserStore } from "@/zustand/user-store";

const successNotification = (message: string) => toast.success(message);
const errorNotification = (errorMessage: string) => toast.error(errorMessage);

const UserAvatar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  const [loading, setLoading] = React.useState(false);

  const onLogout = async () => {
    try {
      setLoading(true);
      logout();
      successNotification("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      console.error("Logout failed: ", error.message);
      errorNotification(error.message);
    } finally {
      setLoading(false);
    }
  };

  return isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-xl cursor-pointer transition-all duration-300 h-9 w-9 hover:ring-2 hover:ring-red-500/20">
          <AvatarImage
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxq2rx8L2_5PTUI7aA57jJ8z_NPecD2tmNWg&s"
          />
          <AvatarFallback className="bg-red-100 text-red-600 text-xs font-semibold">
            {user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 my-2 mr-2 rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <DropdownMenuLabel className="text-xs text-gray-500">
          {user?.email}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href={`/profile/${user?.id!}`}>
          <DropdownMenuItem className="transition-all cursor-pointer duration-200 rounded-lg mx-1">
            <User className="w-4 h-4 mr-2" />
            My Profile
          </DropdownMenuItem>
        </Link>

        <Link href={`/profile/${user?.id!}/orders`}>
          <DropdownMenuItem className="transition-all cursor-pointer duration-200 rounded-lg mx-1">
            <CiDeliveryTruck className="mr-2" />
            My Orders
          </DropdownMenuItem>
        </Link>

        <Link href={`/profile/${user?.id!}/wishlist`}>
          <DropdownMenuItem className="transition-all cursor-pointer duration-200 rounded-lg mx-1">
            <Heart className="w-4 h-4 mr-2" />
            Wishlist
          </DropdownMenuItem>
        </Link>

        <Link href="/seller/dashboard">
          <DropdownMenuItem className="transition-all cursor-pointer duration-200 rounded-lg mx-1">
            <Store className="w-4 h-4 mr-2" />
            Seller Dashboard
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="transition-all duration-200 cursor-pointer text-red-600 focus:text-red-600 rounded-lg mx-1"
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <IoMdLogOut className="mr-2" />
          )}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link
      href="/login"
      className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all duration-200"
    >
      Sign In
    </Link>
  );
};

export default UserAvatar;
