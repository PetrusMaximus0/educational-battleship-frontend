// TODO: Ship setup events.
// TODO: Game play events.

import {GameSession} from "./GameSession.ts";
import {getNewShipPool} from "../../utils/ShipPlacement.ts";

let gameSession : GameSession | null = null;

// Types
type LocalHubEventHandler = (...args: any[]) => void;
type registeredEvent = { [key: string]: LocalHubEventHandler}

/** Local Hub event handlers */
const handleRequestSession = (rowTags: string[], colTags: string[]) => {
    // Create a new session based on the tags.
    if(!gameSession) gameSession = new GameSession(rowTags, colTags);

    // Send a session ID = "local" to the client.
    emitHubEvent("ReceiveSessionId", "local");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleJoinSession = (_id: string) => {
    if(!gameSession) return;
    emitHubEvent("GameStateUpdate", gameSession.gameState);
    emitHubEvent("ClientStateUpdate", gameSession.clientState);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleFleetSetupInit = (_id : string) => {
    if(!gameSession) return;
    const shipData = getNewShipPool(gameSession.rowTags.length, gameSession.colTags.length);
    emitHubEvent("BeginFleetSetup", gameSession.rowTags, gameSession.colTags, gameSession.playerBoard, shipData)
}

/** Stores all event handlers registered by the Client */
const clientEventHandlers : registeredEvent = { };

/** Stores all event handlers registered in the Hub */
const localEventHandlers : registeredEvent = {
    "RequestNewSession": handleRequestSession,
    "JoinSession": handleJoinSession,
    "FleetSetup": handleFleetSetupInit,
};
const stopConnection = () => {
    closeHub();
};
type JoinHubResp = () => { error: null|Error };
const joinHub : JoinHubResp  = () => {
    // Add cleanup event listeners for connection stopping.
    window.addEventListener("beforeunload", stopConnection);
    window.addEventListener("pagehide", stopConnection);
    window.addEventListener("popstate", stopConnection);

    return { error: null }
}

/** Handle client request to close the hub. */
const closeHub = async () => {
    // Clears all registered events.
    Object.keys(clientEventHandlers).forEach(key=>delete clientEventHandlers[key]);

    // Clear the game session variable.
    gameSession = null;
    console.log("Hub Closed")
}

/** Bind handler to the Hub connection close event*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onHubClose = (_retry : boolean = true, _handleOnClose?: LocalHubEventHandler, ..._handlerArgs: any[]) => {
}

/** Binds events based on a connection */
const onHubEvent = (eventName: string, callback: LocalHubEventHandler) => {
    clientEventHandlers[eventName] = callback;
}

/** Unbinds events, safe to ignore the callback for now */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const offHubEvent = (eventName: string, _callback: LocalHubEventHandler) => {
    delete clientEventHandlers[eventName];
}

/***/
const getHubConnectionState = () => "Connected";

/***/
const invokeHubEvent = async (eventName: string, ...eventArgs: any[]) => {
    // Run the local event handlers.
    const callback = localEventHandlers[eventName];
    if(!callback) { return {error: new Error(`Event "${eventName}" not found.`)} }
    callback(...eventArgs);
    return {error: null};
}

const emitHubEvent = (eventName: string, ...eventArgs: any[]) => {
    const callback = clientEventHandlers[eventName];
    if(!callback) { return {error: new Error(`Event "${eventName}" not found.`)} }
    callback(...eventArgs);
    return {error: null};
}

/***/
export {invokeHubEvent, onHubEvent, offHubEvent, onHubClose, closeHub, joinHub, getHubConnectionState}
