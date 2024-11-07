import { useState } from 'react'

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
                className={classes + "relative"}
            >
                <div
                    onMouseLeave={() => setSeeDetail(false)}
                    className={seeDetail ? "absolute border bg-tagBgHover flex items-center justify-center scale-150 mx-1 my-1 h-16 w-16 min-w-fit px-4 py-2 rounded-md" : "mx-auto px-1"}
                >
                    {tag}
                </div>

            </div >
        </>
    )
}

export default Tag