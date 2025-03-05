import {ShipData} from "../../../../types/types.tsx"
import {useCallback} from "react";
import Ship from "./Ship.tsx";

type ShipBrushProps = {
    selectedShip: ShipData | null,
    shipBrushPos: {x: number; y: number}
}

const ShipBrush = ({selectedShip, shipBrushPos} : ShipBrushProps) =>{
    // Handlers
    const getShipStyleTransform = useCallback(() => {
        if (!selectedShip) return "translate(-50%, -50%) rotate(0deg)";
        const ort = selectedShip.orientation;

        // Determine rotation and offsets based on orientation
        if (ort[0] === -1) {
            return `translate(calc(-50% - 50px), -50%) rotate(180deg)`; // West
        } else if (ort[1] === 1) {
            return `translate(-50%, calc(-50% + 50px)) rotate(90deg)`; // South
        } else if (ort[1] === -1) {
            return `translate(-50%, calc(-50% - 50px)) rotate(-90deg)`; // North
        } else {
            return `translate(calc(-50% + 50px), -50%) rotate(0deg)`; // East
        }
    },[selectedShip]);

    return selectedShip && (
        <div
            className={`absolute pointer-events-none`}
            id={"ShipBrush"}
            style={{
                zIndex: 10000,
                left: `${shipBrushPos.x}px`,
                top: `${shipBrushPos.y}px`,
                transform: getShipStyleTransform(),
                transformOrigin: "center center"
            }}
        >
            <Ship data={selectedShip} isPlaced={true}/>
        </div>
    )
}

export default ShipBrush;