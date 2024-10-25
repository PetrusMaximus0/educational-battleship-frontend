import Cell from './Cell'
import { CellData } from '../types';

type Props = {
    numRows?: number,
    numCols?: number,
}

const Board = ({ numRows = 10, numCols = 10 }: Props) => {
    const rowTags: string[] = [];
    for (let i = 0; i < numRows; i++) {
        rowTags.push(`Tag: ${i}`);
    }

    const colTags: string[] = [];
    for (let i = 0; i < numCols; i++) {
        colTags.push(`Tag: ${i}`);
    }

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
        <div className="game-board mx-auto my-12 w-fit border border-black p-2 text-xs">
            <div className='row-tags '>
                {rowTags.map((row) =>
                    <p
                        className="p-2 h-16 w-16 flex items-center justify-center border-l border-t border-r last:border-b border-black"
                        key={row}>

                    </p>)
                }
            </div>
            <div className='col-tags'>
                {colTags.map((col) =>
                    <p
                        className='p-2 h-16 w-16 flex items-center justify-center border-l border-t border-b last:border-r border-black'
                        key={col}>
                    </p>)}
            </div>
            <div className='cells w-full'>
                {
                    boardData.map((cell) =>
                        <Cell
                            classes={`p-2 w-full cell-border ${cell.pos.y === numRows - 1 ? "cell-border-b " : ""} ${cell.pos.x === numCols - 1 ? "cell-border-r " : ""}`}
                            key={cell.index}
                            data={cell}
                        />)}

            </div>
        </div>
    )
}

export default Board