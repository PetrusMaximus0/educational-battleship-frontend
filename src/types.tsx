export type CellState = "hidden" | "hit" | "ship" | "miss" | "sunk" | "validPlacement" | "invalidPlacement";

export type CellData = {
    index: number,
    pos: {
        x: number,
        y: number,
    }
    cellState: CellState,
    unit?: ShipData | null,
    selected?: boolean,
}

export type CellStateColors = {
    hidden: string,
    miss: string,
    hit: string,
    ship: string,
    sunk: string,
    validPlacement: string,
    invalidPlacement: string,
}

export type CellTag = string;

export interface GameData {
    rowTags: string[],
    colTags: string[],
    playerBoardData: CellData[],
    opponentBoardData: CellData[],
    gameId: string,
    playerTurn: boolean,
}

export type ErrorValue<E, V> = {value: V, error: null} | {value: null, error: E};

export type IInitializeBoard = (inColTags: CellTag[], inRowTags: CellTag[], inCellData: CellData[]) => void;

export type IUpdateCellState = (cellIndex: number, newCellState: CellState) => void;

//
export type ShipType = "destroyer" | "submarine" | "carrier" | "frigate";
export type ShipSize = 1 | 2 | 3 | 4;
export type ShipOrientation = [1,0]|[-1,0]|[0,1]|[0,-1];
export type ShipData = {
    id: string,
    type: ShipType;
    size: ShipSize;
    orientation: ShipOrientation;
}