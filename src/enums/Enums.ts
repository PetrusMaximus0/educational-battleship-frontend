export enum EClientState {
    // In Fleet Setup game state
    FleetSetup,
    FleetReady,
    // In The OnGoing Game State.
    WaitingForTurn,
    OnTurn,
    ApprovingShot,
    PendingShotApproval,
    // Post Game
    Defeated,
    Victor
}

export enum EGameState {
    Lobby,
    FleetSetup,
    GameOnGoing,
    GameOver,
}

export enum EFleetSetupState {
    placing = "Maneuvering",
    placed = "In Position",
    validating = "Validating Position",
    validated = "Ready",
}

export enum ECellState {
    hidden= "hidden",
    hit= "hit",
    ship= "ship",
    miss= "miss",
    revealed="revealed",
    sunk= "sunk",
    validPlacement= "validPlacement",
    invalidPlacement= "invalidPlacement",    
}

export enum EShipType{
    destroyer,
    submarine,
    carrier,
    frigate,
    battleship,
}
