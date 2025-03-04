import {Link} from "react-router-dom";
import Footer from "../components/Footer.tsx";
import {ReactNode} from "react";

type props = {
    children: ReactNode,
    headerTitle: string,
}

const BaseLayout = ({children, headerTitle} : props) => {
    return(
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 h-full min-h-screen bg-BgB text-white'>
            <header className='bg-BgA py-8 px-8 flex flex-col items-center justify-center gap-6'>
                    <h1 className='text-4xl'> {headerTitle} </h1>
                    <Link
                        className='hover:bg-btnBgHover border border-Text px-4 py-3 bg-btnBg active:bg-btnBgActive rounded-md'
                        to="/"
                    >
                        Return Home
                    </Link>
            </header>
            <main> {children} </main>
            <Footer />
        </div>
    )
}

export default BaseLayout;