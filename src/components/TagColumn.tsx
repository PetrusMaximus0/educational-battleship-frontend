import TagInputForm from "./TagInputForm.tsx";

type props = {
    title : string;
    tags: string[];
    handleRemoveTag: (tag: string) => void;
    handleAddTag: (tag: string) => void;
}

const TagColumn = ({title, tags, handleRemoveTag, handleAddTag }: props ) => {    
    return(
        <div className={"flex flex-col gap-4 justify-between"}>
                <h3 className={"text-3xl text-center"}>{title}</h3>
            {tags.length>0 
                ? <p> Total: {tags.length} </p> 
                : <p className={"text-center text-yellow-400"} > 
                    <span className={"font-bold"}> Warning: </span> Must have at least one Tag
                  </p>
            } 
            <hr/>
            {
                tags.length > 0 &&
                <ul className={"flex flex-col items-between gap-4"}>
                    {tags.map(tag =>
                        <li
                            className={"flex gap-4 justify-between"}
                            key={tag}
                        >
                            <p> {tag} </p>
                            <button
                                className={"px-3 py-1 border rounded-sm hover:bg-btnBgHover active:bg-btnBgActive bg-btnBg"}
                                onClick={() => handleRemoveTag(tag)}
                            >
                                X
                            </button>
                        </li>)}
                </ul> }
                <TagInputForm title={title} handleAdd={handleAddTag} />
            </div>
        )
}

export default TagColumn;