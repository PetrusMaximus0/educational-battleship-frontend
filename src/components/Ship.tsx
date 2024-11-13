import {ShipData} from "../types.tsx";

type props = {
    data: ShipData,
    isPlaced: boolean,
    onShipDragStart?: (id: string)=> void
}

const Ship = ({data, isPlaced, onShipDragStart} : props) => {
    const shipParts : any[] = [];
    const buildShip = () => {
        for (let i = 0; i < data.size; i++) {
            shipParts.push(
                <div key={`${data.id}_${i}`} className={`h-12 w-12`}></div>
            )
        }
    }
    const handleShipDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        console.log(e.nativeEvent.offsetY)
        console.log(e.nativeEvent.offsetX)
        e.dataTransfer.setDragImage(e.currentTarget, 0.5*48, 0.5*48);
        if(onShipDragStart) onShipDragStart(data.id);        
    }
    buildShip();
    
    return(
            <div 
                className={`z-[10000] flex hover:bg-yellow-500 w-fit h-fit border-2 bg-slate-800 ${isPlaced ? " border-green-700 " : " border-red-600 "}`}
                draggable={true} 
                onDragStart={handleShipDragStart}
                id={data.id}
            >
                {shipParts}
            </div>
    )
}

export default Ship;