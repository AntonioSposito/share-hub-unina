// src/components/LogoutButton.tsx
import React, { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"

const LogoutButton: React.FC = () => {
	const { setUser } = useContext(UserContext)

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
				window.location.href = "/login"
			} else {
				console.error("Logout failed:", response.statusText)
			}
		} catch (error) {
			console.error("Error during logout:", error)
		}
	}

	return <a onClick={handleLogout}>Logout</a>
}

export default LogoutButton
