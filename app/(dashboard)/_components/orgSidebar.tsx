"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { OrganizationSwitcher } from "@clerk/nextjs";


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[226px] pl-5 pt-5 border-r-gray-100 pr-[20px] border-r-2 bg-[#FAF7F3]">
      <Link href="/">
        <div className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            height={100}
            width={100}
          />
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #FDBA74",
              justifyContent: "space-between",
              backgroundColor: "white",
            }
          }
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? "sidebarBtn" : "sidebarBtnActive"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            <LayoutDashboard className={cn("h-4 w-4 mr-2", !favorites && "fill-black") } />
            Team boards
          </Link>
        </Button>
        <Button
          variant={favorites ? "sidebarBtnActive" : "sidebarBtn"}
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href={{
            query: { favorites: true }
          }}>
            <Star className={cn("h-4 w-4 mr-2", favorites && "fill-black") }/>
            Favorite boards
          </Link>
        </Button>
      </div>
    </div>
  );
};