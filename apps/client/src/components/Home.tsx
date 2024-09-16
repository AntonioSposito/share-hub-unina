import { Button, Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"

function Home() {
	const navigate = useNavigate()
	const { user } = useContext(UserContext)
	return (
		<Container className="text-center mt-5">
			<img
				src={"./share.png"}
				alt="Share-hub unina Logo"
				className="mb-4"
				style={{ width: "150px", height: "150px" }}
			/>
			<h1 className="mb-4">Share-hub unina</h1>
			{user.id === -1 ? (
				<Button
					variant="primary"
					className="me-3"
					onClick={() => navigate("/login")}
				>
					Login
				</Button>
			) : (
				<>
					<h2 className="mb-4">Benvenuto {user.email}!</h2>
					<Button
						variant="primary"
						className="me-3"
						onClick={() => navigate("/profile")}
					>
						Profilo
					</Button>
				</>
			)}

			{user.id != -1 && (
				<Button
					variant="success"
					onClick={() => navigate("/professors")}
				>
					Lista Professori
				</Button>
			)}
		</Container>
	)
}

export default Home
