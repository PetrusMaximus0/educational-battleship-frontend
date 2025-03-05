import {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";

const JoinGameForm = () => {
    const [gameCode, setGameCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    /** Redirects the user to the connecting page */
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        navigate(`/game/${gameCode}`);
    }

    return(
        <form name='join-game' className='px-4 py-6 flex flex-col gap-4' onSubmit={handleFormSubmit} >
            <label className='flex gap-6 items-center justify-start text-nowrap' htmlFor="game-code">
                Game Code:
                <input
                    className="max-w-48 rounded-md py-1 px-2 text-center placeholder:text-slate-400 placeholder:text-center bg-inputBgA text-white text-xl"
                    type="text"
                    name="game-code"
                    id="game-code"
                    onChange={(e)=>setGameCode(e.target.value)}
                    value={gameCode ? gameCode : ""}
                    required
                    minLength={36}
                    maxLength={36} />
            </label>
            <p className={"text-white text-sm"}>
                {
                    loading && "Loading..." ||
                    "Enter the code provided by your game host."
                }
            </p>
            <button className='hover:bg-btnBgHover active:bg-btnBgActive bg-btnBg rounded-md border py-2 px-6 mx-auto' type="submit">
                Join Game
            </button>
        </form>
    )
}

export default JoinGameForm;