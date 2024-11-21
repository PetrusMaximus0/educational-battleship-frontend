import Board from "./Board.tsx";
import {useEffect, useState} from "react";
import {CellData, CellTag} from "../types.tsx";
import {useParams} from "react-router-dom";
import {EClientState} from "../pages/Game.tsx";
import {invokeHubEvent, onHubEvent} from "../hubs/gameHub.tsx";
import {mockGameData, mockStartGameData} from "../mockGameData.ts";

type props = {
    playerState : EClientState,
}

const GameBoards = ({playerState} : props) => {
    //
    const [playerBoardData, setPlayerBoardData] = useState<CellData[]>([]);
    const [opponentBoardData, setOpponentBoardData] = useState<CellData[]>([]);
    const [selectedCell, setSelectedCell] = useState<number>(-1);
    const [rowTags, setRowTags] = useState<CellTag[]>([]);
    const [colTags, setColTags] = useState<CellTag[]>([]);
    const {id} = useParams();
    
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

    const handleFireAtCell = (index: number) => {
        if(playerState !== EClientState.OnTurn) return;

        // send cell shot to server and receive new cell state.
        alert(`Fired! at index: ${index} `);
    }     
    
    // Register hub event handlers.
    useEffect(()=>{
        const handleGameBoardsInit = (rowTags: string[], colTags: string[], playerBoardData: CellData[], opponentBoardData: CellData[]) => {
            setPlayerBoardData(playerBoardData);
            setOpponentBoardData(opponentBoardData);
            setRowTags(rowTags);
            setColTags(colTags);
        }
        
        const handleUpdateGameBoards = (playerBoard: CellData[], opponentBoard : CellData[]) => {
            setPlayerBoardData(playerBoard);
            setOpponentBoardData(opponentBoard);
        }

        onHubEvent("GameBoardsInit", handleGameBoardsInit)
        onHubEvent("UpdateBoards", handleUpdateGameBoards)   
        
        // FOR DEBUGGING
        handleGameBoardsInit(mockGameData.rowTags, mockGameData.colTags, mockStartGameData.playerBoardData, mockStartGameData.opponentBoardData)        
    },[])
    
    // Initialize the boards at game start.
    useEffect(()=>{
        (async ()=>{
            const { error: hubError } = await invokeHubEvent("RequestBoardsInit", id);
            if(hubError){
                alert(`${hubError.message}`);
            }
        })()        
    },[])
        
    useEffect(()=>{
        
    },[playerState])
    
    return (
        <section className={"text-center"}>
            <h2 className={"text-4xl py-4 my-4 bg-BgA"}> 
                {
                    playerState===EClientState.OnTurn && "Your turn!" 
                    || playerState===EClientState.WaitingForTurn && "Opponent's Turn!"
                    || "Starting Game"
                }
            </h2>
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
    )
}

export default GameBoards