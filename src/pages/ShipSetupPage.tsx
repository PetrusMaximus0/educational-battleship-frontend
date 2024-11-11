import {Link, useParams} from "react-router-dom";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import {invokeHubEvent, onHubEvent} from "../hubs/gameHub.tsx";

const ShipSetupPage = () => {    
    //
    const [justCopiedId, setJustCopiedId] = useState(false);
    const [waitingForPlayers, setWaitingForPlayers] = useState(true);
    const [error, setError] = useState<Error|null>(null);
    //
    const { id } = useParams();

    //
    let timerHandler = 0;
    const handleCopyId = async () => {
        if(id!==undefined) {
            // Copy Session ID to the clipboard.
            await navigator.clipboard.writeText(id);
            setJustCopiedId(true);

            // Set a small timer to change the text of the button.
            clearTimeout(timerHandler);
            timerHandler = setTimeout(() =>{
                setJustCopiedId(false);
            }, 5000)
        }
    }
    
    const leaveSession = async () => {
        await invokeHubEvent("LeaveSession");
    }
    
    useEffect(() => {
        const joinSession = async () => {
            const {error: joinSessionError} = await invokeHubEvent("JoinExistingSession", id);
            if(joinSessionError) {
                setError(joinSessionError);
                return;
            }            
        }
        onHubEvent("BeginGameSetup", () => {
            setWaitingForPlayers(false);
        })
        
        onHubEvent("Error", (message: string)=> {
            setError(new Error(message));
        })
        
        joinSession();        
    },[])
    
    //
    return <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 min-h-screen bg-BgB text-white'>
        <header className='bg-BgA py-8 px-8'>
            <div className='flex flex-col items-center justify-center gap-6'>
                <h1 className='text-4xl'> Game Setup </h1>
                <nav>
                    <ul className={"flex justify-center items-center gap-4"}>
                        <Link
                            className='hover:bg-btnBgHover border border-Text px-4 py-3 bg-btnBg active:bg-btnBgActive rounded-md'
                            to="/"
                            onClick={leaveSession}
                        >
                            Return Home
                        </Link>
                    </ul>
                </nav>
            </div>
        </header>
        <main className={"flex flex-col gap-3 justify-start items-center w-fit mx-auto"}>
            {
                error &&  <h2 className={"mb-4 text-xl text-red-600"} > {error.message} </h2>
                || waitingForPlayers && <section className={"text-center"}>
                <h2 className={"mb-4 text-xl"}> Waiting for player to join... </h2>
                <div className={"text-center"}>
                    <h2 className={"mb-4 text-xl"}> Your session ID: </h2>
                    <div className={"flex gap-2 justify-center items-center"}>
                        <p
                            className={"my-2 flex gap-2 justify-center items-center"}
                        >
                            {id}
                        </p>
                        <button
                            className={"hover:bg-btnBgHover active:bg-btnBgActive border px-3 py-2 rounded-sm"}
                            onClick={handleCopyId}
                        >
                            {justCopiedId ? "Copied!" : "Copy ID"}
                        </button>

                    </div>
                </div>
            </section> ||
            <section>
                All players connected. Show Board to setup ships!
            </section>
            }
        </main>
        <Footer/>
    </div>
    
}
export default ShipSetupPage;