import { useState } from "react"
import axios from "axios"

function LoginForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const handleLogin = async (e: any) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		try {
			await axios.post(
				"http://localhost:3000/api/auth/signin",
				{
					email,
					password,
				},
				{ withCredentials: true }
			) // Importante per inviare il cookie

			// Reindirizza o aggiorna lo stato dell'app
			console.log("Login successful!")
		} catch (error) {
			setError("Email or password is incorrect")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="login-form">
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div className="mb-3">
					<label className="form-label">Email address</label>
					<input
						type="email"
						className="form-control"
						id="exampleInputEmail1"
						aria-describedby="emailHelp"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<div id="emailHelp" className="form-text">
						We'll never share your email with anyone else.
					</div>
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
				<button
					className="btn btn-primary"
					type="submit"
					disabled={loading}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	)
}

export default LoginForm
