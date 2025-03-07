import Footer from '../../components/Footer.tsx';
import HomePageButton from "./components/HomePageButton.tsx";
import JoinGameForm from "./components/JoinGameForm.tsx";

const HomePage = () => {
    return (
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-4 h-full min-h-screen bg-BgB text-white'>
            <header className='bg-BgA py-8 px-8'>
                <div className='mx-auto max-w-screen-md flex flex-col gap-4 items-center text-center md:text-left'>
                    <h1 className='text-5xl'>Battle Speak</h1>
                    <p className='text-lg'>Practice your english speaking and listening skills, while playing a fun strategic game.</p>
                </div>
            </header>
            <main className='py-12 px-8'>
                <section className='flex flex-col max-w-screen-md items-center mx-auto gap-4 px-4 py-8 bg-BgA rounded-lg'>
                    <h2 className="text-4xl font-light text-center pb-6"> Let's get started... </h2>
                    <hr className='border-1 w-full' />
                    <JoinGameForm />
                    <hr className='border-1 w-full' />
                    <HomePageButton route={"/game/tag-setup/local"} text={"Local Play"}/>
                    <hr className='border-1 w-full' />
                    <HomePageButton route={"/game/tag-setup"} text={" Host Game"}/>
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default HomePage