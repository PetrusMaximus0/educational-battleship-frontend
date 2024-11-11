import {ChangeEvent, useState} from "react";

type props = {
    title: string,
    handleAdd: (value: string) => void,
}
const TagInputForm = ({title, handleAdd}:props) => {
    const [value, setValue] = useState<string>("");
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>{
        setValue(e.target.value);
    }
    
    const handleFormSubmit = (e: any) =>{
        e.preventDefault();
        if(value){
            handleAdd(value);
            setValue('');            
        }
    }
    
    return(
        
    <form 
        onSubmit={handleFormSubmit}
        className={"flex items-center justify-between gap-2"}>
        {title}
        <input
            className={"px-1 py-1 bg-inputBgA rounded-sm"}
            type={"text"}
            value={value}
            onChange={handleChange}
            minLength={1}
            required
        />
        <button
            type={"submit"}
            className={"border px-3 py-1 rounded-sm bg-btnBg hover:bg-btnBgHover active:bg-btnBgActive"}
        >
            Add
        </button>
    </form>
    )

}

export default TagInputForm;
