
// Placeholder tags
import {CellData, CellTag, GameData} from "./types.tsx";


// Placeholder tags
const inColTags: CellTag[] = ["I", "You", "He", "She", "It", "We", "They"];
const inRowTags: CellTag[] = ["A cat", "A dog", "A parrot", "A tiger", "A mouse", "A turtle", "A bird" ];

// Placeholder function to generate board.
const getBoardData = () => {
    // Construct temporary board data to render the cells.
    const tempBoardData : CellData[] = [];
    for (let i = 0; i < inRowTags.length * inColTags.length; i++) {
        const cellData: CellData = {
            index: i,
            pos: {
                x: i % inColTags.length,
                y: Math.floor(i / inColTags.length)
            },
            cellState: "hidden",
            selected: false,
        }
        tempBoardData.push(cellData);
    }
    return tempBoardData;
}

export const mockGameData : GameData = {
    gameId: "id",
    rowTags: inRowTags,
    colTags: inColTags,
    playerBoardData: getBoardData(),
    opponentBoardData: getBoardData(),
    playerTurn: false,
}