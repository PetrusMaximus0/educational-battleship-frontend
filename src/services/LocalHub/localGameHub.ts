import {GameSession} from "./GameSession.ts";

let gameSession = null;

// Types
type LocalHubEventHandler = (...args: any[]) => void;
type registeredEvent = { [key: string]: LocalHubEventHandler}

/** Local Hub event handlers */
const handleRequestSession = (rowTags: string[], colTags: string[]) => {
    // Create a new session based on the tags.
    gameSession = new GameSession(rowTags, colTags);

    // Send a session ID = "local" to the client.
    emitHubEvent("ReceiveSessionId", "local");
};

/** Stores all event handlers registered by the Client */
const clientEventHandlers : registeredEvent = { };

/** Stores all event handlers registered in the Hub */
const localEventHandlers : registeredEvent = {
    "RequestNewSession": handleRequestSession,
};


type JoinHubResp = () => { error: null|Error };
const joinHub : JoinHubResp  = () => { return { error: null } }

/** Handle client request to close the hub. */
const closeHub = async () => {
    // Clears all registered events.
    Object.keys(clientEventHandlers).forEach(key=>delete clientEventHandlers[key]);
}

/** Bind handler to the Hub connection close event*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onHubClose = (_retry : boolean = true, _handleOnClose?: LocalHubEventHandler, ..._handlerArgs: any[]) => {
    console.log("dummy event handler");
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
const getHubConnectionState = () => "Local";

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
