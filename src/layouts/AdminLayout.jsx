import { Outlet } from "react-router-dom";
import Navbar from "../models/admin/common/Navbar";
import Sidebar from "../models/admin/common/Sidebar";

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <section className="grid min-h-screen grid-cols-12 pt-20">
                {/* Sidebar */}
                <aside className="col-span-2">
                    <Sidebar />
                </aside>

                {/* Main */}
                <div className="col-span-10 min-w-0 p-4">
                    <main className="min-h-[calc(100vh-5rem)] w-full rounded-sm bg-black/5">
                        <Outlet />
                    </main>
                </div>
            </section>
        </div>
    );
};

export default AdminLayout;