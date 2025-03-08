import { EShipType } from "../enums/Enums.ts";
import {ShipData} from "../types/types.tsx";

let id = 0;
const getId = ()=> `ship${++id}`;

export const shipTemplates : ShipData[] =
    [
        {
            id: getId(),
            numberOfSections : 2,
            orientation : [1, 0],
            pos : {x:0, y:0},
            type : EShipType.destroyer,
            sectionStatus : ["ok", "ok"]
        },
        {
            id: getId(),
            numberOfSections : 3,
            orientation : [1, 0],
            pos : {x:0, y:0},
            type : EShipType.submarine,
            sectionStatus : ["ok", "ok", "ok"]
        },
        {
            id: getId(),
            numberOfSections : 3,
            orientation : [1, 0],
            pos : {x:0, y:0},
            type : EShipType.frigate,
            sectionStatus : ["ok", "ok", "ok"]
        },
        {
            id: getId(),
            numberOfSections : 4,
            orientation : [1, 0],
            pos : {x:0, y:0},
            type : EShipType.battleship,
            sectionStatus : ["ok", "ok", "ok", "ok"]
        },
        {
            id: getId(),
            numberOfSections : 5,
            orientation : [1, 0],
            pos : {x:0, y:0},
            type : EShipType.carrier,
            sectionStatus : ["ok", "ok", "ok", "ok", "ok"]
        },
    ];