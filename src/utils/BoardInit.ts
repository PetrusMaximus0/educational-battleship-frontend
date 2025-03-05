import {CellData, GameData} from "../types/types.tsx";
import {ECellState} from "../enums/Enums.ts";
import {templates} from "../data/tagTemplates.ts";

// Placeholder function to generate board.
const generateEmptyBoard = (defaultState?: ECellState ) => {
    // Construct temporary board data to render the cells.
    const tempBoardData : CellData[] = [];
    for (let i = 0; i < templates[0].rows.length * templates[0].cols.length; i++) {
        const cellData: CellData = {
            index: i,
            pos: {
                x: i % templates[0].cols.length,
                y: Math.floor(i / templates[0].cols.length)
            },
            state: defaultState ? defaultState : ECellState.hidden,
            selected: false,
        }
        tempBoardData.push(cellData);
    }
    return tempBoardData;
}

//
export const emptyBoards : GameData = {
    gameId: "id",
    rowTags : templates[0].rows,
    colTags : templates[0].cols,
    playerBoardData : generateEmptyBoard(ECellState.miss),
    opponentBoardData : generateEmptyBoard(ECellState.hidden),
    playerTurn : false,
}
