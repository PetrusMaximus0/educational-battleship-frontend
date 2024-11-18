import {Link, useParams} from "react-router-dom";
import Footer from "../components/Footer.tsx";
import React, {useEffect, useState} from "react";
import {invokeHubEvent, onHubEvent} from "../hubs/gameHub.tsx";
import {CellData, ShipData, ShipOrientation} from "../types.tsx";
import Board from "../components/Board.tsx";
import {mockGameData, mockShipData} from "../mockGameData.ts";
import Ship from "../components/Ship.tsx";
import {isValidShipPlacement, rotateShip} from "../gameUtils/ShipPlacement.ts";

type SetupState = "waiting for players" | "placing ships" | "ships placed" | "player ready";
type ShipPoolItem = {ship: ShipData, placed: boolean};
type ShipPool =  ShipPoolItem[];

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
    const [shipPool, setShipPool] = useState<ShipPool>([]);

    //
    const [selectedShip, setSelectedShip] = useState<ShipData|null>(null);
    const [shipBrushPos, setShipBrushPos] = useState<{x: number; y: number}>({x:0,y:0});
    const [focusedCellIndex, setFocusedCellIndex] = useState<number>(-1);

    // Handlers for session connectivity and game setup state.
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

    const handleSetPlayerReady = () => {
        setGameSetupState("player ready")
    }
    
     // place a ship given the coordinates and the ship data
    const placeShip = (shipToPlace: ShipData, placementCoordinates: number[]) => {
        const newBoardData: CellData[] = [...cellData];
        
        for(let i = 0; i < shipToPlace.size; i++){
            newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].cellState = "ship";
            newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].unit = shipToPlace;
            placementCoordinates[0] += shipToPlace.orientation[0];
            placementCoordinates[1] += shipToPlace.orientation[1];
        }
        
        setCellData(newBoardData);
    }

    const placeShipsRandomly = () => {
        // Reset the current ships
        resetShipPlacement();
        
        const boardWidth = colTags.length;
        const boardHeight = colTags.length;
        
        //
        const newShipPool = [...shipPool];
        
        //
        newShipPool
            .forEach((item)=>{
            // This could be an infinite loop, if you had the courage.
            for(let i = 0; i<10000; i++){
                const randomCoordinates = [
                    Math.floor(Math.random() * boardWidth),
                    Math.floor(Math.random() * boardHeight)
                ];
                const randomDirection = () => {
                    const vertical = Math.random() > 0.5;
                    return vertical ? [1,0] : [0,1];
                };

                item.ship.orientation = randomDirection() as ShipOrientation;
                if(isValidShipPlacement(item.ship, randomCoordinates, boardHeight, boardWidth, cellData)){
                    placeShip(item.ship, randomCoordinates);
                    item.placed = true;
                    break;
                }
            }
        })

        setShipPool(newShipPool);

        // Check if all ships were placed, and if they were set the game state to "ships placed".
        const allShipsPlaced = newShipPool.findIndex((item)=> !item.placed);
        if(allShipsPlaced===-1){//-1 means we couldn't find a ship that wasn't placed.
            setGameSetupState("ships placed");
        }
        
    }
    
    const renderShipPlacementFeedback = (candidateShip: ShipData, cellIndex: number) =>{
        if(!candidateShip) return;       
        
        const newBoardData: CellData[] = [...cellData];
        
        // Remove all invalid placement cell states.
        newBoardData.forEach((cell)=>{
            if(cell.cellState === "invalidPlacement" || cell.cellState === "validPlacement") {
                cell.cellState = "hidden";
            }
        })
        
        // Verify the ship can be placed in this location according to the rules.
        const placementCoordinates = [newBoardData[cellIndex].pos.x, newBoardData[cellIndex].pos.y];
        const validPlacement = isValidShipPlacement(candidateShip, placementCoordinates, rowTags.length, colTags.length, newBoardData);
        
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
    
    // Reset ship placement
    const resetShipPlacement = () => {
        const newBoardData = [...cellData];
        newBoardData.forEach((cell)=>cell.cellState = "hidden");
        setCellData(newBoardData);
        
        const newAvailableShips = [...shipPool]; 
        newAvailableShips.forEach((item)=>item.placed=false);        
        setShipPool(newAvailableShips);
        
        setGameSetupState("placing ships");
    }

    const handleShipDropOnCell = (cellIndex: number) => {
        if(selectedShip===null) return;

        // Verify the ship can be placed in this location according to the rules.
        const placementCoordinates = [cellData[cellIndex].pos.x, cellData[cellIndex].pos.y];
        const validPlacement = isValidShipPlacement(selectedShip, placementCoordinates, rowTags.length, colTags.length, cellData);
        if(!validPlacement) {
            setSelectedShip(null);
            return;
        }

        // Placement is valid. Place ship.
        placeShip(selectedShip, placementCoordinates);

        // Create updated available ships array.
        const newAvailableShips = [...shipPool];
        
        // Find the ship being placed.
        const placedShipIndex = newAvailableShips.findIndex((item)=> item.ship.id === selectedShip.id);
        if(placedShipIndex!==-1){
            // Set the ship as placed.
            newAvailableShips[placedShipIndex].placed = true;
        }else{
            alert("Couldn't set ship as placed!");
        }
        
        // Check if all ships were placed, and if they were set the game state to "ships placed".
        const allShipsPlaced = newAvailableShips.findIndex((item)=> !item.placed);
        if(allShipsPlaced===-1){//-1 means we couldn't find a ship that wasn't placed.
            setGameSetupState("ships placed");
        }
        
        // Update state.
        setShipPool(newAvailableShips);
        setSelectedShip(null);
    }
        
    const handleShipDragOverCell = (index: number) => {
        setFocusedCellIndex(index);
        if(selectedShip) renderShipPlacementFeedback(selectedShip, index);        
    }
    
    const handleMouseDownOnCell = (index: number) => {
        if(selectedShip) {
            handleShipDropOnCell(index);
        }else {
            const selectedPlacedShip = cellData[index].unit;
            if (selectedPlacedShip) { // cellData has a unit, remove it.
                // Remove ship from board.
                const newCellData = [...cellData];
                cellData.forEach(cell => {
                    if (cell.unit && cell.unit.id === selectedPlacedShip.id) {
                        cell.unit = null;
                        cell.cellState = "hidden";
                    }
                    setCellData(newCellData);
                })

                const newAvailableShips = [...shipPool];
                // Mark the ship as not placed.
                const candidateShipIndex = newAvailableShips.findIndex((item)=>item.ship.id === selectedPlacedShip.id)
                if(candidateShipIndex!==-1){
                    newAvailableShips[candidateShipIndex].placed = false;
                }else{
                    alert("Couldn't mark the ship as not placed.")
                }

                setShipPool(newAvailableShips);
                setSelectedShip(selectedPlacedShip);
                //
            }
        }
    }
      
    const handleClickOnShip = (data: ShipData) => {
        const shipIndex = shipPool.findIndex((item)=>item.ship.id===data.id);
        if(shipIndex !== -1){
            setSelectedShip(shipPool[shipIndex].ship);            
        }        
    }
    
    const handleShipDragMove = (e: React.MouseEvent) => {
        const mainEl = document.getElementById("main");
        if(mainEl){
            const bounds = mainEl.getBoundingClientRect();
            setShipBrushPos({ x: e.clientX - bounds.x, y: e.clientY - bounds.y });            
        }
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {        
        // Ignore event if the key press was not r
        if(e.key!=="r") return;

        if(selectedShip){
            const newShip = {...selectedShip};
            rotateShip(newShip);
            setSelectedShip(newShip);
            renderShipPlacementFeedback(newShip, focusedCellIndex);
        }
        e.preventDefault();        
    }

    const getShipStyleTransform = () => {
        if (!selectedShip) return "translate(-50%, -50%) rotate(0deg)";

        const ort = selectedShip.orientation;
        // Determine rotation and offsets based on orientation
        if (ort[0] === -1) {
            return `translate(calc(-50% - 50px), -50%) rotate(180deg)`; // West
        } else if (ort[1] === 1) {
            return `translate(-50%, calc(-50% + 50px)) rotate(90deg)`; // South
        } else if (ort[1] === -1) {
            return `translate(-50%, calc(-50% - 50px)) rotate(-90deg)`; // North
        } else {
            return `translate(calc(-50% + 50px), -50%) rotate(0deg)`; // East
        }
    };
    
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
        
        // TODO Not currently used!
        onHubEvent("BeginGameSetup", (rowTags: string[], colTags: string[], boardData: CellData[], shipData: ShipData[]) => {
            const newShipPool = shipData.map((inShip)=>{
                return {ship: inShip, placed: false}
            })
            setRowTags([...rowTags]);
            setColTags([...colTags]);
            setCellData(boardData);
            setShipPool(newShipPool);
            setGameSetupState("placing ships");
        })
        
        onHubEvent("Error", (message: string)=> {
            setError(new Error(message));
        })
        
        joinSession();
                
        // TODO: Temporarily used for testing. All data initialization will be moved to the BeginGameSetup event handler.
        const newShipPool = mockShipData.map((inShip)=>{
            return {ship: inShip, placed: false}
        })
        setShipPool([...newShipPool]);
        
        return ()=>{}
       
    },[])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [selectedShip, focusedCellIndex]);


    
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
            <main
                id={"main"}
                className={"relative"}
                onMouseMove={handleShipDragMove}
                onMouseLeave={()=>setSelectedShip(null)}
                onMouseUp={()=>setSelectedShip(null)}
            >
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
                    <header id={"messageScreen"} className={"h-40 w-full bg-BgA col-span-2 mx-auto p-6 rounded-md"}>
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
                                        <span className={"px-4"}>
                                            <Ship data={selectedShip} isPlaced={true}/>
                                        </span>
                                        <span className={"px-4"}> X: {shipBrushPos.x} Y: {shipBrushPos.y} </span>
                                        
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
                    </header>
                    <Board
                        boardTitle={"Your Grid"}
                        rowTags={rowTags}
                        colTags={colTags}
                        cellData={cellData}
                        onMouseUpCell={handleShipDropOnCell}
                        onMouseDownCell={handleMouseDownOnCell}
                        onMouseEnterCell={handleShipDragOverCell}
                    />
                    <section id={"ShipList"} className={"grid grid-rows-[auto_1fr_auto_auto] gap-y-1 h-full bg-BgA py-3 px-2 "}>
                        <header> <h2 className={"text-xl text-center px-4"}> Click on the board cells to place your ships </h2> </header>
                        <div className={"flex gap-2 justify-between items-start"}>
                            <ul className={"px-2 py-1 flex flex-col gap-2"}>
                                <h3 className={"font-light text-xl border-b"}> Available Ships </h3>
                                {shipPool.filter((item)=>!item.placed).map((item: ShipPoolItem) => 
                                    <li key={item.ship.id}>
                                        <h3 className={"capitalize"}> {item.ship.type} </h3>
                                        <Ship data={item.ship} isPlaced={false} onMouseDown={handleClickOnShip} onMouseUp={()=>setSelectedShip(null)}/>
                                    </li>
                                )}                                
                            </ul>
                            <hr/>
                            <ul className={"px-2 py-1 flex flex-col gap-2"}>
                                <h3 className={"font-light text-xl border-b"}> Placed Ships </h3>
                                {shipPool.filter((item)=>item.placed).map((item: ShipPoolItem) =>
                                    <li key={item.ship.id}>
                                        <h3 className={"capitalize"}> {item.ship.type} </h3>
                                        <Ship data={item.ship} isPlaced={true}/>
                                    </li>
                                )}
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
                            onClick={placeShipsRandomly}
                        >
                            Randomize
                        </button>
                    </section>
                </section>}
                { selectedShip &&
                    <div 
                        className={`absolute pointer-events-none`}
                        id={"ShipBrush"}     
                        style={{
                            zIndex: 10000,
                            left:`${shipBrushPos.x}px`, 
                            top:`${shipBrushPos.y}px`,
                            transform: getShipStyleTransform(),
                            transformOrigin: "center center"
                        }}
                    >
                        <Ship data={selectedShip} isPlaced={true}  />
                    </div>
                } 
                {error && <h2 className={"my-4 text-xl text-red-600 text-center"}>Error: {error.message} </h2>}
            </main>
            <Footer/>
        </div>)

}
export default ShipSetupPage;