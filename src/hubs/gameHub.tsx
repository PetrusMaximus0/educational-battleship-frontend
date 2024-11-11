import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

export type JoinHubResp = () => Promise<{connection: HubConnection, error: null} | {connection: null, error: Error} >;
export type GameHubConnection = HubConnection;

// Singleton Connection Instance
let connectionInstance : HubConnection | null = null;

const stopConnection = async () => {
    if(connectionInstance) {
        try {
            await connectionInstance.stop();
            connectionInstance = null;
        }catch(error){
            console.error("Error stopping connection: ", error);
        }
    }
}

/** Starts a connection to the server. 
 * Handles errors and returns an object of type {conn: HubConnection | null, error: Error | null}
 * where at least one of the elements is not null. 
 */
const joinHub : JoinHubResp  = async () => {
    if(connectionInstance && connectionInstance.state === "Connected") {
        return {connection: connectionInstance, error : null};
    }
    
    try{
        if(!connectionInstance) {
            // Create a new connection
            connectionInstance =
                new HubConnectionBuilder()
                    .withUrl("http://localhost:5154/battlespeak")
                    .configureLogging(LogLevel.Information)
                    .build();
            
            // Add cleanup event listeners for connection stopping.
            window.addEventListener("beforeunload", stopConnection);
            window.addEventListener("pagehide", stopConnection);
            window.addEventListener("popstate", stopConnection);
        }
        
        // Start connecting
        await connectionInstance.start();
        
        //
        return {connection: connectionInstance, error: null};
    }catch (error) {
        // return the error as Error type.
        const returnedErr = error instanceof Error ? error : new Error(`${error}`);
        return {connection: null, error: returnedErr};
    }
}

const closeHub = async () => {
    if(!connectionInstance) {
        console.log("conn is null when trying to close hub");
        return;
    }
    console.log("Trying to close with connection state: ", connectionInstance.state)
    if(["Disconnecting", "Connection", "Reconnecting"].includes(connectionInstance.state)) {
        // Wait for a stable state.        
        console.log("Waiting for stable state...");
        await new Promise((resolve)=> setTimeout(resolve, 100));
        await closeHub();
    }else{
        await connectionInstance.stop();
        connectionInstance = null;
    }
}

/** Handle the Hub connection close event*/
type OnHubEventHandler = (...args: any)=>void;
const onHubClose = (retry : boolean = true, handleOnClose?: OnHubEventHandler, ...handlerArgs: any[]) => {
    // Return and do nothing if the connection is not valid.
    if(!connectionInstance) return;
    
    connectionInstance.onclose(async () => {
        if(handleOnClose) handleOnClose(...handlerArgs);
        if(retry && connectionInstance) await connectionInstance.start();
    })        
} 

/** Binds events based on a connection */
const onHubEvent = (eventName: string, callback: OnHubEventHandler) =>{
    if(!connectionInstance) return;
    connectionInstance.on(eventName, callback);    
}

const getHubConnectionState = () =>{
    return connectionInstance ? connectionInstance.state : null;
}

const invokeHubEvent = async (eventName: string, ...eventArgs: any[]) => {
    try {
        if(!connectionInstance) {
            throw new Error("Connection Instance is null");
        }
        if(connectionInstance.state === "Connected") {
            await connectionInstance.invoke(eventName, ...eventArgs);
            return {error: null};
        }else{
            throw new Error(`Connection state is: ${connectionInstance.state}`);
        }
    }catch (error) {
        // return the error as Error type.
        const returnedErr = error instanceof Error ? error : new Error(`${error}`);
        return {error: returnedErr};
    }
}

export {invokeHubEvent, onHubEvent, onHubClose, closeHub, joinHub, getHubConnectionState}


