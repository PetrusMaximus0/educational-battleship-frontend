
// Placeholder tags
import {CellData, CellTag, GameData, ShipData} from "./types.tsx";


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

export const mockShipData : ShipData[] = [
    {
        id: "ship-1",
        type: "destroyer", // define the types !
        size: 3, // 1 to 4
        orientation: [1,0], // 0 to 3 -> clockwise North to West
    },{
        id: "ship-2",    
        type: "submarine", // define the types !
        size: 1, // 1 to 4
        orientation: [1,0], // 0 to 3 -> clockwise North to West
    },{
        id:"ship-3",
        type: "submarine", // define the types !
        size: 1, // 1 to 4
        orientation: [1,0], // 0 to 3 -> clockwise North to West
    },{
        id: "ship-4",
        type: "carrier", // define the types !
        size: 4, // 1 to 4
        orientation: [1,0], // 0 to 3 -> clockwise North to West
    },
    {
        id: "ship-5",
        type: "frigate", // define the types !
        size: 2, // 1 to 4
        orientation: [1,0], // 0 to 3 -> clockwise North to West
    }
]

export const mockGameData : GameData = {
    gameId: "id",
    rowTags: inRowTags,
    colTags: inColTags,
    playerBoardData: getBoardData(),
    opponentBoardData: getBoardData(),
    playerTurn: false,
}