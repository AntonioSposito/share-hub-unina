import { useEffect, useState } from "react"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "../../contexts/UserContext"
import { useNavigate } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_FRONTEND_URL

function LoginForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const { user, setUser } = useContext(UserContext)
	const navigate = useNavigate()

	const handleLogin = async (e: any) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		try {
			const response = await axios.post(
				"http://localhost:3000/api/auth/signin",
				{
					email,
					password,
				},
				{ withCredentials: true } // Importante per inviare il cookie
			)
			setUser(response.data.user)
			navigate("/profile")
		} catch (error) {
			setError("Email or password is incorrect")
		} finally {
			setLoading(false)
		}
	}

	// Verifica l'ID utente e reindirizza a /profile se l'utente è già loggato
	useEffect(() => {
		if (user.id !== -1) {
			navigate("/profile")
		}
	}, [user, navigate])

	return (
		<div className="login-form">
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div className="mb-3">
					<label className="form-label">Indirizzo email</label>
					<input
						type="email"
						className="form-control"
						id="exampleInputEmail1"
						aria-describedby="emailHelp"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label className="form-label">Password:</label>
					<input
						type="password"
						className="form-control"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p style={{ color: "red" }}>{error}</p>}
				<br />
				<button
					className="btn btn-primary"
					type="submit"
					disabled={loading}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
				<br />
				<br />
				<a href={`${BASE_URL}/registration`}>
					Registrazione nuovo utente
				</a>
			</form>
		</div>
	)
}

export default LoginForm
