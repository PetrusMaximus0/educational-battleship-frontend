import { ChangeEvent, FormEvent, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import Footer from '../components/Footer';

type Props = {}

const HomePage = ({ }: Props) => {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [gameCode, setGameCode] = useState<string | null>(null);

    const navigate = useNavigate();

    const onJoinGame = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        navigate(`/game/client/connect/${gameCode}`);

        // Look for game and connect.
        // If error, then show error message.
        // Test loading functionality.

    }

    /** Update the form state */
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Should perform validation
        const newVal = e.target.value;
        setGameCode(newVal);
    }
    
    return (
        <div className='grid grid-rows-[auto_auto_auto] content-between min-h-screen bg-BgB text-white'>
            <header className='bg-BgA py-8 px-8'>
                <div className='mx-auto max-w-screen-md flex flex-col gap-4 items-center text-center md:text-left'>
                    <h1 className='text-5xl'>Battle Speak</h1>
                    <p className='text-lg'>Practice your english speaking and listening skills, while playing a fun strategic game.</p>
                </div>
            </header>
            <main className='py-12 px-8'>
                <section className='flex flex-col max-w-screen-md items-center mx-auto gap-4 px-4 py-8 bg-BgA rounded-lg'>
                    <h2 className="text-4xl font-light text-center pb-6">
                        Let's get started...
                    </h2>
                    <hr className='border-1 w-full' />
                    <form name='join-game' className='px-4 py-6 mx-auto flex flex-col gap-4' onSubmit={onJoinGame} >
                        <label className='flex gap-6 items-center justify-start text-nowrap' htmlFor="game-code">
                            Game Code:
                            <input
                                className="max-w-48 rounded-md py-1 px-2 text-center placeholder:text-slate-400 placeholder:text-center bg-inputBgA text-white text-xl"
                                type="text"
                                name="game-code"
                                id="game-code"
                                onChange={onInputChange}
                                value={gameCode ? gameCode : ""}
                                required
                                minLength={36}
                                maxLength={36} />
                        </label>
                        <p className={error ? "text-red-700 font-semibold" : "text-white" + "text-sm"}>
                            {!error && !loading &&
                                <>
                                    Enter the code provided by your game host.
                                </>
                                || error &&
                                <>
                                    *{error.message}
                                </>
                                || loading &&
                                <>
                                    Loading...
                                </>
                            }
                        </p>
                        <button className='hover:bg-btnBgHover active:bg-btnBgActive bg-btnBg rounded-md border py-2 px-6 mx-auto' type="submit">
                            Join Game
                        </button>
                    </form>
                    <hr className='border-1 w-full' />
                    <div className="px-4 pt-6 w-full h-full flex justify-center">
                        <Link
                            className='hover:bg-btnBgHover active:bg-btnBgActive bg-btnBg border rounded-md py-2 px-6 text-center'
                            to={"/game/tag-setup"}
                        >
                            Host Game
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default HomePage