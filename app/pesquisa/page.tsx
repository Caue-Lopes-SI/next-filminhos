import { Suspense } from "react";
import { SearchPage } from "@/components/search/SearchPage";

export default function Pesquisa() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchPage />
    </Suspense>
  );
}
