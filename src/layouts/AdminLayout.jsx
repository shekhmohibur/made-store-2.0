import { Outlet } from "react-router-dom";
import Navbar from "../models/admin/common/Navbar";
import Sidebar from "../models/admin/common/Sidebar";

const AdminLayout = () => {
    return (
        <div>
            <header>
                <Navbar/>
            </header>
            <Sidebar/>
            <main>
                <Outlet/>
            </main>
        </div>
    );
};

export default AdminLayout;