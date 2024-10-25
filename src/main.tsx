import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const routes = [
    {
        path: "/",
        element: <h1> Basic Setup </h1>
    }
]

const browserRouter = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={browserRouter} />
    </StrictMode>,
)
