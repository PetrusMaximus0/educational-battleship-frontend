import {useCallback, useEffect, useState} from "react";
import {EClientState, EGameState} from "../../../enums/Enums.ts";
import {useParams} from "react-router-dom";
import {getHub} from "../../../services/hubProvider.ts";

const useGameHub = () => {
    // State
    const [clientState, setClientState] = useState<EClientState|null>(null);
    const [gameState, setGameState] = useState<EGameState>(EGameState.Lobby);
    const [sessionError, setSessionError] = useState<Error | null>(null);
    const [serverMessage, setServerMessage] = useState<string>("Waiting for server...");
    const [validId, setValidId] = useState<boolean>(true);
    const {id} = useParams();
    const { invokeHubEvent, onHubEvent, onHubClose, closeHub, joinHub, getHubConnectionState } = getHub(id==="local");

    // Handlers
    const leaveSession = useCallback(async () => await closeHub() ,[closeHub]);

    // We don't want this component to mount anything other than an error if it doesn't have a valid id from parameters.
    useEffect(()=>{
        if(!id) {
            setSessionError(new Error("Invalid session ID"));
            setValidId(false);
        }
    },[id])

    // Joining the session and reconnecting.
    useEffect(()=>{
        const joinSession = async () => {
            // Establish Connection to the server.
            if(getHubConnectionState()!=="Connected") {
                setServerMessage(getHubConnectionState() as string);
                return;
            }
            // Join a particular session with the given id.
            const {error: joinSessionError} = await invokeHubEvent("JoinSession", id);
            if(joinSessionError) {
                setSessionError(joinSessionError);
                return;
            }
        }

        // use an IIFE to Ensure these two are awaited so that there are no problems registering hub event handlers before there is a hub connection.
        (async ()=>{
            await joinHub();
            await joinSession();
        })()

    },[id])

    // Register hub event handlers
    useEffect(()=>{
        // Handle received errors from the hub
        onHubEvent("Error", (message: string)=> {
            setSessionError(new Error(message));
        })

        // Handle disconnects and reconnects.
        onHubClose(false, ()=> {
            setSessionError(new Error("Lost connection to hub!"))
            setClientState(null);
        })

        // Receive client state update.
        onHubEvent("ClientStateUpdate", (state: number, message: string)=>{
            setClientState(state as EClientState);
            if(message) setServerMessage(message);
        })

        // Receive game state update. Both clients should receive this at the same time.
        onHubEvent("GameStateUpdate", (state: number, message: string)=>{
            setGameState(state as EGameState);
            if(message) setServerMessage(message);
        })

        // Session not found event.
        onHubEvent("SessionNotFound", () => {
            setValidId(false);
            setSessionError(new Error("Session Not Found"));
        })

    },[])

    //
    return {leaveSession, clientState, gameState, sessionError, validId, serverMessage}
}

export default useGameHub;