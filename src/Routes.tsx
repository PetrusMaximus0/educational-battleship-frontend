import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ErrorPage from './pages/ErrorPage'

export const routes = [
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/game/host",
        element: <GamePage />
    },
    {
        path: "/game/join/:id",
        element: <GamePage />
    },
    {
        path: "/*",
        element: <ErrorPage />
    }
]