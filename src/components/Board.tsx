import Cell from './Cell'
import { CellData } from '../types';

type Props = {
    colTags?: string[],
    rowTags?: string[],
}

const inColTags: string[] = [
    "My parent's neighbour", "You", "He", "She", "They", "It", "a", "s", "d", "e"
];

const inRowTags: string[] = [
    "swim everyday", "brush the dog's teeth and then brush the dog's fur", "make the bed", "vaccum the room", "sweep the floor", "a", "b", "c", "d", "e"
];

const Board = ({ rowTags = inRowTags, colTags = inColTags }: Props) => {
    const numRows = rowTags.length;
    const numCols = colTags.length;

    const boardData: CellData[] = [];
    for (let i = 0; i < numRows * numCols; i++) {
        const cellData: CellData = {
            index: i,
            pos: {
                x: i % numCols,
                y: Math.floor(i / numCols)
            },
            text: `(${i % numCols}, ${Math.floor(i / numCols)} )`,
        }
        boardData.push(cellData);
    }

    document.documentElement.style.setProperty("--columns", numCols.toString());
    document.documentElement.style.setProperty("--rows", numRows.toString());

    return (
        <div className="game-board border border-black p-2 text-[0.60rem] my-8 font-semibold mx-auto">
            <h2
                className='text-center text-4xl border-t border-b border-black py-4 row-start-1 col-start-1 col-span-2'
            >
                Your (Enemy's) Board
            </h2>
            <div className='row-tags'>
                {rowTags.map((row) =>
                    <p
                        className="overflow-auto p-1 w-full h-16 max-w-28 flex items-start border-l border-t border-r last:border-b border-black"
                        key={row}
                    >
                        {row}

                    </p>)
                }
            </div>
            <div className='col-tags w-fit h-fit'>
                {colTags.map((col) =>
                    <p
                        className='overflow-auto p-1 w-16 h-full max-h-28 flex items-center justify-start border-l border-t border-b last:border-r border-black'
                        key={col}
                    >
                        {col}
                    </p>)}
            </div>
            <div className='cells w-fit'>
                {boardData.map((cell) =>
                    <Cell
                        classes={`hover:bg-blue-200 active:bg-black w-16 h-16 cell-border ${cell.pos.y === numRows - 1 ? "cell-border-b " : ""} ${cell.pos.x === numCols - 1 ? "cell-border-r " : ""}`}
                        key={cell.index}
                        data={cell}
                    />)}
            </div>
        </div>
    )
}

export default Board