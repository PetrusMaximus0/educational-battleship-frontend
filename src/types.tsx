export type CellState = "hidden" | "hit" | "ship" | "miss" | "sunk";

export type CellData = {
    index: number,
    pos: {
        x: number,
        y: number,
    }
    cellState: CellState,
    selected?: boolean,
}

export type CellStateColors = {
    hidden: string,
    miss: string,
    hit: string,
    ship: string,
    sunk: string,
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