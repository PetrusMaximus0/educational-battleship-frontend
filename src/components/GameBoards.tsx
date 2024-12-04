import Board from "./Board.tsx";
import {useEffect, useState} from "react";
import {CellData} from "../common/types.tsx";
import {useParams} from "react-router-dom";
import {EClientState} from "../common/Enums.ts";
import {invokeHubEvent, offHubEvent, onHubEvent} from "../hubs/gameHub.tsx";
import ShotPrompt from "./ShotPrompt.tsx";

type props = {
    playerState : EClientState | null,
}

const GameBoards = ({playerState} : props) => {
    const [error, setError] = useState<Error | null>(null);    
    //
    const [rowTags, setRowTags] = useState<string[]>([]);
    const [colTags, setColTags] = useState<string[]>([]);
    const [playerBoardData, setPlayerBoardData] = useState<CellData[]>([]);
    const [opponentBoardData, setOpponentBoardData] = useState<CellData[]>([]);
    const [confirmRowTag, setConfirmRowTag] = useState<string>("");
    const [confirmColTag, setConfirmColTag] = useState<string>("");
    
    //    
    const [selectedCell, setSelectedCell] = useState<number>(-1);
    //
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
    const handleFireAtCell = async (index: number) => {
        // If it is not the player's turn then return.
        if(playerState !== EClientState.OnTurn) return;
        
        // set the tags and return from the function if the index is invalid.
        if(!setConfirmTagsFromIndex(index, rowTags.length, colTags.length)) return;        
        
        // Send cell shot to server.
        const {error: hubError} = await invokeHubEvent("RequestShot", id, index);        
        if(hubError){
            setError(hubError);
        }
    }     
    const handleApproveShot = async () => {//
        const {error: hubError} = await invokeHubEvent("ApproveShot", id);
        if(hubError) setError(hubError);       
        setConfirmRowTag("");
        setConfirmColTag("");
    }
    const setConfirmTagsFromIndex = (index: number, height: number, width: number) =>{
        const x = index % width;
        const y = Math.floor(index/width);
                
        if(x < 0 || x >= width) {
            setError(new Error("Invalid Shot Coordinates to Approve, X is out of bounds."));
            return false;
        }
        if(y < 0 || y >= height){
            setError(new Error("Invalid Shot Coordinates to Approve. Y is out of bounds."));
            return false;
        }
        
        setConfirmRowTag(rowTags[y]);
        setConfirmColTag(colTags[x]);
        
        return true;
    }
    
    // Register hub event handlers.
    useEffect(()=>{
        const handleGameBoardsInit = (rowTags: string[], colTags: string[], playerBoardData: CellData[], opponentBoardData: CellData[]) => {
            setPlayerBoardData(playerBoardData);
            setOpponentBoardData(opponentBoardData);
            setRowTags(rowTags);
            setColTags(colTags);

            // Set the css property for the row and col number
            document.documentElement.style.setProperty("--columns", colTags.length.toString());
            document.documentElement.style.setProperty("--rows", rowTags.length.toString());
        }
        
        const handleUpdateGameBoards = (playerBoard: CellData[], opponentBoard : CellData[]) => {
            setPlayerBoardData(playerBoard);
            setOpponentBoardData(opponentBoard);
        }
        
        onHubEvent("GameBoardsInit", handleGameBoardsInit);
        onHubEvent("UpdateBoards", handleUpdateGameBoards);       
    },[])
    
    //
    useEffect(()=>{
        const handleReceiveIndexToApprove = (index: number, width: number, height: number) => {
            setConfirmTagsFromIndex(index, height, width);
        }
        onHubEvent("ReceiveIndexToApprove", handleReceiveIndexToApprove);
        
        return ()=>{
            offHubEvent("ReceiveIndexToApprove", handleReceiveIndexToApprove);
        }
    },[rowTags, colTags]);

    // Initialize the boards at game start.
    useEffect(()=>{
        (async ()=>{
            const { error: hubError } = await invokeHubEvent("BeginGame", id);
            if(hubError) setError(hubError);
        })()        
    },[])
    
    return (
        <section className={"text-center"}>
            <h2 className={"text-4xl py-4 my-4 bg-BgA relative min-h-44 flex items-center justify-center"}> 
                {
                    error && <span className={"text-red-600"}> {error.message} </span>
                    || playerState===EClientState.OnTurn && "Your turn!" 
                    || playerState===EClientState.WaitingForTurn && "Opponent's Turn!"
                    || playerState===EClientState.ApprovingShot && <ShotPrompt rowTag={confirmRowTag} colTag={confirmColTag} onClick={handleApproveShot} />
                    || playerState===EClientState.PendingShotApproval && `${confirmColTag} ... ${confirmRowTag}`
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