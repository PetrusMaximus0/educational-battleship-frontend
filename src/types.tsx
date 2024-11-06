export type CellState = "hidden" | "hit" | "ship" | "miss" | "sunk";

export type CellData = {
    index: number,
    pos: {
        x: number,
        y: number,
    }
    text: string,
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
export type CellStateColorKey = keyof CellStateColors;

export type CellAction = "fire" | "mark" | "clear";

//

export type IInitializeBoard = (inColTags: CellTag[], inRowTags: CellTag[], inCellData: CellData[]) => void;
export type IUpdateCellState = (cellIndex: number, newCellState: CellState) => void;