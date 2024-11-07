import {createBrowserRouter} from "react-router-dom";
import Home from "../Pages/Home/Home";
import Root from "../Layout/Root";


export const router = createBrowserRouter([{
    path: "/",
    element: <Root/>,
    errorElement: <p>Error</p>,
    children: [
        {
            path: "/",
            element: <p>Home</p>,
        },
        
    ],
}]);