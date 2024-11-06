import {CellData, CellState, CellTag, IInitializeBoard, IUpdateCellState} from '../types';
import Cell from './Cell';
import Tag from './Tag';
import {useEffect, useState} from "react";

type Props = {
    
}

//

const inColTags: CellTag[]  = [
    "My parent's neighbour", "You", "He", "She", "They", "It", "a", "s", "d", "e"
];

const inRowTags: CellTag[] = [
    "swim everyday", "brush the dog's teeth and then brush the dog's fur", "make the bed", "vacuum the room", "sweep the floor", "a", "b", "c", "d", "e"
];
const Board = ({}: Props) => {
    
    const [rowTags, setRowTags] = useState<CellTag[]>([]);
    const [colTags, setColTags] = useState<CellTag[]>([]);
    const [boardData, setBoardData] = useState<CellData[]>([]);
    const [selectedCell, setSelectedCell] = useState<number>(-1);
    
    // Placeholder function for socket event for initializing the cell data.
    const onInitializeBoard : IInitializeBoard = (inColTags: CellTag[], inRowTags: CellTag[], inCellData: CellData[]) => {
        // Set the css property for the row and col number.
        document.documentElement.style.setProperty("--columns", inColTags.length.toString());
        document.documentElement.style.setProperty("--rows", inRowTags.length.toString());
        
        // Set the initial game state.
        setRowTags([...inRowTags]);
        setColTags([...inColTags]);
        setBoardData([...inCellData]);
    }
    
    // Event handler for updating a particular cell's state.
    const onUpdateCellState : IUpdateCellState = (cellIndex: number, newCellState: CellState) => {
        const newCellData = [...boardData];
        newCellData[cellIndex].cellState = newCellState;
        setBoardData(newCellData);        
    }
    
    // On cell click open the action menu for the cell.
    const onClickCell = (index: number) => {
        const newBoardData = [...boardData];               
        if(index===selectedCell){
            // Clicking on the same cell, deselect the cell.
            newBoardData[index].selected = false;
            setSelectedCell(-1);
        }else if(selectedCell !== -1) {
            // Clicking on un selected cell.
            // Deselect previous
            newBoardData[selectedCell].selected = false;

            // Select new
            newBoardData[index].selected = true;
            setSelectedCell(index);
        } else {
            // No cell is selected
            // Select new cell.
            newBoardData[index].selected = true;
            setSelectedCell(index);
        }               
        
        // Set board state.
        setBoardData(newBoardData);
    }
    
    // 
    const onCellFire = (index: number) => {
        // send cell shot to server and receive new cell state.
    }
    
    const initBoard = () => {
        // Set the css property for the row and col number
        document.documentElement.style.setProperty("--columns", inColTags.length.toString());
        document.documentElement.style.setProperty("--rows", inRowTags.length.toString());
        
        // Obtain and set the row and col tags.
        setRowTags([...inRowTags]);
        setColTags([...inColTags]);
        
        // Construct temporary board data to render the cells.
        const tempBoardData : CellData[] = [];
        for (let i = 0; i < inRowTags.length * inColTags.length; i++) {
            const cellData: CellData = {
                index: i,
                pos: {
                    x: i % colTags.length,
                    y: Math.floor(i / colTags.length)
                },
                text: `(${i % colTags.length}, ${Math.floor(i / colTags.length)} )`,
                cellState: "hidden",
                selected: false,
            }
            tempBoardData.push(cellData);
        }        
        // Set the board data as state.
        setBoardData([...tempBoardData]);
        
        //
    }
    
    useEffect(()=>{
        // Set up the socket connection logic
        initBoard();       
        
        return () => {
            // Clean up the socket connection, etc...
        }
    },[])
    
    return (
        <>
            <div className='grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-BgA w-fit rounded-md text-xs'>
                <div className='p-2 row-start-1 col-start-2 grid grid-flow-col justify-start w-full'>
                    {colTags.map((tag) =>
                        <Tag
                            classes='flex items-center min-h-16 h-fit max-h-32 w-16 first:rounded-l last:rounded-r bg-tagBg border-r border-t border-b first:border-l overflow-hidden whitespace-nowrap text-ellipsis'
                            key={tag}
                            tag={tag}
                        />
                    )}
                </div>
                <div className='p-2 row-start-2 col-start-1 grid justify-start'>
                    {rowTags.map((tag) =>
                        <Tag
                            classes='flex items-center w-32 h-16 first:rounded-t last:rounded-b bg-tagBg border-l border-t border-r last:border-b overflow-hidden whitespace-nowrap text-ellipsis'
                            key={tag}
                            tag={tag}
                        />
                    )}
                </div>
                <div className='p-2 row-start-2 col-start-2 grid board-grid-template-col-row'>
                    {
                        boardData.map((cell) =>
                            <Cell
                                onClickCell={onClickCell}
                                data={cell}
                                key={cell.index}
                                classes={`relative hover:border-cellBorderHover hover:border active:bg-cellActive w-16 h-16 border-cellBorder cell-border ${cell.pos.y === rowTags.length - 1 ? "cell-border-b " : ""} ${cell.pos.x === colTags.length - 1 ? "cell-border-r " : ""}`}
                                onCellFire={onCellFire}
                            />)
                    }
                </div>
            </div>
        </>
    )
}

export default Board