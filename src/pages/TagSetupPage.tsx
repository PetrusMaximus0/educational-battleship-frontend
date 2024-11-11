import {Link, useNavigate} from "react-router-dom";
import Footer from "../components/Footer.tsx";
import {mockGameData} from "../mockGameData.ts";
import {useEffect, useState} from "react";
import TagColumn from "../components/TagColumn.tsx";
import {invokeHubEvent, joinHub, onHubEvent} from "../hubs/gameHub.tsx";

const TagSetupPage = () => {
    const [rowTags, setRowTags] = useState<string[]>([]);
    const [colTags, setColTags] = useState<string[]>([]);  
    const [error, setError] = useState<Error|null>(null);
    const navigate = useNavigate();
    
    const handleRemoveColTag = (tag: string) => {
        const newColTags = colTags.filter((val)=> val !== tag);
        setColTags(newColTags);
    }
    const handleAddColTag = (tag: string) => {
        if(colTags.indexOf(tag) < 0){
            setColTags([...colTags, tag]);
        }
    }
    const handleRemoveRowTag = (tag: string) => {
        const newRowTags = rowTags.filter((val)=> val !== tag);
        setRowTags(newRowTags);
    }
    const handleAddRowTag = (tag: string) => {
        if(rowTags.indexOf(tag) < 0){
            setRowTags([...rowTags, tag]);
        }
    }
    const handleSubmitTags = async () => {
        if(rowTags.length>0 && colTags.length>0){
            setError(null); 
            // Connect to the HUB.
            const {error: err} = await joinHub()
            if(err){
                setError(err);
                return;
            }
           
            // Register to accept session ID.
            onHubEvent("ReceiveSessionId", (id: string)=> {
                navigate(`/game/ship-setup/${id}`);
            })           
            
            // Request a new session
            const {error: invokeError} = await invokeHubEvent("RequestNewSession", rowTags, colTags);
            if(invokeError){
                setError(invokeError);
            }
            
        }else{
            setError(new Error("There must be at least one Row tag and one Column tag"))
        }
    }
    
    useEffect(()=>{
        setRowTags(mockGameData.rowTags);
        setColTags(mockGameData.colTags);
    },[])
    
    return (
        <div className='grid grid-rows-[auto_1fr_auto] gap-y-10 h- min-h-screen bg-BgB text-white'>
            <header className='bg-BgA py-8 px-8'>
                <div className='flex flex-col items-center justify-center gap-6'>
                    <h1 className='text-4xl'> Game Setup </h1>
                    <Link
                        className='hover:bg-btnBgHover border border-Text px-4 py-3 bg-btnBg active:bg-btnBgActive rounded-md'
                        to="/"
                    >
                        Return Home
                    </Link>
                </div>
            </header>
            <main className={"flex flex-col gap-3 justify-start items-center w-fit mx-auto"}>
                <section className='flex flex-col justify-start gap-6' >
                    <h2 className={"text-4xl text-center"}> Current Tag Selection </h2>
                    <div className={"bg-BgA flex justify-center items-start gap-6 border w-fit mx-auto px-4 py-4 rounded-md"}>
                        <TagColumn 
                            title={"Row Tags"} 
                            tags={rowTags} 
                            handleAddTag={handleAddRowTag} 
                            handleRemoveTag={handleRemoveRowTag} 
                        />    
                        <TagColumn 
                            title={"Col Tags"} 
                            tags={colTags} 
                            handleAddTag={handleAddColTag} 
                            handleRemoveTag={handleRemoveColTag} 
                        />
                    </div>
                    {error && 
                        <p className={"text-red-600 font-semibold mx-auto text-center text-xl"}> 
                            {error.message} 
                        </p> 
                    }
                    <button
                        type='button'    
                        className={"text-center border py-2 px-3 mx-auto rounded-md hover:bg-btnBgHover active:bg-btnBgActive"}
                        onClick={handleSubmitTags}
                    > 
                        Begin Game
                    </button>
                </section>
            </main>
            <Footer/>
        </div>
    )
}

export default TagSetupPage