import Game from "./pages/Game.tsx"
import HomePage from './pages/HomePage'
import ErrorPage from './pages/ErrorPage'
import TagSetupPage from "./pages/TagSetupPage.tsx";
import ClientConnectRedirect from "./pages/ClientConnectRedirect.tsx";

export const routes = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/game/tag-setup",
        element: <TagSetupPage/>        
    },
    {
        path: "/game/client/connect/:id",
        element: <ClientConnectRedirect/>
    },
    {
        path: "/game/:id",
        element: <Game/>
    },
    {
        path: "/*",
        element: <ErrorPage />
    }
]