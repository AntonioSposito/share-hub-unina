import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useState,
} from "react"

// Definizione del tipo per l'utente
export type User = {
	id: number
	email: string
	role: string
}

// Interfaccia per il contesto utente
export interface UserContextInterface {
	user: User
	setUser: Dispatch<SetStateAction<User>>
}

// Stato di default nel contesto
const defaultState = {
	user: {
		id: -1,
		email: "prova@dominio.it",
		role: "NESSUN_RUOLO",
		name: "NESSUN_NOME",
		lastname: "NESSUN_COGNOME",
	},
	setUser: (_user: User) => {},
} as UserContextInterface

// Creazione del contesto
export const UserContext = createContext(defaultState)

type UserProviderProps = {
	children: ReactNode
}

export default function UserProvider({ children }: UserProviderProps) {
	// Recupera lo stato dell'utente dal sessionStorage, se esiste
	const [user, setUser] = useState<User>(() => {
		const savedUser = sessionStorage.getItem("user")
		return savedUser
			? JSON.parse(savedUser)
			: {
					id: -1,
					email: "prova@dominio.it",
					role: "NESSUN_RUOLO",
					name: "NESSUN_NOME",
					lastname: "NESSUN_COGNOME",
				}
	})

	// Salva lo stato dell'utente nel sessionStorage ogni volta che cambia
	useEffect(() => {
		sessionStorage.setItem("user", JSON.stringify(user))
	}, [user])

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	)
}
