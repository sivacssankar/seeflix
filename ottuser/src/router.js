import { createBrowserRouter } from "react-router-dom";
import Register from "./components/register";
import App from "./App";
import Login from "./components/login";
import Details from "./components/moviedetail";
import Watchlist from "./components/watchlist";
import Homepage from "./components/homepage";
import History from "./components/history";
import ChangePassword from "./components/profile";

const router = createBrowserRouter([
    { path: '', element: <App/> },
    {path:'register',element:<Register/>},
    {path:'login',element:<Login/>},
{path:'movie/:id',element:<Details/>},
{path:'watch',element:<Watchlist/>},
{path:'homepage',element:<Homepage/>},
{path:'history',element:<History/>},
{path:'user',element:<ChangePassword/>},
    
]);

export default router;