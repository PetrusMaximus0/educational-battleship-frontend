import {CellData, ShipData} from "../types.tsx";

const inBounds = (coord: number, ort: number, len: number, boardDim: number) => {
    return coord >= 0
        && coord <= boardDim
        && coord + ort * len <= boardDim
        && coord + ort * len >= 0;
}

// By storing ship part positions it's possible to simply calculate the manhattan distance to every ship part 
// and check if it is greater to one, in which case the placement is valid.
const noNeighbors = (rowTags: string[], colTags: string[], newCoords: number[], cellData: CellData[]) => {
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

const cellsFree  = (cellData:CellData[], rowTags:string[], colTags:string[], placementCoordinates: number[], candidateShip: ShipData) => {
    for (let i = 0; i < candidateShip.size; i += 1) {
        const newCoords = [
            placementCoordinates[0] + i * candidateShip.orientation[0],
            placementCoordinates[1] + i * candidateShip.orientation[1]
        ];
        if (cellData[newCoords[0] + newCoords[1] * rowTags.length].cellState === "ship" ||
            !noNeighbors(rowTags, colTags, newCoords, cellData))
        {
            return false;
        }
    }
    return true;
}

// Returns true if the current ship placement is valid, and false otherwise.
export const isValidShipPlacement = (candidateShip: ShipData, placementCoordinates: number[], rowTags: string[], colTags: string[], cellData: CellData[]) =>{

    // Check if the ship is within the board's bounds.
    const XValid = inBounds(placementCoordinates[0], candidateShip.orientation[0], candidateShip.size, colTags.length);
    const YValid = inBounds(placementCoordinates[1], candidateShip.orientation[1], candidateShip.size, rowTags.length);
    if(!XValid || !YValid) {
        return false
    }

    // Check for neighboring ships not in the way of placement
    if(!cellsFree(cellData, rowTags, colTags, placementCoordinates, candidateShip)){
        return false
    }

    //
    return true;

}