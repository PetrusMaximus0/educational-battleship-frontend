import { CellData } from '../types';
import Cell from './Cell';
import Tag from './Tag';

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
        <>
            <div className='grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-slate-800 w-fit rounded-md text-xs'>
                <div className='p-2 row-start-1 col-start-2 grid grid-flow-col justify-start w-full'>
                    {inColTags.map((tag) =>
                        <Tag
                            classes='flex items-center min-h-16 h-fit max-h-32 w-16 border-r border-t border-b first:border-l overflow-hidden whitespace-nowrap text-ellipsis'
                            key={tag}
                            tag={tag}
                        />
                    )}
                </div>
                <div className='p-2 row-start-2 col-start-1 grid justify-start'>
                    {inRowTags.map((tag) =>
                        <Tag
                            classes='flex items-center w-32 h-16 border-l border-t border-r last:border-b overflow-hidden whitespace-nowrap text-ellipsis'
                            key={tag}
                            tag={tag}
                        />
                    )}
                </div>
                <div className='p-2 row-start-2 col-start-2 grid board-grid-template-col-row'>
                    {
                        boardData.map((cell) =>
                            <Cell
                                data={cell}
                                key={cell.index}
                                classes={`hover:bg-slate-500 active:bg-black w-16 h-16 cell-border ${cell.pos.y === numRows - 1 ? "cell-border-b " : ""} ${cell.pos.x === numCols - 1 ? "cell-border-r " : ""}`}
                            />)
                    }
                </div>
            </div>
        </>
    )
}

export default Board