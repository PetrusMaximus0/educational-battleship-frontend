import {CellData, ShipData} from "../types/types.tsx";
import {ECellState} from "../enums/Enums.ts";

const inBounds = (coord: number, ort: number, len: number, boardDim: number) => {
    const maxCoord = coord + ort * (len - 1);
    const minInBounds = coord >= 0 && coord < boardDim;
    const maxInBounds = maxCoord >= 0 && maxCoord < boardDim;
    return minInBounds && maxInBounds;
}

// By storing ship part positions it's possible to simply calculate the manhattan distance to every ship part 
// and check if it is greater to one, in which case the placement is valid.
const cellsFree  = (cellData:CellData[], height: number, width: number,  placementCoordinates: number[], candidateShip: ShipData) => {
    for (let i = 0; i < candidateShip.numberOfSections; i += 1) {
        const newCoords = [
            placementCoordinates[0] + i * candidateShip.orientation[0],
            placementCoordinates[1] + i * candidateShip.orientation[1]
        ];
        
        // Check the target coordinate as well as the surrounding ones.
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){ 
                const tempCoords = [newCoords[0] + i, newCoords[1] + j];
                
                // Skip the check if the tested coordinates are out of bounds.
                if(tempCoords[0] < 0 || tempCoords[0] >= width || tempCoords[1] < 0 || tempCoords[1] >= height) continue;
                //
                const cellIndex = tempCoords[0] + tempCoords[1] * width;
                if(cellData[cellIndex].state === ECellState.ship){ return false; }
            }
        }
    }
    return true;
}

// Returns true if the current ship placement is valid, and false otherwise.
export const isValidShipPlacement = (candidateShip: ShipData, placementCoordinates: number[], height: number, width: number, cellData: CellData[]) =>{
    // Check if the ship is within the board's bounds.
    const XValid = inBounds(placementCoordinates[0], candidateShip.orientation[0], candidateShip.numberOfSections, width);
    const YValid = inBounds(placementCoordinates[1], candidateShip.orientation[1], candidateShip.numberOfSections, height);
    if(!XValid || !YValid) {
        return false
    }

    // Check if the cells to place the ship on are all free.
    if(!cellsFree(cellData, height, width, placementCoordinates, candidateShip)){
        return false
    }

    //
    return true;
}

export const rotateShip = (candidateShip: ShipData) => {
    if(candidateShip.orientation[0] === 1 && candidateShip.orientation[1]===0){
        candidateShip.orientation = [0,1];
    }else if(candidateShip.orientation[0] === -1 && candidateShip.orientation[1]===0){
        candidateShip.orientation = [0,-1];
    }else if(candidateShip.orientation[0] === 0 && candidateShip.orientation[1]=== 1){
        candidateShip.orientation = [-1,0];
    }else if(candidateShip.orientation[0] === 0 && candidateShip.orientation[1]===-1){
        candidateShip.orientation = [1,0];
    }
} 
