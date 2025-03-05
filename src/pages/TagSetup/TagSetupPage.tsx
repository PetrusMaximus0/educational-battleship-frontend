import {useNavigate} from "react-router-dom";
import {emptyBoards} from "../../utils/BoardInit.ts";
import {useEffect, useState} from "react";
import TagColumn from "./components/TagSetup/TagColumn.tsx";
import {invokeHubEvent, joinHub, onHubEvent} from "../../services/gameHub.tsx";
import TagTemplateForm from "./components/TagSetup/TagTemplateForm.tsx";
import {tagTemplate} from "../../types/types.tsx";
import TagSetupLayout from "../../layouts/TagSetupLayout.tsx";

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

    //
    const handleSubmitTags = async () => {
        if (rowTags.length <= 0 || colTags.length <= 0) {
            setError(new Error("There must be at least one Row tag and one Column tag"))
            return;
        } 

        setError(null);
        // Connect to the HUB.
        const {error: err} = await joinHub()
        if (err) {
            setError(err);
            return;
        }

        // Register to accept session ID.
        onHubEvent("ReceiveSessionId", (id: string) => {
            navigate(`/game/${id}`);
        })

        // Request a new session
        const {error: invokeError} = await invokeHubEvent("RequestNewSession", rowTags, colTags);
        if (invokeError) {
            setError(invokeError);
        }
    }

    useEffect(()=>{
        // Loads defaults
        setRowTags(emptyBoards.rowTags);
        setColTags(emptyBoards.colTags);
    },[])

    const handleTemplateSelectSubmit = (template: tagTemplate) => {
        setRowTags([...template.rows]);
        setColTags([...template.cols]);
    }

    return (
        <TagSetupLayout headerTitle={"BoardTag Setup"}>
            <section className='flex flex-col justify-start gap-6' >
                <h2 className={"text-4xl text-center"}> Current Tag Selection </h2>
                <div className={"bg-BgA grid grid-cols-2 justify-center items-start gap-6 border w-fit mx-auto px-4 py-4 rounded-md"}>
                    <div className={"col-span-2"}> <TagTemplateForm handleSubmit={handleTemplateSelectSubmit}/> </div>
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
        </TagSetupLayout>
    )
}

export default TagSetupPage