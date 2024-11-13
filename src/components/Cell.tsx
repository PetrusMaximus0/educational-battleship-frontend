import Icon from "@mdi/react";
import {mdiBullseye, mdiEraser, mdiFlagVariant} from "@mdi/js";
import {CellData, CellStateColors} from '../types'
import ActionBtn from "./ActionBtn.tsx";
import { useState } from "react";

type Props = {
    onClickCell: (index: number) => void,
    onCellFire: (index: number) => void,
    data: CellData,
    onDrop? : (index: number) => void,
    onDragOver?: (index: number) => void,
    classes?: string,
}
const Cell = ({onClickCell, onCellFire, data, onDrop, onDragOver, classes = ""}: Props) => {
    const [flagged, setFlagged] = useState<boolean>(false);

    const handleMarkCell = () => {
        if (data.cellState === "hidden" || data.cellState === "miss") {
            setFlagged(true);
        }
    }
    const handleClearCell = () => {
        setFlagged(false);
    }

    const handleCellFire = () => {
        setFlagged(false);
        onCellFire(data.index);
    }

    const handleDragOver = (e : React.DragEvent) => {
        e.preventDefault();
        if(onDragOver) onDragOver(data.index);
    }
    
    const colors: CellStateColors = {
        hidden: "bg-cellHidden",
        hit: "bg-cellHit",
        miss: "bg-cellMiss",
        ship: "bg-cellShip",
        sunk: "bg-cellSunk",
        validPlacement: "bg-green-500",
        invalidPlacement:"bg-red-600",
    }
    const cellBg: string = colors[`${data.cellState}`];
    const cellSelectionStyle = data.selected ? " border border-cellBorderSelected " : "";
    
    return (
        <div 
            className={classes + cellBg + cellSelectionStyle}
            id={`${data.index}`}
            onClick={()=>onClickCell(data.index)}
            onDrop={onDrop ? ()=>onDrop(data.index) : ()=>{}}
            onDragOver={handleDragOver}
        >
            { flagged &&
                <div className={"absolute text-yellow-500 h-full w-full flex justify-center items-center"}>
                    <Icon path={mdiFlagVariant} size={2}/>
                </div>
            }
            {
                data.selected &&
                <div
                    className={"rounded-sm flex justify-center items-end py-0.5 gap-0.5 relative scale-[1.8] z-40 bg-inputBgA h-full w-full"}>
                    <ActionBtn clickHandler={handleCellFire}>
                        <Icon className={"text-actionBtnFire"} path={mdiBullseye} size={1}/>
                    </ActionBtn>
                    <ActionBtn clickHandler={handleMarkCell}>
                        <Icon className={"text-actionBtnMark"} path={mdiFlagVariant} size={1}/>
                    </ActionBtn>
                    <ActionBtn clickHandler={handleClearCell}>
                        <Icon className={"text-actionBtnClear"} path={mdiEraser} size={1}/>
                    </ActionBtn>
                </div>
            }
            
        </div>
    )
}

export default Cell