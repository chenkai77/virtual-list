import { createBrowserRouter } from "react-router-dom";
import VirtualList from "../pages/listOptimization/virtualList";
import VirtualListIO from "../pages/listOptimization/virtualListIO";
import OrdinaryList from "../pages/listOptimization/ordinaryList";
import VirtualDynamicList from "../pages/listOptimization/virtualDynamicList";
import App from "../App";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "ordinary_list",
        element: <OrdinaryList />,
      },
      {
        path: "virtual_list",
        element: <VirtualList />,
      },
      {
        path: "virtual_list_io",
        element: <VirtualListIO />,
      },
      {
        path: "virtual_dynamic_list",
        element: <VirtualDynamicList />,
      },
    ],
  },
]);

export default routes;
