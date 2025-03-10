"use client";

import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/emptyOrg";
import { BoardList } from "./_components/boardList";
import { useSearchParams } from "next/navigation";

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
};

const DashboardPage = ({
  searchParams,
}: DashboardPageProps) => {
  const { organization } = useOrganization();
  const params = useSearchParams();
  const search = params.get("search");
  const favorites = params.get("favorites");
  searchParams = {
    search: search || searchParams.search,
    favorites: favorites || searchParams.favorites,
  };

  return ( 
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
       ) : ( 
         <BoardList
           orgId={organization.id}
           query={searchParams} 
         />
       )} 
    </div>
   );
};
 
export default DashboardPage;