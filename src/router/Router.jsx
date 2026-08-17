import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../models/admin/pages/Dashboard";

const Router = createBrowserRouter([
    {
        path:'/panel',
        Component: AdminLayout,
        children:[
            {
                path:'',
                Component:Dashboard,
            }
        ]
    }
]);

export default Router;