import GamePage from "./pages/Game/GamePage.tsx"
import HomePage from './pages/Home/HomePage.tsx'
import ErrorPage from './pages/Error/ErrorPage.tsx'
import TagSetupPage from "./pages/TagSetup/TagSetupPage.tsx";

export const routes = [
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/game/tag-setup/",
        element: <TagSetupPage localGame={false}/>
    },
    {
        path: "/game/tag-setup/local",
        element: <TagSetupPage localGame={true}/>
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