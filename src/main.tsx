import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './Routes'

const browserRouter = createBrowserRouter(routes);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={browserRouter} />
    </StrictMode>,
)
