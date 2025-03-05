// Types
type LocalHubEventHandler = () => void;

const joinHub = async () => {

}

/** Handle client request to close the hub. */
const closeHub = async () => {

}

/** Bind handler to the Hub connection close event*/
const onHubClose = (retry : boolean = true, handleOnClose?: LocalHubEventHandler, ...handlerArgs: any[]) => {

}

/** Binds events based on a connection */
const onHubEvent = (eventName: string, callback: LocalHubEventHandler) => {

}

/** Unbinds events */
const offHubEvent = (eventName: string, callback: LocalHubEventHandler) => {

}

/***/
const getHubConnectionState = () => "Local Connection";

/***/
const invokeHubEvent = async (eventName: string, ...eventArgs: any[]) => {

}

/***/
export {invokeHubEvent, onHubEvent, offHubEvent, onHubClose, closeHub, joinHub, getHubConnectionState}
