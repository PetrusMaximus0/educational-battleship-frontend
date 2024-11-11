import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ErrorPage from './pages/ErrorPage'
import TagSetupPage from "./pages/TagSetupPage.tsx";
import ShipSetupPage from "./pages/ShipSetupPage.tsx";
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
        path: "/game/ship-setup/:id",
        element: <ShipSetupPage/>
    },
    {
        path: "/game/client/connect/:id",
        element: <ClientConnectRedirect/>
    },
    {
        path: "/game/join/:id",
        element: <GamePage/>
    },
    {
        path: "/*",
        element: <ErrorPage />
    }
]