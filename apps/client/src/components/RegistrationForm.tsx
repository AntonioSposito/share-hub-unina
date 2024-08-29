import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const BASE_URL_API = import.meta.env.VITE_API_URL

function RegisterForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [lastname, setLastname] = useState("")
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleRegister = async (e: any) => {
		e.preventDefault()
		setError("")
		setSuccess("")

		// Verifica che l'email finisca con "@unina.it" o "@studenti.unina.it"
		const emailRegex = /^[a-zA-Z0-9._%+-]+@(unina\.it|studenti\.unina\.it)$/
		if (!emailRegex.test(email)) {
			setError(
				"L'email deve terminare con '@unina.it' o '@studenti.unina.it'."
			)
			return
		}

		setLoading(true)

		try {
			const response = await axios.post(
				BASE_URL_API + "/auth/signup",
				{
					email,
					password,
					name,
					lastname,
				},
				{ withCredentials: true } // Importante per inviare il cookie
			)
			console.log("Registration response:", response.data.user)

			setSuccess(
				"Registrazione avvenuta con successo! Reindirizzamento in corso..."
			)

			// Reindirizzamento alla pagina di login dopo 3 secondi
			setTimeout(() => {
				navigate("/login")
			}, 3000)
		} catch (error) {
			setError("Registration failed. Please try again.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="register-form">
			<h2>Registrazione nuovo utente</h2>
			<form onSubmit={handleRegister}>
				<div className="mb-3">
					<label className="form-label">Indirizzo email</label>
					<input
						type="email"
						className="form-control"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Password:</label>
					<input
						type="password"
						className="form-control"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Nome:</label>
					<input
						type="text"
						className="form-control"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="mb-3">
					<label className="form-label">Cognome:</label>
					<input
						type="text"
						className="form-control"
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
						required
					/>
				</div>
				{error && <p style={{ color: "red" }}>{error}</p>}
				{success && <p style={{ color: "green" }}>{success}</p>}
				<br />
				<button
					className="btn btn-primary"
					type="submit"
					disabled={loading}
				>
					{loading ? "Registering..." : "Register"}
				</button>
			</form>
		</div>
	)
}

export default RegisterForm
