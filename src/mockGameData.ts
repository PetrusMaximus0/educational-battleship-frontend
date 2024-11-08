
// Placeholder tags
import {CellData, CellTag} from "./types.tsx";

export const inColTags: CellTag[]  = [
    "My parent's neighbour", "You", "He", "She", "They", "It", "a", "s", "d", "e"
];

// Placeholder tags
export const inRowTags: CellTag[] = [
    "swim everyday", "brush the dog's teeth and then brush the dog's fur", "make the bed", "vacuum the room", "sweep the floor", "a", "b", "c", "d", "e"
];

// Placeholder function to generate board.
export const getBoardData = () => {
    // Construct temporary board data to render the cells.
    const tempBoardData : CellData[] = [];
    for (let i = 0; i < inRowTags.length * inColTags.length; i++) {
        const cellData: CellData = {
            index: i,
            pos: {
                x: i % inColTags.length,
                y: Math.floor(i / inColTags.length)
            },
            text: `(${i % inColTags.length}, ${Math.floor(i / inColTags.length)} )`,
            cellState: "hidden",
            selected: false,
        }
        tempBoardData.push(cellData);
    }
    return tempBoardData;
}