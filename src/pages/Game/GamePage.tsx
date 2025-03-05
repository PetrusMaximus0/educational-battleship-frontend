import {useEffect, useState} from "react";
import Footer from "../../components/Footer.tsx";
import {Link, useParams} from "react-router-dom";
import Lobby from "./components/Lobby/Lobby.tsx";
import ShipSetup from "./components/ShipSetup/ShipSetup.tsx";
import {closeHub, getHubConnectionState, invokeHubEvent, joinHub, onHubClose, onHubEvent} from "../../services/gameHub.tsx";
import GameBoard from "./components/GameBoard/GameBoard.tsx";
import SessionError from "./components/Lobby/SessionError.tsx";
import SessionMessage from "./components/Lobby/SessionMessage.tsx";
import {EClientState, EGameState} from "../../enums/Enums.ts";

const GamePage = ()=>{
    // State
    const [clientState, setClientState] = useState<EClientState|null>(null);
    const [gameState, setGameState] = useState<EGameState>(EGameState.Lobby);
    
    //
    const [serverMessage, setServerMessage] = useState<string>("Waiting for server...");
    const [sessionError, setSessionError] = useState<Error | null>(null);
    const [validId, setValidId] = useState<boolean>(true);
    
    // Parameters    
    const { id } = useParams();   
    
    // We don't want this component to mount anything other than an error if it doesn't have a valid id from parameters.
    useEffect(()=>{
        if(id===undefined || id === null) {
            setSessionError(new Error("Invalid session ID"));
            setValidId(false);
        }      
    },[])

    // Handle hub events.
    useEffect(()=>{
        // Handle received errors from the hub
        onHubEvent("Error", (message: string)=> {
            setSessionError(new Error(message));
        })

        // Handle disconnects and reconnects.
        onHubClose(false, ()=> {
            setSessionError(new Error("Lost connection to hub!"))
            setClientState(null);
        })

        // Receive client state update.
        onHubEvent("ClientStateUpdate", (state: number, message: string)=>{
            setClientState(state as EClientState);
            if(message) setServerMessage(message);
            console.log("Client State: ",state); // Need to test this out.
        })

        // Receive game state update. Both clients should receive this at the same time.
        onHubEvent("GameStateUpdate", (state: number, message: string)=>{
            setGameState(state as EGameState);
            if(message) setServerMessage(message);
            console.log("game state: ", state); // Need to test this out.
        })
        
        // Session not found event.
        onHubEvent("SessionNotFound", () => {
            setValidId(false);
            setSessionError(new Error("Session Not Found"));
        })        
    },[])
    
    // Joining the session and reconnecting.
    useEffect(()=>{
        const joinSession = async () => {
            if(getHubConnectionState()!=="Connected") {
                setServerMessage(getHubConnectionState() as string);
                return;
            }
            const {error: joinSessionError} = await invokeHubEvent("JoinSession", id);
            if(joinSessionError) {
                setSessionError(joinSessionError);
                return;
            }
        }

        (async ()=>{
            await joinHub();
            await joinSession();            
        })()
    },[])

    // handle leaving the session
    const leaveSession = async () => {
        await closeHub();
    }
    
    return (
        <div className='grid grid-rows-[auto_1fr_auto] items-start gap-y-2 bg-BgB text-white min-h-screen'>
            <div className='bg-BgA py-8 px-8 '>
                <header className='flex flex-col items-center justify-center gap-6'>
                    <nav>
                        <ul className={"flex justify-center items-center gap-4"}>
                            <li className={""}>
                                <Link
                                    className='hover:bg-btnBgHover border border-Text px-4 py-3 bg-btnBg active:bg-btnBgActive rounded-md'
                                    to="/"
                                    onClick={leaveSession}
                                >
                                    Return Home
                                </Link>
                            </li>
                            <li className={""}>
                                <button
                                    className='hover:bg-btnBgHover border border-Text px-4 py-2.5 bg-btnBg active:bg-btnBgActive rounded-md'
                                >
                                    Help!
                                </button>
                            </li>
                        </ul>
                    </nav>
                </header>
                <div className={"hidden gap-2 w-fit items-center mx-auto my-4"}>
                    Debug Game State   
                    <button className={"px-2 py-1 border"} onClick={()=>setGameState(EGameState.Lobby)}> Lobby </button>
                    <button className={"px-2 py-1 border"} onClick={()=> {
                        setGameState(EGameState.FleetSetup);
                        setClientState(EClientState.FleetSetup);
                    }}> Fleet Set </button>
                    <button className={"px-2 py-1 border"} onClick={()=>setGameState(EGameState.GameOnGoing)}> Ongoing </button>
                    <button className={"px-2 py-1 border"} onClick={()=>setGameState(EGameState.GameOver)}> Game Over </button>
                </div>
                <div className={"hidden gap-2 w-fit items-center mx-auto"}>
                    Client State
                    {
                        gameState === EGameState.FleetSetup && 
                        <>
                            <button className={"px-2 py-1 border"} onClick={()=>setClientState(EClientState.FleetSetup)}> Setting Up Fleet </button>
                            <button className={"px-2 py-1 border"} onClick={()=>setClientState(EClientState.FleetReady)}> Fleet Ready </button>
                        </> 
                        || gameState === EGameState.GameOnGoing && 
                        <>
                            <button className={"px-2 py-1 border"} onClick={()=>setClientState(EClientState.OnTurn)}> On Turn </button>
                            <button className={"px-2 py-1 border"} onClick={()=>setClientState(EClientState.WaitingForTurn)}> Opponent's Turn </button>
                        </>
                        || <p className={"text-red-600"}> NO commands in this context. </p>
                    }       
                    
                </div>
            </div>
            <main className={"relative grid grid-rows-[auto_1fr_auto] gap-y-8 justify-center h-full"}>
                <header className={"flex items-center w-full justify-center py-4 px-8 bg-BgA"}>
                    <h2> 
                    {
                        sessionError && <SessionError error={sessionError!}/>
                        || (clientState == null) && <SessionMessage message={"Attempting to connect to server..."}/>
                        || <SessionMessage message={serverMessage}/>
                    }
                    </h2>                    
                </header>
                {
                    gameState == EGameState.Lobby && <Lobby validId={validId}/> 
                    || gameState == EGameState.FleetSetup && <ShipSetup clientState={clientState}/>
                    || gameState == EGameState.GameOnGoing && <GameBoard playerState={clientState} />
                    || gameState == EGameState.GameOver && <GameBoard playerState={clientState}/>
                }
            </main>
            <Footer/>
        </div>
    )
}

export default GamePage;