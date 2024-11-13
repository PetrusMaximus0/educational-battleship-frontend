import {Link, useParams} from "react-router-dom";
import Footer from "../components/Footer.tsx";
import {useEffect, useState} from "react";
import {invokeHubEvent, onHubEvent} from "../hubs/gameHub.tsx";
import {CellData, ShipData} from "../types.tsx";
import Board from "../components/Board.tsx";
import {mockGameData, mockShipData} from "../mockGameData.ts";
import Ship from "../components/Ship.tsx";

type SetupState = "waiting for players" | "placing ships" | "ships placed" | "player ready";

const ShipSetupPage = () => {    
    //
    const [justCopiedId, setJustCopiedId] = useState(false);
    const [error, setError] = useState<Error|null>(null);    
    const [gameSetupState, setGameSetupState] = useState<SetupState>("waiting for players");
    
    //
    const { id } = useParams();

    //
    const [rowTags, setRowTags] = useState<string[]>([...mockGameData.rowTags]);
    const [colTags, setColTags] = useState<string[]>([...mockGameData.colTags]);
    const [cellData, setCellData] = useState<CellData[]>([...mockGameData.playerBoardData]);

    //
    const [shipData, setShipData] = useState<ShipData[]>([...mockShipData]);
    const [selectedShip, setSelectedShip] = useState<ShipData|null>(null);
    const [placedShips, setPlacedShips] = useState<ShipData[]>([]); 
    
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

    // Returns true if the current ship placement is valid, and false otherwise.
    const validateShipPlacement = (candidateShip: ShipData, placementCoordinates: number[]) => {
        const inBounds = (coord: number, ort: number, len: number, boardDim: number) => {
            return coord >= 0
                && coord <= boardDim
                && coord + ort * len <= boardDim
                && coord + ort * len >= 0;
        }
        
        // By storing ship part positions it's possible to simply calculate the manhattan distance to every ship part 
        // and check if it is greater to one, in which case the placement is valid.
        const noNeighbors = (newCoords: number[]) => {
            const height = rowTags.length;
            const width = colTags.length;            
            
            // Check horizontal
            let tempCoords = [newCoords[0], newCoords[1] - 1];
            if (tempCoords[1] >= 0 && tempCoords[1] < height) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            //
            tempCoords = [newCoords[0], newCoords[1] + 1];
            if (tempCoords[1] >= 0 && tempCoords[1] < height) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            // Check vertical
            tempCoords = [newCoords[0] - 1, newCoords[1]];
            if (tempCoords[0] >= 0 && tempCoords[0] < width) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            //
            tempCoords = [newCoords[0] + 1, newCoords[1]];
            if (tempCoords[0] >= 0 && tempCoords[0] < width) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            
            // Check the diagonals
            // Check Top Right
            tempCoords = [newCoords[0] + 1, newCoords[1] + 1];
            if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            // Check Down Right
            tempCoords = [newCoords[0] + 1, newCoords[1] - 1];
            if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            // Check Top Left
            tempCoords = [newCoords[0] - 1, newCoords[1] + 1];
            if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            // Check Down Left
            tempCoords = [newCoords[0] - 1, newCoords[1] - 1];
            if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
                if (cellData[tempCoords[0] + tempCoords[1] * height].cellState === "ship")
                    return false;
            }
            //
            return true;
        }
        
        const cellsFree  = (placementCoordinates: number[], candidateShip: ShipData) => {
            for (let i = 0; i < candidateShip.size; i += 1) {
                const newCoords = [
                    placementCoordinates[0] + i * candidateShip.orientation[0],
                    placementCoordinates[1] + i * candidateShip.orientation[1]
                ];
                if (cellData[newCoords[0] + newCoords[1] * rowTags.length].cellState === "ship" ||
                    !noNeighbors(newCoords))
                {
                    return false;
                }
            }
            return true;
        }
        
        // Check if the ship is within the board's bounds.
        const XValid = inBounds(placementCoordinates[0], candidateShip.orientation[0], candidateShip.size, colTags.length);
        const YValid = inBounds(placementCoordinates[1], candidateShip.orientation[1], candidateShip.size, rowTags.length);
        if(!XValid || !YValid) {
            return false
        }
        
        // Check for neighboring ships not in the way of placement
        if(!cellsFree(placementCoordinates, candidateShip)){
            return false
        }
        
        //
        return true;        
    }
    
    // Verify conditions for placing ship and validate the placement. If valid, place ship.
    const tryPlaceShip = (candidateShip: ShipData, placementCoordinates: number[]) => {
        // Placement is valid. Place ship.
        const newBoardData: CellData[] = [...cellData];
        for(let i = 0; i < candidateShip.size; i++){
            newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].cellState = "ship";
            newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].unit = candidateShip;
            placementCoordinates[0] += candidateShip.orientation[0];
            placementCoordinates[1] += candidateShip.orientation[1];
        }
        setCellData(newBoardData);
    }
    
    //
    const handleDropOnCell = (cellIndex: number) => {
        if(selectedShip!==null) {
            // Verify the ship can be placed in this location according to the rules.
            const placementCoordinates = [cellData[cellIndex].pos.x, cellData[cellIndex].pos.y];
            const validPlacement = validateShipPlacement(selectedShip, placementCoordinates);
            if(!validPlacement){ return false }
            
            // Placement is valid. Place ship.
            tryPlaceShip(selectedShip, placementCoordinates); 

            // Add the used ship to the placed ships.
            setPlacedShips([...placedShips, selectedShip]);
            setSelectedShip(null);
            
            // Remove the used ship from the pool of ships.
            const newShipData = shipData.filter((ship)=> ship.id !== selectedShip.id);
            setShipData([...newShipData]);
            

            // Check if all ships were placed.
            if(newShipData.length===0){
                setGameSetupState("ships placed");
            }
            
        }else{
            // No ship was selected. Signal to the user you must select a ship!.
            // Open the ship list.
            alert("No ship selected!");
        }        
    }
    
    // Reset ship placement
    const resetShipPlacement = () => {
        const newBoardData = [...cellData];
        newBoardData.forEach((cell)=>cell.cellState = "hidden");
        setCellData(newBoardData);
        
        setShipData([...placedShips, ...shipData]);
        setPlacedShips([]);
        setGameSetupState("placing ships");
    } 
    
    const handleSetPlayerReady = () => {
        setGameSetupState("player ready")        
    }
    
    useEffect(() => {
        // Set the css property for the row and col number
        document.documentElement.style.setProperty("--columns", colTags.length.toString());
        document.documentElement.style.setProperty("--rows", rowTags.length.toString());
        
        const joinSession = async () => {
            const {error: joinSessionError} = await invokeHubEvent("JoinExistingSession", id);
            if(joinSessionError) {
                setError(joinSessionError);
                return;
            }            
        }
        
        onHubEvent("BeginGameSetup", (rowTags: string[], colTags: string[], boardData: CellData[]) => {
            setRowTags([...rowTags]);
            setColTags([...colTags]);
            setCellData(boardData);
            setGameSetupState("placing ships");
        })
        
        onHubEvent("Error", (message: string)=> {
            setError(new Error(message));
        })
        
        joinSession();
        setGameSetupState("placing ships");
    },[])
    
    const handleShipDragStart = (id: string) => {
        const shipIndex = shipData.findIndex((ship)=>ship.id===id);
        if(shipIndex !== -1){
            setSelectedShip(shipData[shipIndex]);
        }
    }
    
    const placeGhostShip = (candidateShip: ShipData, cellIndex: number) =>{
        const newBoardData: CellData[] = [...cellData];
        
        // Remove all invalid placement cell states.
        newBoardData.forEach((cell)=>{
            if(cell.cellState === "invalidPlacement" || cell.cellState === "validPlacement") {
                cell.cellState = "hidden";
            }
        })
        
        // Verify the ship can be placed in this location according to the rules.
        const placementCoordinates = [cellData[cellIndex].pos.x, cellData[cellIndex].pos.y];
        const validPlacement = validateShipPlacement(candidateShip, placementCoordinates);
        
        if(validPlacement){
            for(let i = 0; i < candidateShip.size; i++){
                newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].cellState = "validPlacement";
                placementCoordinates[0] += candidateShip.orientation[0];
                placementCoordinates[1] += candidateShip.orientation[1];
            }
        } else if(!validPlacement && newBoardData[cellIndex].cellState !== "ship"){
            newBoardData[cellIndex].cellState = "invalidPlacement";
        }

        setCellData(newBoardData);
    }
    
    const handleShipDragOver = (index: number) => {
        placeGhostShip(selectedShip!, index);        
    }
    
    const handleClickCell = (index: number) => {
        const selectedPlacedShip = cellData[index].unit;
        if(selectedPlacedShip){
            // cellData has a unit, remove it.
            
            // Remove ship from board.
            const newCellData = [...cellData];
            cellData.forEach(cell=>{
                if(cell.unit && cell.unit.id === selectedPlacedShip.id){
                    cell.unit = null;
                    cell.cellState = "hidden";
                }
                setCellData(newCellData);
            })
            
            // Pass ship to available ships from placed ships
            setShipData([...shipData, selectedPlacedShip]);
            const newPlacedShips = placedShips.filter((ship)=>ship.id !== selectedPlacedShip.id);
            setPlacedShips([...newPlacedShips]);

            //
            setSelectedShip(selectedPlacedShip);
        }
    }
    //
    
    return (
        <div 
            className='grid grid-rows-[auto_1fr_auto] gap-y-10 min-h-screen bg-BgB text-white'
        >
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
            <main>
                {gameSetupState === "waiting for players" && 
                <section className={"text-center"}>
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
                <section className='grid grid-rows-[auto_auto] grid-cols-[auto_auto] justify-center gap-4 items-start'>
                    <div className={"h-40 w-full bg-BgA col-span-2 mx-auto p-6 rounded-md"}>
                        <div className={"h-full bg-blue-950 rounded-md"}>
                            {
                                gameSetupState === "placing ships" &&
                                (selectedShip &&
                                    <div className={"flex justify-center gap-2 items-center h-full text-4xl"}>
                                        <div className={"flex gap-2 items-center"}>
                                            <h2 className={"capitalize"}>
                                                Selected
                                            </h2>
                                            <span className={"capitalize font-bold"}> {selectedShip.type} </span>
                                        </div>
                                        <div className={"px-4"}>
                                            <Ship data={selectedShip} isPlaced={false}/>
                                        </div>
                                    </div>
                                    ||
                                    <h2 className={"flex justify-center gap-2 items-center h-full text-4xl"}>
                                        Select a ship to place on the grid.
                                    </h2>
                                ) || gameSetupState==="ships placed" &&
                                <h2 className={"flex justify-center gap-2 items-center h-full text-4xl"}>
                                    <button
                                        className={"bg-btnBg w-2/3 h-5/6 mx-auto px-2 py-1 text-xl rounded-lg"}
                                        onClick={handleSetPlayerReady}
                                    >
                                        START GAME!
                                    </button>
                                </h2>
                                || gameSetupState==="player ready" &&
                                <h2 className={"flex justify-center gap-2 items-center h-full text-4xl"}>
                                    Waiting for the other player...
                                </h2>
                            }
                        </div>
                    </div>
                    <Board
                        boardTitle={"Your Grid"}
                        rowTags={rowTags}
                        colTags={colTags}
                        cellData={cellData}
                        onClickCell={handleClickCell}
                        onDropOnCell={handleDropOnCell}
                        onDragOverCell={handleShipDragOver}
                        onFireAtCell={() => {}}
                    />

                    <div className={"grid grid-rows-[auto_1fr_auto_auto] gap-y-1 h-full bg-BgA py-3 px-2 "}>
                        <h2 className={"text-xl text-center px-4"}> Click on the board cells to place your ships </h2>
                        <div className={"flex gap-2 justify-between items-start"}>
                            <ul className={"px-2 py-1 flex flex-col gap-2"}>
                                <h3 className={"font-light text-xl border-b"}> Available Ships </h3>
                                {shipData.map((vessel: ShipData) =>
                                    <li key={vessel.id}>
                                        <h3 className={"capitalize"}> {vessel.type} </h3>
                                        <Ship data={vessel} isPlaced={false} onShipDragStart={handleShipDragStart}/>
                                    </li>
                                )
                                }
                            </ul>
                            <hr/>
                            <ul className={"px-2 py-1 flex flex-col gap-2"}>
                                <h3 className={"font-light text-xl border-b"}> Placed Ships </h3>
                                {placedShips.map((vessel: ShipData) =>
                                    <li key={vessel.id}>
                                        <h3 className={"capitalize"}> {vessel.type} </h3>
                                        <Ship data={vessel} isPlaced={true} />
                                    </li>
                                )
                                }
                            </ul>
                        </div>                       
                        <button
                            className={"border px-3 py-2 mt-2 rounded-sm"}
                            onClick={resetShipPlacement}
                        >
                            Reset Ships
                        </button>
                        <button
                            className={"border px-3 py-2 mt-2 rounded-sm"}
                        >
                            Randomize
                        </button>                        
                    </div>
                </section>}
                {error && <h2 className={"my-4 text-xl text-red-600 text-center"}>Error: {error.message} </h2>}
            </main>
            <Footer/>
        </div>)

}
export default ShipSetupPage;