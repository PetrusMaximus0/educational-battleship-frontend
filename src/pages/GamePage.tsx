import {Link, useParams} from 'react-router-dom'
import Board from '../components/Board';
import Footer from '../components/Footer';
import {useEffect, useState} from "react";
import {CellData, CellTag, GameData} from "../types.tsx";
import {closeHub, GameHubConnection, joinHub, onHubEvent, invokeHubEvent} from "../hubs/gameHub.tsx";
import {mockGameData} from "../mockGameData.ts";

type Props = {
}

type GameState = "waiting" | "active"; 

const GamePage = ({}: Props) => {
    //
    const [playerBoardData, setPlayerBoardData] = useState<CellData[]>([]);
    const [opponentBoardData, setOpponentBoardData] = useState<CellData[]>([]);
    const [selectedCell, setSelectedCell] = useState<number>(-1);
    const [rowTags, setRowTags] = useState<CellTag[]>([]);
    const [colTags, setColTags] = useState<CellTag[]>([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
    
    //
    const [gameId, setGameId] = useState<string|null>(null);
    const [error, setError] = useState<Error|null>(null);
    const [connection, setConnection] = useState<GameHubConnection|null>(null);
    const [gameState, setGameState] = useState<GameState>("waiting");
    
    //
    const [justCopiedId, setJustCopiedId] = useState(false);
    
    //
    const { id } = useParams();
    
    
    // Handle clicking a cell on the opponents board.
    const handleClickOpponentBoardCell = (index: number) => {
        const newBoardData = [...opponentBoardData];
        if(index===selectedCell){
            // Clicking on the same cell, deselect the cell.
            newBoardData[index].selected = false;
            setSelectedCell(-1);
        }else if(selectedCell !== -1) {
            // Clicking on un selected cell.
            // Deselect previous
            newBoardData[selectedCell].selected = false;

            // Select new
            newBoardData[index].selected = true;
            setSelectedCell(index);
        } else {
            // No cell is selected
            // Select new cell.
            newBoardData[index].selected = true;
            setSelectedCell(index);
        }

        // Set board state.
        setOpponentBoardData(newBoardData);
    }
    
    // Handle clicking a cell on the player's board.
    const handleClickPlayerBoardCell = (index: number) => {
        console.log(index);
    }

    const updateBoardState = (gameData: GameData) => {
        //
        if (selectedCell!==-1){
            gameData.opponentBoardData[selectedCell].selected = true;
        }
        
        // Set the css property for the row and col number
        document.documentElement.style.setProperty("--columns", gameData.colTags.length.toString());
        document.documentElement.style.setProperty("--rows", gameData.rowTags.length.toString());

        // Obtain and set the row and col tags.
        setRowTags([...gameData.rowTags]);
        setColTags([...gameData.colTags]);

        // Set the board data as state.
        setPlayerBoardData([...gameData.playerBoardData]);
        setOpponentBoardData([...gameData.opponentBoardData]);
        
        // Set the Game ID
        setGameId(gameData.gameId);
        
        // Set is player Turn
        setIsPlayerTurn(gameData.playerTurn);
    }
    
    const handleFireAtCell = (index: number) => {
        // send cell shot to server and receive new cell state.
        alert(`Fired! at index: ${index} `);
    }
    
    const endServerConnection = async () => {
        //
        try {
            if(!connection) {
                throw new Error("connection is null when attempting to close server connection");
            }
            const result = await closeHub();
            console.log("Result: ", result);
            console.log("closed connection");
            
        }catch(err){
            console.log("At end server connection...")
            setError(err as Error);
        }    
    }
    
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
    
    useEffect(()=>{
        const initHubConnection = async () => {
            const {connection: conn, error: connectionError} = await joinHub();
            if(connectionError){
                setError(connectionError);
                return;
            }
            setConnection(conn);                
            
            // Register an event handler for event ReceiveSessionId.
            onHubEvent("ReceiveSessionId", (gameId : string) => {
                //
                mockGameData.gameId = gameId;
                
                // Set the Game ID
                setGameId(mockGameData.gameId);
                
                //updateBoardState({...gameData});  
            })
            
            // Register an event for event onBoardUpdate.
            onHubEvent("onBoardUpdate", (newGameData: GameData)=>{
                updateBoardState(newGameData);
            });
            
            onHubEvent("BeginGameSetup", (boardData: CellData[]) => {
                alert("Received Begin Game Setup!");
                console.log(boardData);
                // Skip the ship placement! Mark Ready for game!
                invokeHubEvent("ClientReady");
            })
            
            if(id===undefined){
                // Invoke the new game event from the game hub.
                const {error: newGameError} = await invokeHubEvent("RequestNewSession", mockGameData.colTags, mockGameData.rowTags);
                if(newGameError) {
                    setError(newGameError);
                    return;
                }
            }else{
                // Attempt to join an ongoing session by id.
                const {error: joinGameError} = await invokeHubEvent("JoinExistingSession", id);
                if(joinGameError) {
                    setError(joinGameError);
                    return;
                }
            }
            
            setError(null);
        }

        (async () => {
                const {error: joinGameError} = await invokeHubEvent("JoinExistingSession", id);
                if (joinGameError) {
                    setError(joinGameError);
                }
            }
        )();
        
        return ()=>{
            // Clean up
        }
    },[])
    
    return (
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 min-h-screen bg-BgB text-white'>
            <div className='bg-BgA py-8 px-8'>
                <header className='flex flex-col items-center justify-center gap-6'>
                    <h1 className='text-4xl'> Current Game: <span className='font-bold'> {gameId || "Connecting..."} </span> </h1>
                    <nav>
                        <ul className={"flex justify-center items-center gap-4"}>
                            <li className={""}>
                                <Link
                                    className='hover:bg-btnBgHover border border-Text px-4 py-3 bg-btnBg active:bg-btnBgActive rounded-md'
                                    to="/"
                                    onClick={endServerConnection}
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
            </div>
            <main>
                {
                   error &&
                    <section className='flex flex-col gap-4 justify-center items-center'>                        
                        <h2 className={"text-4xl"}> 
                            The game couldn't be started.
                        </h2>
                        <p>                            
                            <span className={"font-bold"}> Reason: </span> {error.message} 
                        </p> 
                    </section>
                    || gameState === "active" &&
                    <section className={"text-center"}>
                        <h2 className={"text-4xl py-4 my-4 bg-BgA"}> {isPlayerTurn ? "Your Turn to play!" : "Opponent's Turn to play" } </h2>
                        <div className='flex gap-4 justify-center items-center'>
                            <Board
                                onClickCell={handleClickPlayerBoardCell}
                                onFireAtCell={handleFireAtCell}
                                boardTitle={"Your Ships"}
                                rowTags={rowTags}
                                colTags={colTags}
                                cellData={playerBoardData}
                            />
                            <Board
                                onClickCell={handleClickOpponentBoardCell}
                                onFireAtCell={handleFireAtCell}
                                boardTitle={"Opponent's Ships"}
                                rowTags={rowTags}
                                colTags={colTags}
                                cellData={opponentBoardData}
                            />
                        </div>
                    </section>
                    || gameState === "waiting" &&
                    <section className={"text-center"}>
                        <h2> Waiting for player to join... </h2>
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
                                    {justCopiedId? "Copied!" : "Copy ID"}
                                </button>

                            </div>
                        </div>
                    </section>
                }
            </main>
            <Footer/>
        </div>
    )
}

export default GamePage