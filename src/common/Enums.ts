export enum EClientState {
    // In Fleet Setup game state
    FleetSetup,
    FleetReady,
    // In The OnGoing Game State.    
    WaitingForTurn,
    OnTurn,
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