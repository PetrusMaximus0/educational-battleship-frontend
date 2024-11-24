import {CellData, GameData, ShipData} from "../common/types.tsx";
import {ECellState, EShipType} from "../common/Enums.ts";

// Placeholder tags
const inColTags: string[] = ["I", "You", "He", "She", "It", "We", "They"];
const inRowTags: string[] = ["A cat", "A dog", "A parrot", "A tiger", "A mouse", "A turtle", "A bird" ];

// Placeholder function to generate board.
const generateEmptyBoard = (defaultState?: ECellState ) => {
    // Construct temporary board data to render the cells.
    const tempBoardData : CellData[] = [];
    for (let i = 0; i < inRowTags.length * inColTags.length; i++) {
        const cellData: CellData = {
            index: i,
            pos: {
                x: i % inColTags.length,
                y: Math.floor(i / inColTags.length)
            },
            state: defaultState ? defaultState : ECellState.hidden,
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
    playerBoardData: generateEmptyBoard(ECellState.miss),
    opponentBoardData: generateEmptyBoard(ECellState.hidden),
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
        type : EShipType.destroyer,
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
        type : EShipType.destroyer,
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
        type : EShipType.destroyer,
        sectionStatus: ["ok", "ok"],
    },    
]
const getBoardWithShips = () => {
    const board = generateEmptyBoard(ECellState.miss);
    mockShipData.forEach((ship)=> {
        for(let i = 0; i< ship.numberOfSections; i++){
            const sectionShipCoords = [ship.pos.x + ship.orientation[0] * i, ship.pos.y + ship.orientation[1] * i];
            console.log(sectionShipCoords);
            const cellIndex = sectionShipCoords[0] + inColTags.length * sectionShipCoords[1];
            console.log(cellIndex);
            board[cellIndex].state = ECellState.ship;
        }        
    })
    return board;
}
export const mockStartGameData : GameData = {
    gameId: "id",
    rowTags: inRowTags,
    colTags: inColTags,
    playerBoardData: getBoardWithShips(),
    opponentBoardData: generateEmptyBoard(ECellState.hidden),
    playerTurn: false,
}
