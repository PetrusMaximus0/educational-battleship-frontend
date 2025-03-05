import Footer from "../../components/Footer.tsx";
import { Link } from "react-router-dom";
import Lobby from "./components/Lobby/Lobby.tsx";
import ShipSetup from "./components/ShipSetup/ShipSetup.tsx";
import GameBoard from "./components/GameBoard/GameBoard.tsx";
import SessionError from "./components/Lobby/SessionError.tsx";
import SessionMessage from "./components/Lobby/SessionMessage.tsx";
import {EGameState} from "../../enums/Enums.ts";
import useGameHub from "./hooks/useGameHub.tsx"

const GamePage = ()=>{
    // State
    const {leaveSession, clientState, gameState, validId, sessionError, serverMessage} = useGameHub();

    return (
        <div className='grid grid-rows-[auto_1fr_auto] items-start gap-y-2 bg-BgB text-white min-h-screen'>
            <header className='flex flex-col items-center justify-center gap-6 bg-BgA py-8 px-8 '>
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
            <main className={"relative grid grid-rows-[auto_1fr_auto] gap-y-8 justify-center h-full"}>
                <header className={"flex items-center w-full justify-center py-4 px-8 bg-BgA"}>
                    <h2> 
                    {
                        sessionError && <SessionError error={sessionError}/>
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