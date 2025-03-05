import {ECellState, EShipType} from "../enums/Enums.ts";

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
export type ShipSize = 1 | 2 | 3 | 4 | 5;
export type ShipOrientation = [1,0]|[-1,0]|[0,1]|[0,-1];
export type SectionStatus = "ok" | "hit";
export type ShipData = {
    id: string,
    type: EShipType;
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

// BoardTag setup
export type tagTemplate = {
    id: string,
    name: string,
    rows: string[],
    cols: string[],
}
