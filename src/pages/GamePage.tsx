import { Link, useParams } from 'react-router-dom'
import Board from '../components/Board';
import Footer from '../components/Footer';

type Props = {

}

const GamePage = (props: Props) => {
    const { id } = useParams();

    return (
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 h-fit min-h-screen screen bg-black text-white'>
            <div className='bg-slate-800 py-8 px-8'>
                <header className='flex flex-col items-center justify-center gap-6'>
                    <h1 className='text-4xl'> Current Game: <span className='font-bold'> {id} </span> </h1>
                    <nav>
                        <Link
                            className='hover:bg-black px-4 py-3 bg-slate-500 rounded-md'
                            to="/"
                        >
                            Return Home
                        </Link>
                    </nav>
                </header>
            </div>
            <main className='flex flex-col gap-2 justify-start items-center'>
                <Board />
            </main>
            <Footer />
        </div>
    )
}

export default GamePage