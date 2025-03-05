import {CellData} from '../../../../types/types.tsx';
import Cell from './Cell.tsx';
import BoardTag from './BoardTag.tsx';

type Props = {
    boardTitle: string;
    rowTags: string[];
    colTags: string[];
    cellData: CellData[];
    onMouseEnterCell?: (index: number) => void;
    onFireAtCell?: (index: number) => void;
    onClickCell?: (index: number) => void;
    onMouseUpCell?: (index:number)=>void;
    onMouseDownCell?: (index:number)=>void;
}

const PlayerBoard = ({boardTitle, rowTags, colTags, cellData, onMouseEnterCell, onFireAtCell, onClickCell, onMouseUpCell, onMouseDownCell}: Props) => {
    return (
        <section className='grid grid-rows-[auto_auto_1fr] grid-cols-[auto_1fr] w-fit rounded-md text-xs bg-BgA'>
            <h2 className="py-3.5 justify-self-center row-start-1 text-3xl col-span-2">
                {boardTitle}
            </h2>
            <div className='z-10 p-2 row-start-2 col-start-2 grid grid-flow-col justify-start w-full'>
                {colTags.map((tag) =>
                    <BoardTag
                        classes='flex items-center min-h-16 h-fit max-h-32 w-12 first:rounded-l last:rounded-r bg-tagBg border-r border-t border-b first:border-l overflow-clip whitespace-nowrap text-ellipsis'
                        key={tag}
                        tag={tag}
                    />
                )}
            </div>
            <div className='z-10 p-2 row-start-3 col-start-1 grid justify-start'>
                {rowTags.map((tag) =>
                    <BoardTag
                        classes='flex items-center w-32 h-12 first:rounded-t last:rounded-b bg-tagBg border-l border-t border-r last:border-b overflow-hidden whitespace-nowrap text-ellipsis'
                        key={tag}
                        tag={tag}
                    />
                )}
            </div>
            <div className='p-2 row-start-3 col-start-2 grid board-grid-template-col-row justify-self-start'>
                {cellData.map((cell) =>
                    <Cell
                        onMouseEnter={onMouseEnterCell}
                        onClickCell={onClickCell}
                        onCellFire={onFireAtCell}
                        onMouseUp={onMouseUpCell}
                        onMouseDown={onMouseDownCell}
                        data={cell}
                        key={cell.index}
                        classes={`relative hover:border-cellBorderHover hover:border active:bg-cellActive w-12 h-12 border-cellBorder cell-border ${cell.pos.y === rowTags.length - 1 ? "cell-border-b " : ""} ${cell.pos.x === colTags.length - 1 ? "cell-border-r " : ""}`}
                    />
                    )}
            </div>
        </section>
    )
}

export default PlayerBoard