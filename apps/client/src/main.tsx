import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "bootstrap/dist/css/bootstrap.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./components/Home.tsx"
import LoginForm from "./components/LoginForm.tsx"
import Users from "./components/Users.tsx"
import User from "./components/User.tsx"
import Navbar from "./components/Navbar.tsx"
import Footer from "./components/Footer.tsx"
import NotFoundPage from "./components/NotFoundPage.tsx"
import Courses from "./components/Courses.tsx"

const router = createBrowserRouter([
	{ path: "/", element: <App />, errorElement: <NotFoundPage /> },
	{ path: "/home", element: <Home /> },
	{ path: "/login", element: <LoginForm /> },
	{ path: "/users", element: <Users /> },
	{ path: "/users/:id", element: <User /> },
	{ path: "/courses", element: <Courses /> },
])

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Navbar />
		<RouterProvider router={router} />
		<Footer />
	</StrictMode>
)
