import {ShipData} from "../types.tsx";

type props = {
    data: ShipData,
    isPlaced: boolean,
    onMouseDown?: (data: ShipData) => void,
}

const Ship = ({data, isPlaced, onMouseDown} : props) => {
    const shipParts : any[] = [];
    const buildShip = () => {
        for (let i = 0; i < data.size; i++) {
            shipParts.push(
                <div key={`${data.id}_${i}`} className={`h-8 w-8`}></div>
            )
        }
    }
    buildShip();
    
    const handleOnMouseDown = () => {
        if(onMouseDown) onMouseDown(data);
    }
    
    return(
            <div 
                className={`flex hover:bg-yellow-500 w-fit h-fit border-2 bg-slate-800 ${isPlaced ? " border-green-700 " : " border-red-600 "}`}
                onMouseDown={handleOnMouseDown}
            >
                {shipParts}
            </div>
    )
}

export default Ship;