import React, { ChangeEvent, FormEvent, useState } from 'react'

type Props = {}

const HomePage = ({ }: Props) => {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [gameCode, setGameCode] = useState<string | null>(null);

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

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
        <main className='flex flex-col items-center gap-4 mt-2'>
            <div className='flex border justify-center max-w-md min-w-xs w-full py-6'>
                <button
                    className='hover:bg-slate-200 hover:text-black border py-2 px-4 text-center w-32'>
                    Host Game
                </button>
            </div>
            <form
                onSubmit={onFormSubmit}
                className='border px-4 py-6 flex flex-col gap-4 w-full max-w-md min-w-xs justify-center items-center '
            >
                {!loading && <>
                    <label
                        htmlFor="game-code">
                        Game Code: {" "}
                        <input
                            onChange={onInputChange}
                            value={gameCode || ""}
                            id="game-code"
                            name="game-code"
                            className='placeholder:text-slate-600 w-fit h-full border px-2 bg-slate-200 text-black'
                            type="text"
                            placeholder='Enter your Game Code'
                            maxLength={8}
                            minLength={8}
                            required
                        />
                    </label>

                    <button
                        className='hover:bg-slate-200 hover:text-black border py-2 px-4 text-center w-32'
                        type="submit"
                    >
                        Join
                    </button>
                    {error && <p className='place-self-start text-red-800'>Error: {error.message} </p>}
                </>
                    || <p>Loading Game...</p>
                }
            </form>
        </main>
    )
}

export default HomePage