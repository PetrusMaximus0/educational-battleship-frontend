import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {tagTemplate} from "../../../../types/types.tsx";
import {templates} from "../../../../data/tagTemplates.ts";

type props = {
    handleSubmit: (template: tagTemplate)=>void,
}
const TagTemplateForm = ({handleSubmit}: props) => {
    const [tagTemplates, setTagTemplates] = useState<tagTemplate[]>([]);

    useEffect(() => {
       setTagTemplates([...templates]);
    }, []);

    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        handleSubmit({...tagTemplates[parseInt(e.target.value)]});
    }

    return(
        <form
            onSubmit={(e: FormEvent<HTMLFormElement>)=>e.preventDefault()}
            className="flex justify-between gap-6"
        >
            <label className={"text-2xl"} htmlFor="tags-selector"> Select your Template: </label>
            <select
                className="bg-inputBgA w-full rounded-md px-4 text-2xl"
                name="templates"
                id="tags-selector"
                onChange={handleOnChange}
            >
                {tagTemplates.map((template, index : number)=>
                    <option
                        className={"text-2xl"}
                        key={template.id}
                        value={index}
                    >
                        {template.name}
                    </option>
                )}
            </select>
        </form>
    )
}

export default TagTemplateForm;