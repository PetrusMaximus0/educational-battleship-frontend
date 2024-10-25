import React from 'react'
import { useParams } from 'react-router-dom'
import Board from '../components/Board';

type Props = {}

const GamePage = (props: Props) => {
    const { id } = useParams();

    return (
        <main>
            <Board />
        </main>
    )
}

export default GamePage