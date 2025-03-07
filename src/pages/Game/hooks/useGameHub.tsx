import {useCallback, useEffect, useState} from "react";
import {EClientState, EGameState} from "../../../enums/Enums.ts";
import {useParams} from "react-router-dom";
import {getHub} from "../../../services/hubProvider.ts";

const useGameHub = ({local = false}:{local:boolean}) => {
    // State
    const [clientState, setClientState] = useState<EClientState|null>(null);
    const [gameState, setGameState] = useState<EGameState>(EGameState.Lobby);
    const [sessionError, setSessionError] = useState<Error | null>(null);
    const [serverMessage, setServerMessage] = useState<string>("Waiting for server...");
    const [validId, setValidId] = useState<boolean>(true);
    const {id} = useParams();
    const { invokeHubEvent, onHubEvent, offHubEvent, onHubClose, closeHub, joinHub, getHubConnectionState } = getHub(local);

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
        const handleErrorHubEvent = (message: string)=> {
            setSessionError(new Error(message));
        }
        const handleHubClose = ()=> {
            setSessionError(new Error("Lost connection to hub!"))
            setClientState(null);
        }

        const handleClientStateUpdate = (state: number, message: string)=>{
            setClientState(state as EClientState);
            if(message) setServerMessage(message);
        }

        const handleGameStateUpdate = (state: number, message: string)=>{
            setGameState(state as EGameState);
            if(message) setServerMessage(message);
        }

        const handleSessionNotFound = () => {
            setValidId(false);
            setSessionError(new Error("Session Not Found"));
        }

        // Handle received errors from the hub
        onHubEvent("Error", handleErrorHubEvent);

        // Handle disconnects and reconnects.
        onHubClose(false, handleHubClose)

        // Receive client state update.
        onHubEvent("ClientStateUpdate", handleClientStateUpdate);

        // Receive game state update. Both clients should receive this at the same time.
        onHubEvent("GameStateUpdate", handleGameStateUpdate );

        // Session not found event.
        onHubEvent("SessionNotFound", handleSessionNotFound)

        return () => {
            offHubEvent("Error", handleErrorHubEvent);
            offHubEvent("ClientStateUpdate", handleClientStateUpdate);
            offHubEvent("GameStateUpdate", handleGameStateUpdate );
            offHubEvent("SessionNotFound", handleSessionNotFound)
        }
    },[offHubEvent, onHubEvent, onHubClose])

    //
    return {leaveSession, clientState, gameState, sessionError, validId, serverMessage}
}

export default useGameHub;