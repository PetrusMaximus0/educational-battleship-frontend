import React from "react";

type Props = {
    clickHandler: () => void;
    children: React.ReactNode;  
}

const ActionBtn = ({clickHandler, children}: Props )=>{
    return(
        <button
            className={"rounded-sm bg-btnBg flex-grow px-0.5 border border-btnBorder hover:bg-btnBgHover active:bg-btnBgActive"}
            onClick={clickHandler}
        >
            {children}
        </button>
    )
}

export default ActionBtn;