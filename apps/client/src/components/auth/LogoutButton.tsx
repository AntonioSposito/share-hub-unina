// src/components/LogoutButton.tsx
import React, { useContext } from "react"
import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"

const LogoutButton: React.FC = () => {
	const { setUser } = useContext(UserContext)
	const navigate = useNavigate()

	// Function to handle logout
	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/signout", {
				method: "GET",
				credentials: "include", // Send cookies with the request if necessary
			})

			if (response.ok) {
				// Reset user state
				setUser({
					id: -1,
					email: "prova@dominio.it",
					role: "NESSUN_RUOLO",
				})
				// Remove the user from sessionStorage
				sessionStorage.removeItem("user")
				// Navigate to login page
				navigate("/login")
			} else {
				console.error("Logout failed:", response.statusText)
			}
		} catch (error) {
			console.error("Error during logout:", error)
		}
	}

	return (
		<Button variant="danger" onClick={handleLogout}>
			Logout
		</Button>
	)
}

export default LogoutButton
