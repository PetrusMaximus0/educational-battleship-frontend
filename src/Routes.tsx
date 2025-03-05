import GamePage from "./pages/Game/GamePage.tsx"
import HomePage from './pages/Home/HomePage.tsx'
import ErrorPage from './pages/Error/ErrorPage.tsx'
import TagSetupPage from "./pages/TagSetup/TagSetupPage.tsx";
import ClientConnectRedirectPage from "./pages/ClientConnectRedirect/ClientConnectRedirectPage.tsx";

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
        element: <ClientConnectRedirectPage/>
    },
    {
        path: "/game/:id",
        element: <GamePage/>
    },
    {
        path: "/*",
        element: <ErrorPage />
    },
]