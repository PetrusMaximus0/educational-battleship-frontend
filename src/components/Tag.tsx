import React, { useState } from 'react'

type Props = {
    tag: string,
    classes: string,
}

const Tag = ({ tag, classes }: Props) => {
    const [seeDetail, setSeeDetail] = useState(false);

    return (
        <>
            < div
                onMouseEnter={() => setSeeDetail(true)}
                onMouseLeave={() => setSeeDetail(false)}
                className={classes + "relative" + (seeDetail ? "z-50 overflow-visible " : "")}
            >
                <div
                    onMouseLeave={() => setSeeDetail(false)}
                    className={seeDetail ? "mx-1 my-1 border bg-tagBgHover  flex items-center justify-start absolute scale-150 h-16 w-16 min-w-fit px-4 py-2 rounded-md" : "mx-1"}
                >
                    {tag}
                </div>

            </div >
        </>
    )
}

export default Tag