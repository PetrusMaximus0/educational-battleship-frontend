import {Link, useNavigate, useParams} from "react-router-dom";
import Footer from "../../components/Footer.tsx";
import {useEffect, useState} from "react";
import {joinHub} from "../../services/gameHub.tsx";

const ClientConnectRedirectPage = () => {
    const [error, setError] = useState<Error|null>(null);
    const navigate = useNavigate();
    const {id} = useParams();

    const initHubConnection = async () => {
        const {error: connectionError} = await joinHub();
        if(connectionError){
            setError(connectionError);
            return;
        }
        
        navigate(`/game/${id}`);
    }
    useEffect(() => {
        (async ()=>{
            await initHubConnection();            
        })()        
    },[])
    
    
    return <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 h- min-h-screen bg-BgB text-white'>
        <header className='bg-BgA py-8 px-8'>
            <div className='flex flex-col items-center justify-center gap-6'>
                <h1 className='text-4xl'> Game Setup </h1>
                <nav>
                    <ul className={"flex justify-center items-center gap-4"}>
                        <Link
                            className='hover:bg-btnBgHover border border-Text px-4 py-3 bg-btnBg active:bg-btnBgActive rounded-md'
                            to="/"
                        >
                            Return Home
                        </Link>
                    </ul>
                </nav>
            </div>
        </header>
        <main className={"flex flex-col gap-3 justify-start items-center w-fit mx-auto"}>
            <section className='flex flex-col justify-start gap-6'>
                {error &&
                    <h2 className={"text-red-600 font-semibold mx-auto text-center text-xl"}>
                        {error.message}
                    </h2> ||
                    <h2 className={"text-4xl text-center"}> Connecting... </h2>
                }
            </section>
        </main>
        <Footer/>
    </div>
}
export default ClientConnectRedirectPage