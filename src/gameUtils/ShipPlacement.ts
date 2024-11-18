import {CellData, ShipData} from "../types.tsx";

const inBounds = (coord: number, ort: number, len: number, boardDim: number) => {
    return coord >= 0
        && coord <= boardDim       
        && coord + ort * (len) <= boardDim
        && coord + ort * (len-1) >= 0;
}

// By storing ship part positions it's possible to simply calculate the manhattan distance to every ship part 
// and check if it is greater to one, in which case the placement is valid.
const noNeighbors = (height: number, width: number, newCoords: number[], cellData: CellData[]) => {

    // Check horizontal
    let tempCoords = [newCoords[0], newCoords[1] - 1];
    if (tempCoords[1] >= 0 && tempCoords[1] < height) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }
    //
    tempCoords = [newCoords[0], newCoords[1] + 1];
    if (tempCoords[1] >= 0 && tempCoords[1] < height) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }
    // Check vertical
    tempCoords = [newCoords[0] - 1, newCoords[1]];
    if (tempCoords[0] >= 0 && tempCoords[0] < width) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }
    //
    tempCoords = [newCoords[0] + 1, newCoords[1]];
    if (tempCoords[0] >= 0 && tempCoords[0] < width) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }

    // Check the diagonals
    // Check Top Right
    tempCoords = [newCoords[0] + 1, newCoords[1] + 1];
    if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }
    // Check Down Right
    tempCoords = [newCoords[0] + 1, newCoords[1] - 1];
    if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }
    // Check Top Left
    tempCoords = [newCoords[0] - 1, newCoords[1] + 1];
    if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }
    // Check Down Left
    tempCoords = [newCoords[0] - 1, newCoords[1] - 1];
    if (tempCoords[1] >= 0 && tempCoords[1] < height && tempCoords[0] >= 0 && tempCoords[0] < width) {
        if (cellData[tempCoords[0] + tempCoords[1] * height].state === "ship")
            return false;
    }
    //
    return true;
}

const cellsFree  = (cellData:CellData[], height: number, width: number, placementCoordinates: number[], candidateShip: ShipData) => {
    for (let i = 0; i < candidateShip.size; i += 1) {
        const newCoords = [
            placementCoordinates[0] + i * candidateShip.orientation[0],
            placementCoordinates[1] + i * candidateShip.orientation[1]
        ];
        if (cellData[newCoords[0] + newCoords[1] * height].state === "ship" ||
            !noNeighbors(height, width, newCoords, cellData))
        {
            return false;
        }
    }
    return true;
}

// Returns true if the current ship placement is valid, and false otherwise.
export const isValidShipPlacement = (candidateShip: ShipData, placementCoordinates: number[], height: number, width: number, cellData: CellData[]) =>{

    // Check if the ship is within the board's bounds.
    const XValid = inBounds(placementCoordinates[0], candidateShip.orientation[0], candidateShip.size, width);
    const YValid = inBounds(placementCoordinates[1], candidateShip.orientation[1], candidateShip.size, height);
    if(!XValid || !YValid) {
        return false
    }

    // Check for neighboring ships not in the way of placement
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
