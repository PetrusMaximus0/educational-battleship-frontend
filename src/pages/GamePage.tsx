import { Link, useParams } from 'react-router-dom'
import Board from '../components/Board';
import Footer from '../components/Footer';
import {useEffect, useState} from "react";
import {CellData, CellTag} from "../types.tsx";

type Props = {

}

// Placeholder tags
const inColTags: CellTag[]  = [
    "My parent's neighbour", "You", "He", "She", "They", "It", "a", "s", "d", "e"
];

// Placeholder tags
const inRowTags: CellTag[] = [
    "swim everyday", "brush the dog's teeth and then brush the dog's fur", "make the bed", "vacuum the room", "sweep the floor", "a", "b", "c", "d", "e"
];

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
            text: `(${i % inColTags.length}, ${Math.floor(i / inColTags.length)} )`,
            cellState: "hidden",
            selected: false,
        }
        tempBoardData.push(cellData);
    }
    return tempBoardData;
}

const GamePage = (props: Props) => {
    const { id } = useParams();

    const [playerBoardData, setPlayerBoardData] = useState<CellData[]>([]);
    const [opponentBoardData, setOpponentBoardData] = useState<CellData[]>([]);
    const [selectedCell, setSelectedCell] = useState<number>(-1);
    const [rowTags, setRowTags] = useState<CellTag[]>([]);
    const [colTags, setColTags] = useState<CellTag[]>([]);
    
    // Handle clicking a cell on the opponents board.
    const handleClickOpponentBoardCell = (index: number) => {
        const newBoardData = [...opponentBoardData];
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
        setOpponentBoardData(newBoardData);
    }
    
    // Handle clicking a cell on the player's board.
    const handleClickPlayerBoardCell = (index: number) => {}
    
    // Initialize the board at game begin.
    const initBoards = () =>{
            // Set the css property for the row and col number
            document.documentElement.style.setProperty("--columns", inColTags.length.toString());
            document.documentElement.style.setProperty("--rows", inRowTags.length.toString());

            // Obtain and set the row and col tags.
            setRowTags([...inRowTags]);
            setColTags([...inColTags]);

            // Set the board data as state.
            setPlayerBoardData([...getBoardData()]);
            setOpponentBoardData([...getBoardData()]);
            //
    }

    const handleUpdatePlayerBoardData= (newData: CellData[]) =>{
        setPlayerBoardData([...newData]);
    }
    const handleUpdateOpponentBoardData = (newData: CellData[]) =>{
        setOpponentBoardData([...newData]);
    }
    
    const handleFireAtCell = (index: number) => {
        // send cell shot to server and receive new cell state.
        alert("Fired!");
    }
    
    useEffect(()=>{
        // Set up event handlers for socket events.
        // ...
        // Initialize the board.
        initBoards();
        
        return ()=>{
            // Clean up
        } 
    },[])
    
    return (
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 h- min-h-screen bg-BgB text-white'>
            <div className='bg-BgA py-8 px-8'>
                <header className='flex flex-col items-center justify-center gap-6'>
                    <h1 className='text-4xl'> Current Game: <span className='font-bold'> {id} </span> </h1>
                    <nav>
                        <ul className={"flex justify-center items-center gap-4"}>
                            <li className={""}>
                                <Link
                                    className='hover:bg-btnBgHover border border-Text px-4 py-3 bg-btnBg active:bg-btnBgActive rounded-md'
                                    to="/"
                                >
                                    Return Home
                                </Link>                                
                            </li>
                            <li className={""}>
                                <button
                                    className='hover:bg-btnBgHover border border-Text px-4 py-2.5 bg-btnBg active:bg-btnBgActive rounded-md'
                                >
                                    Help!
                                </button>                                
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <main className='flex gap-4 justify-center items-center'>
                <Board 
                    onClickCell={handleClickPlayerBoardCell}
                    onFireAtCell={handleFireAtCell}
                    boardTitle={"Your Ships"} 
                    rowTags={rowTags}
                    colTags={colTags}
                    cellData={playerBoardData}                    
                />
                <Board 
                    onClickCell={handleClickOpponentBoardCell} 
                    onFireAtCell={handleFireAtCell}
                    boardTitle={"Opponent's Ships"}
                    rowTags={rowTags}
                    colTags={colTags}
                    cellData={opponentBoardData}
                />
            </main>
            <Footer />
        </div>
    )
}

export default GamePage