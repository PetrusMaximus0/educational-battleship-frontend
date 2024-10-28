import React from 'react'
import { CellData } from '../types'

type Props = {
    data: CellData,
    classes: string
}

const Cell = ({ data, classes = "" }: Props) => {
    return (
        <button className={classes}></button>
    )
}

export default Cell