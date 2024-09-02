import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./App.css"
import "bootstrap/dist/css/bootstrap.css"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

//document.body.style.padding = "30px" // Aggiungi padding al body

import Home from "./components/Home.tsx"
import LoginForm from "./components/auth/LoginForm.tsx"
import RegistrationForm from "./components/auth/RegistrationForm.tsx"
import Users from "./components/users/Users.tsx"
import Navbar from "./components/Navbar.tsx"
import Footer from "./components/Footer.tsx"
import NotFoundPage from "./components/NotFoundPage.tsx"
import Courses from "./components/courses/Courses.tsx"
import Profile from "./components/Profile.tsx"
import Professors from "./components/users/Professors.tsx"
import Students from "./components/users/Students.tsx"
import Enrollments from "./components/enrollments/Enrollments.tsx"
import Files from "./components/files/Files.tsx"
import Reviews from "./components/reviews/Reviews.tsx"

import UserProvider from "./contexts/UserContext.tsx"

const router = createBrowserRouter([
	{ path: "/", element: <App />, errorElement: <NotFoundPage /> },
	{ path: "/home", element: <Home /> },
	{ path: "/login", element: <LoginForm /> },
	{ path: "/registration", element: <RegistrationForm /> },
	// { path: "/users", element: <Users /> }, //Accessibile solo agli admin
	{ path: "/users/:id", element: <Users /> },
	{ path: "/courses", element: <Courses /> },
	{ path: "/courses/:id", element: <Courses /> },
	{ path: "/enrollments", element: <Enrollments /> },
	{ path: "/enrollments/:id", element: <Enrollments /> },
	{ path: "/files", element: <Files /> },
	{ path: "/files/:id", element: <Files /> },
	{ path: "/reviews", element: <Reviews /> },
	{ path: "/reviews/:id", element: <Reviews /> },
	{ path: "/profile", element: <Profile /> },
	{ path: "/professors", element: <Professors /> }, //forse questo non deve essere accessibile direttamente
	{ path: "/students", element: <Students /> }, //forse questo non deve essere accessibile direttamente
])

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UserProvider>
			<div
				className="d-flex flex-column min-vh-100"
				data-bs-theme="light"
			>
				<Navbar />

				<Container>
					<Row>
						<br />
					</Row>
					<Row>
						<Col>
							<RouterProvider router={router} />
						</Col>
					</Row>
				</Container>
				<Footer />
			</div>
		</UserProvider>
	</StrictMode>
)
