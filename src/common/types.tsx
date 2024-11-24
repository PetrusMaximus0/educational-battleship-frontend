import {ECellState} from "./Enums.ts";

export type CellData = {
    index: number,
    pos: {
        x: number,
        y: number,
    }
    state: ECellState,
    unit?: ShipData | null,
    selected?: boolean,
}

// Game
export interface GameData {
    rowTags: string[],
    colTags: string[],
    playerBoardData: CellData[],
    opponentBoardData: CellData[],
    gameId: string,
    playerTurn: boolean,
}

// Ships
// Todo: replace the ShipType type with an enum.
export type ShipType = "destroyer" | "submarine" | "carrier" | "frigate" | "battleship";
export type ShipSize = 1 | 2 | 3 | 4 | 5;
export type ShipOrientation = [1,0]|[-1,0]|[0,1]|[0,-1];
export type SectionStatus = "ok" | "hit";
export type ShipData = {
    id: string,
    type: ShipType;
    pos: {
        x: number,
        y: number,
    }
    orientation: ShipOrientation;
    numberOfSections: ShipSize;
    sectionStatus: SectionStatus[];
}
export type ShipPoolItem = {ship: ShipData, placed: boolean};
export type ShipPool =  ShipPoolItem[];
