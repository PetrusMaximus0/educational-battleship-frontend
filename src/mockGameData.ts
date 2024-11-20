
// Placeholder tags
import {CellData, CellState, CellTag, GameData, ShipData} from "./types.tsx";

// Placeholder tags
const inColTags: CellTag[] = ["I", "You", "He", "She", "It", "We", "They"];
const inRowTags: CellTag[] = ["A cat", "A dog", "A parrot", "A tiger", "A mouse", "A turtle", "A bird" ];

// Placeholder function to generate board.
const generateEmptyBoard = (defaultState?: CellState ) => {
    // Construct temporary board data to render the cells.
    const tempBoardData : CellData[] = [];
    for (let i = 0; i < inRowTags.length * inColTags.length; i++) {
        const cellData: CellData = {
            index: i,
            pos: {
                x: i % inColTags.length,
                y: Math.floor(i / inColTags.length)
            },
            state: defaultState ? defaultState : "hidden",
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
    playerBoardData: generateEmptyBoard("miss"),
    opponentBoardData: generateEmptyBoard("hidden"),
    playerTurn: false,
}
export const mockShipData: ShipData[] = [
    {
        id: "1",
        pos: {
            x : 0,
            y : 0,
        },
        numberOfSections: 2,
        orientation : [0, 1],
        type : "destroyer",
        sectionStatus: ["ok", "ok"],
    },
    {
        id: "2",
        pos: {
            x : 3,
            y : 3,
        },
        numberOfSections: 2,
        orientation : [1, 0],
        type : "destroyer",
        sectionStatus: ["ok", "ok"],
    },
    {
        id: "3",
        pos: {
            x : 5,
            y : 0,
        },
        numberOfSections: 2,
        orientation : [0, 1],
        type : "destroyer",
        sectionStatus: ["ok", "ok"],
    },    
]

const getBoardWithShips = () => {
    const board = generateEmptyBoard("miss");
    mockShipData.forEach((ship)=> {
        for(let i = 0; i< ship.numberOfSections; i++){
            const sectionShipCoords = [ship.pos.x + ship.orientation[0] * i, ship.pos.y + ship.orientation[1] * i];
            console.log(sectionShipCoords);
            const cellIndex = sectionShipCoords[0] + inColTags.length * sectionShipCoords[1];
            console.log(cellIndex);
            board[cellIndex].state = "ship";
        }        
    })
    return board;
}

export const mockStartGameData : GameData = {
    gameId: "id",
    rowTags: inRowTags,
    colTags: inColTags,
    playerBoardData: getBoardWithShips(),
    opponentBoardData: generateEmptyBoard("hidden"),
    playerTurn: false,
}
