import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NotFound from "./Components/NotFound/NotFound";
import Profile from "./Components/Profile/Profile";
import UserContextProvider from "./Context/userContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Components/PostDetails/PostDetails";
import  { Toaster } from "react-hot-toast";
const query = new QueryClient();
function App() {
  const routers = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/postdetails/:id",
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <UserContextProvider>
        <QueryClientProvider client={query}>
          <RouterProvider router={routers}></RouterProvider>
          <Toaster />
        </QueryClientProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
