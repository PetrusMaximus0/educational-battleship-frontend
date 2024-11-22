import Ship from "./Ship.tsx";
import Board from "./Board.tsx";
import React, {useEffect, useState} from "react";
import {CellData, ShipData, ShipOrientation} from "../common/types.tsx";
import {invokeHubEvent, onHubEvent} from "../hubs/gameHub.tsx";
import {isValidShipPlacement, rotateShip} from "../gameUtils/ShipPlacement.ts";
import {useParams} from "react-router-dom";
import {EClientState, EFleetSetupState} from "../common/Enums.ts";

type ShipPoolItem = {ship: ShipData, placed: boolean};
type ShipPool =  ShipPoolItem[];

type props ={
    clientState : EClientState | null,
}

const ShipSetup = ({clientState}: props) => {
    //
    const [error, setError] = useState<Error|null>(null);
    const [setupState, setSetupState] = useState<EFleetSetupState>(EFleetSetupState.placing);
    
    const { id } = useParams();

    //
    const [rowTags, setRowTags] = useState<string[]>([]);
    const [colTags, setColTags] = useState<string[]>([]);
    const [cellData, setCellData] = useState<CellData[]>([]);
    const [shipPool, setShipPool] = useState<ShipPool>([]);

    //
    const [selectedShip, setSelectedShip] = useState<ShipData|null>(null);
    const [shipBrushPos, setShipBrushPos] = useState<{x: number; y: number}>({x:0,y:0});
    const [focusedCellIndex, setFocusedCellIndex] = useState<number>(-1);
    
    // place a ship given the coordinates and the ship data
    const placeShip = (shipToPlace: ShipData, placementCoordinates: number[]) => {
        const newBoardData: CellData[] = [...cellData];
        const newShipPool: ShipPoolItem[] = [...shipPool];

        // Set the coordinates on the ship.
        shipToPlace.pos.x = placementCoordinates[0];
        shipToPlace.pos.y = placementCoordinates[1];
        const idx = newShipPool.findIndex((item)=>item.ship.id === shipToPlace.id);
        newShipPool[idx].ship = shipToPlace;

        // Mark the cell as occupied.
        for(let i = 0; i < shipToPlace.numberOfSections; i++){
            newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].state = "ship";
            newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].unit = shipToPlace;
            placementCoordinates[0] += shipToPlace.orientation[0];
            placementCoordinates[1] += shipToPlace.orientation[1];
        }

        // Set state.
        setShipPool(newShipPool);
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
            setSetupState(EFleetSetupState.placed);
        }
    }

    const renderShipPlacementFeedback = (candidateShip: ShipData, cellIndex: number) =>{
        if(!candidateShip) return;

        const newBoardData: CellData[] = [...cellData];

        // Remove all invalid placement cell states.
        newBoardData.forEach((cell)=>{
            if(cell.state === "invalidPlacement" || cell.state === "validPlacement") {
                cell.state = "hidden";
            }
        })

        // Verify the ship can be placed in this location according to the rules.
        const placementCoordinates = [newBoardData[cellIndex].pos.x, newBoardData[cellIndex].pos.y];
        const validPlacement = isValidShipPlacement(candidateShip, placementCoordinates, rowTags.length, colTags.length, newBoardData);

        if(validPlacement){
            for(let i = 0; i < candidateShip.numberOfSections; i++){
                newBoardData[placementCoordinates[0] + placementCoordinates[1]*colTags.length].state = "validPlacement";
                placementCoordinates[0] += candidateShip.orientation[0];
                placementCoordinates[1] += candidateShip.orientation[1];
            }
        } else if(!validPlacement && newBoardData[cellIndex].state !== "ship"){
            newBoardData[cellIndex].state = "invalidPlacement";
        }

        setCellData(newBoardData);
    }

    // Reset ship placement
    const resetShipPlacement = () => {
        const newBoardData = [...cellData];
        newBoardData.forEach((cell)=>cell.state = "hidden");
        setCellData(newBoardData);

        const newAvailableShips = [...shipPool];
        newAvailableShips.forEach((item)=> {
            item.placed = false;
            item.ship.pos = {x:0,y:0};
        });
        setShipPool(newAvailableShips);
        setSetupState(EFleetSetupState.placing)
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
            setSetupState(EFleetSetupState.placed);
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
                        cell.state = "hidden";
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
        const mainEl = document.getElementById("shipAnchor");
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

    const submitFleetSetup = async () =>{
        // Ignore request if we are not at "placed" state.
        if(setupState !== EFleetSetupState.placed) return;
        
        // Request fleet setup validation from server.
        setSetupState(EFleetSetupState.validating);
        const shipData = shipPool.map((item)=> item.ship);
        
        const {error: hubError} = await invokeHubEvent("ValidateFleetPlacement", id, shipData);
        if(hubError){
            setError(hubError);
            setSetupState(EFleetSetupState.placed);
        }
    }
    
    const handleEditFleet = async ()=> {
        const {error: hubError} = await invokeHubEvent("CancelFleetPlacement", id);
        if(hubError){
            setError(hubError);
            return;
        }
    }
    
    useEffect(() => {
        const handleBeginFleetSetup = (inRowTags: string[], inColTags: string[], inBoardData: CellData[], inShipData: ShipData[]) => {
            const newShipPool = inShipData.map((inShip)=>{
                return {ship: inShip, placed: false}
            })
            
            setRowTags([...inRowTags]);
            setColTags([...inColTags]);
            setCellData([...inBoardData]);
            setShipPool([...newShipPool]);

            //
            setSetupState(EFleetSetupState.placing);

            // Set the css property for the row and col number
            document.documentElement.style.setProperty("--columns", inColTags.length.toString());
            document.documentElement.style.setProperty("--rows", inRowTags.length.toString());            
        }
        const handleHubError = (message: string)=> setError(new Error(message));
        
        // Bind hub events.
        onHubEvent("BeginFleetSetup", handleBeginFleetSetup);
        onHubEvent("Error", handleHubError);
        
        //
        (async ()=>{
            await invokeHubEvent("FleetSetup", id);
        })()        
    },[])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        }
    }, [selectedShip, focusedCellIndex]);

    useEffect(()=>{
        if(clientState === EClientState.FleetSetup && setupState === EFleetSetupState.validated){
            resetShipPlacement();
        }else if(clientState === EClientState.FleetReady){
            setSetupState(EFleetSetupState.validated);
        }
    },[clientState])  
    
    return (
        <div
            id={"shipAnchor"}
            className={"relative"}
            onMouseMove={handleShipDragMove}
            onMouseLeave={() => setSelectedShip(null)}
            onMouseUp={() => setSelectedShip(null)}
            >

            {!cellData && "no cell data."}
            
            <div 
                className='grid grid-rows-[auto_auto] grid-cols-[auto_auto] justify-center gap-4 items-start'
            >
                <div className={"flex flex-col items-center bg-BgA gap-1  py-3 px-2"}>
                    <h2 className={"text-2xl text-center px-4 py-2"}>Fleet Status: {setupState} </h2>
                    <Board
                        boardTitle={""}
                        rowTags={rowTags}
                        colTags={colTags}
                        cellData={cellData}
                        onMouseUpCell={handleShipDropOnCell}
                        onMouseDownCell={handleMouseDownOnCell}
                        onMouseEnterCell={handleShipDragOverCell}
                    />
                </div>

                    <section 
                            id={"ShipList"}
                            className={"grid grid-rows-[auto_1fr_auto_auto] gap-y-1 h-full bg-BgA py-3 px-2 "}
                        >
                            <header>
                                <h2 className={"text-2xl text-center px-4 py-2"}>
                                        Drag the ships to the board
                                </h2>
                            </header>
                            <div className={"flex gap-2 justify-between items-start"}>
                                <ul className={"px-2 py-1 flex flex-col gap-2"}>
                                    <h3 className={"font-light text-xl border-b"}> Available Ships </h3>
                                    {shipPool.filter((item) => !item.placed).map((item: ShipPoolItem) =>
                                        <li key={item.ship.id}>
                                            <h3 className={"capitalize"}> {item.ship.type} </h3>
                                            <Ship data={item.ship} isPlaced={false} onMouseDown={handleClickOnShip}
                                                  onMouseUp={() => setSelectedShip(null)}/>
                                        </li>
                                    )}
                                </ul>
                                <hr/>
                                <ul className={"px-2 py-1 flex flex-col gap-2"}>
                                    <h3 className={"font-light text-xl border-b"}> Placed Ships </h3>
                                    {shipPool.filter((item) => item.placed).map((item: ShipPoolItem) =>
                                        <li key={item.ship.id}>
                                            <h3 className={"capitalize"}> {item.ship.type} </h3>
                                            <Ship data={item.ship} isPlaced={true}/>
                                        </li>
                                    )}
                                </ul>
                            </div>

                        {clientState === EClientState.FleetSetup && 
                            <div className={"flex justify-around"}>
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
                                <button
                                    className={`border px-3 py-2 mt-2 rounded-sm ${setupState !== EFleetSetupState.placed ? " text-opacity-50 text-white" : " "}`}
                                    onClick={submitFleetSetup}
                                >
                                    Accept
                                </button>
                            </div> 
                            || <button 
                                className={"border px-3 py-2 mt-2 rounded-sm"}
                                onClick={handleEditFleet}
                            > 
                                Edit Fleet 
                            </button>
                            
                        }
                    </section>
                
            </div>
            {
                selectedShip &&
                <div
                    className={`absolute pointer-events-none`}
                    id={"ShipBrush"}
                    style={{
                        zIndex: 10000,
                        left: `${shipBrushPos.x}px`,
                        top: `${shipBrushPos.y}px`,
                        transform: getShipStyleTransform(),
                        transformOrigin: "center center"
                    }}
                > 
                    <Ship data={selectedShip} isPlaced={true}/> 
                </div> 
            }
            { error && <p className={"my-4 text-xl text-red-600 text-center"}>Error: {error.message} </p> }        
        </div>
    )
}

export default ShipSetup;