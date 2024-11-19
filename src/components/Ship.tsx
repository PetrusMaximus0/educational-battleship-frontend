import {ShipData} from "../types.tsx";
import React from "react";

type props = {
    data: ShipData,
    isPlaced: boolean,
    onMouseDown?: (data: ShipData) => void,
    onMouseUp?: () => void;
}

const Ship = ({data, isPlaced, onMouseDown, onMouseUp} : props) => {
    const shipParts : any[] = [];
    const buildShip = () => {
        for (let i = 0; i < data.numberOfSections; i++) {
            shipParts.push(
                <div key={`${data.id}_${i}`} className={`h-8 w-8`}></div>
            )
        }
    }
    buildShip();
    
    const handleOnMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if(onMouseDown) onMouseDown(data);
    }
    const handleOnMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        if(onMouseUp) onMouseUp();
    }
    
    return(
            <div 
                className={`flex hover:bg-yellow-500 w-fit h-fit border-2 bg-slate-800 ${isPlaced ? " border-green-700 " : " border-red-600 "}`}
                onMouseDown={handleOnMouseDown}
                onMouseUp={handleOnMouseUp}
            >
                {shipParts}
            </div>
    )
}

export default Ship;