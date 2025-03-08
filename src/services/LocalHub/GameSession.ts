/** Game session class. Holds game board data, player data, etc.
 * TODO: Game Logic.
 * */

import {EClientState, EGameState} from "../../enums/Enums.ts";
import {CellData} from "../../types/types.tsx";
import {generateEmptyBoard} from "../../utils/BoardInit.ts";

export class GameSession {
    constructor(colTags: string[], rowTags: string[]    ) {
        this.rowTags = rowTags;
        this.colTags = colTags;
        this.playerBoard = generateEmptyBoard(this.rowTags, this.colTags);
        console.log("Instantiated a Game Session");
    }

    gameState: EGameState = EGameState.FleetSetup;
    clientState: EClientState = EClientState.FleetSetup;
    rowTags: string[];
    colTags: string[];
    playerBoard: CellData[];
    computerBoard : CellData[];
}
