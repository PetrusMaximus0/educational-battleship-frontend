import {Link} from 'react-router-dom'
import Board from '../components/Board';
import Footer from '../components/Footer';
import {useEffect, useState} from "react";
import {CellData, CellTag} from "../types.tsx";
import {closeHub, GameHubConnection, joinHub, onHubEvent, triggerHubEvent} from "../hubs/gameHub.tsx";
import {inColTags, inRowTags, getBoardData}from "../mockGameData.ts";

type Props = {

}

const GamePage = ({}: Props) => {
    //
    const [playerBoardData, setPlayerBoardData] = useState<CellData[]>([]);
    const [opponentBoardData, setOpponentBoardData] = useState<CellData[]>([]);
    const [selectedCell, setSelectedCell] = useState<number>(-1);
    const [rowTags, setRowTags] = useState<CellTag[]>([]);
    const [colTags, setColTags] = useState<CellTag[]>([]);
    
    //
    const [gameId, setGameId] = useState<string|null>(null);
    const [error, setError] = useState<Error|null>(null);
    const [connection, setConnection] = useState<GameHubConnection|null>(null);
    
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
    
    // Initialize the board at game begin.
    const initBoards = () =>{
            // Set the css property for the row and col number
            document.documentElement.style.setProperty("--columns", inColTags.length.toString());
            document.documentElement.style.setProperty("--rows", inRowTags.length.toString());

            // Obtain and set the row and col tags.
            setRowTags([...inRowTags]);
            setColTags([...inColTags]);

            // Set the board data as state.
            setPlayerBoardData([...getBoardData()]);
            setOpponentBoardData([...getBoardData()]);
            //
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
    
    useEffect(()=>{
        const initHubConnection = async () => {
            const {connection: conn, error: connectionError} = await joinHub();
            if(connectionError){
                setError(connectionError);
                return;
            }
            setConnection(conn);                
            
            // Set up handlers
            onHubEvent("onGameStart", (gameId : string) => {
                setGameId(gameId);
            })
            
            const {error: newGameError} = await triggerHubEvent("NewGame");
            
            if(newGameError) {
                setError(newGameError);
                return;
            }
            setError(null);
        }
        
        (async ()=>{
            await initHubConnection();
            initBoards();
        })()
        
        return ()=>{
            // Clean up
            (async ()=>{
                await endServerConnection();
                console.log("Clean up finished");
            })();
        }
    },[])
    
    return (
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 h- min-h-screen bg-BgB text-white'>
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
                    <div className='flex flex-col gap-4 justify-center items-center'>                        
                        <h1 className={"text-4xl"}> 
                            The game couldn't be started.
                        </h1>
                        <p>                            
                            <span className={"font-bold"}> Reason: </span> {error.message} 
                        </p> 
                    </div>
                    || 
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
                }
            </main>
            <Footer />
        </div>
    )
}

export default GamePage