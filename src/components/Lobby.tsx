import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

type props = {
    validId : boolean,
}

const Lobby = ({validId} : props)=> {
    // State
    const [justCopiedId, setJustCopiedId] = useState(false);
    const { id } = useParams();   
    
    //
    const navigate = useNavigate();
    
    // Handlers
    let copyHandler = 0;
    
    const handleCopyId = async () => {
        if(id!==undefined) {
            // Copy Session ID to the clipboard.
            await navigator.clipboard.writeText(id);
            setJustCopiedId(true);

            // Set a small timer to change the text of the button.
            clearTimeout(copyHandler);
            copyHandler = setTimeout(() =>{
                setJustCopiedId(false);
            }, 5000)
        }
    }
    
    useEffect(() => {
        let timerHandler = 0;
        if(!validId) {
           timerHandler = setTimeout(() =>{
                navigate("/");
            }, 5000)
        }
        return () => {
            clearTimeout(timerHandler);
        }
    },[validId])
    
    return (
        validId && 
        <section className={"text-center"}>
            <div className={"text-center"}>
                <h2 className={"mb-4 text-xl"}> Your session ID: </h2>
                <div className={"flex gap-2 justify-center items-center"}>
                    <p
                        className={"my-2 flex gap-2 justify-center items-center"}
                    >
                        {id}
                    </p>
                    <button
                        className={"hover:bg-btnBgHover active:bg-btnBgActive border px-3 py-2 rounded-sm"}
                        onClick={handleCopyId}
                    >
                        {justCopiedId ? "Copied!" : "Copy ID"}
                    </button>
    
                </div>
            </div>
        </section>
        || <p> Invalid session Id, returning home... </p>
    )
}

export default Lobby;