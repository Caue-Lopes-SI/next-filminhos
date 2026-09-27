"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, Eye, Star, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoIN from "../assets/logoIN.png";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import userIcon from "../assets/user.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [headerQuery, setHeaderQuery] = useState("");

  if (pathname === "/login" || pathname === "/cadastro") {
    return null;
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && headerQuery.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(headerQuery.trim())}`);
    }
  }

  return (
    <header className="w-full py-6 px-24 flex items-center justify-between bg-[#A3D7EB]">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logoIN} alt="logoIn" className="h-24 w-auto" />
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-8">
        {/* Search */}
        <div className="relative flex items-center">
          <Input
            type="search"
            value={headerQuery}
            onChange={(e) => setHeaderQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onClick={() => router.push("/pesquisa")}
            className="w-75 h-15 rounded-full bg-[#FFFFFFA3] border pr-10 focus-visible:ring-0"
          />
          <Search className="w-8 h-8 absolute right-3 text-gray-500 border-none pointer-events-none" />
        </div>
        
        {/* User Profile */}
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none rounded-full overflow-hidden">
              <Image src={userIcon} alt="userIcon"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#f3f4fa] border-none shadow-md rounded-xl p-2 mt-2">
              <Link href={`/userProfile/${session.user.id}`} className="w-full">
                <DropdownMenuItem className="cursor-pointer gap-3 py-2 hover:bg-white focus:bg-white rounded-lg transition-colors">
                  <Image src={userIcon} alt="userIcon" className="w-5 h-5 object-contain opacity-70" />
                  <span className="font-medium text-gray-800">Meu Perfil</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/favorites" className="w-full">
                <DropdownMenuItem className="cursor-pointer gap-3 py-2 hover:bg-white focus:bg-white rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-800">Curtidos</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/watched" className="w-full">
                <DropdownMenuItem className="cursor-pointer gap-3 py-2 hover:bg-white focus:bg-white rounded-lg transition-colors">
                  <Eye className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-800">Assistidos</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/avaliacoes" className="w-full">
                <DropdownMenuItem className="cursor-pointer gap-3 py-2 hover:bg-white focus:bg-white rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-800">Avaliações</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="cursor-pointer gap-3 py-2 text-red-500 focus:text-red-500 hover:bg-red-50 focus:bg-red-50 rounded-lg transition-colors mt-1"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="rounded-full font-semibold border-white/50 bg-white/50 hover:bg-white/80">
              Entrar
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
