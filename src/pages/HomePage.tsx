import { ChangeEvent, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

type Props = {}

const HomePage = ({ }: Props) => {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [gameCode, setGameCode] = useState<string | null>(null);

    const navigate = useNavigate();

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Simulate connection
        setTimeout(() => {
            navigate(`/game/${gameCode}`);
        }, 2000)

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

    const onHostGame = () => {
        alert("Creating a new game.");
        navigate("/game/42sd");
    }

    return (
        <div className='grid grid-rows-[auto_auto_auto] content-between h-screen bg-black text-white'>
            <div className='bg-slate-800 py-8 px-8'>
                <header className='mx-auto max-w-screen-md flex flex-col gap-4 items-center text-center md:text-left'>
                    <h1 className='text-5xl'>Battle Speak</h1>
                    <p className='text-lg'>Practice your english speaking and listening skills, while playing a fun strategic game.</p>
                </header>
            </div>
            <main className='py-12 px-8'>
                <section className='flex flex-col max-w-screen-md items-center mx-auto gap-4 px-4 py-8 bg-slate-800 rounded-lg'>
                    <h2 className="text-4xl font-light text-center pb-6">
                        Let's get started...
                    </h2>
                    <hr className='border-1 w-full' />
                    <form name='join-game' className='px-4 py-6 mx-auto flex flex-col gap-4' onSubmit={onFormSubmit} >
                        <label className='flex gap-6 items-center justify-start text-nowrap' htmlFor="game-code">
                            Game Code:
                            <input
                                className="max-w-48 rounded-md py-1 px-2 text-center placeholder:text-slate-400 placeholder:text-center bg-black text-white text-xl"
                                type="text"
                                name="game-code"
                                id="game-code"
                                onChange={onInputChange}
                                value={gameCode ?? ""}
                                required
                                minLength={5}
                                maxLength={5} />
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
                        <button className='hover:bg-slate-200 hover:text-black rounded-md border py-2 px-6 mx-auto' type="submit">
                            Join Game
                        </button>
                    </form>
                    <hr className='border-1 w-full' />
                    <div className="px-4 pt-6 w-full h-full flex justify-center">
                        <button
                            className='hover:bg-slate-200 hover:text-black border rounded-md py-2 px-6 text-center'
                            onClick={onHostGame}
                        >
                            Host Game
                        </button>

                    </div>
                </section>
            </main>
            <Footer />
        </div>

    )
}

export default HomePage