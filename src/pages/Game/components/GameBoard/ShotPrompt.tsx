type props = {
    colTag: string,
    rowTag: string,
    onClick: () => void,
}

const ShotPrompt = ({rowTag, colTag, onClick}: props) => {
    return(
        <div className="rounded-md flex justify-center gap-4 flex-col py-4 px-4 bg-BgA">
            <p className="text-white" > {colTag} ... {rowTag} </p>
            <button
                type="button"
                onClick={onClick}    
                className="button"
            > 
                Approve 
            </button>
        </div>
    )    
}

export default ShotPrompt;