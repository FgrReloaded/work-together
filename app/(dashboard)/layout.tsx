import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/orgSidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <main className="h-full">
            <div className="h-full">
                <div className="flex h-full">
                    <OrgSidebar />
                    <div className="h-full flex-1 ">
                        <Navbar />
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
};

export default DashboardLayout;