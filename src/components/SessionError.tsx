const SessionError = ({error} : { error: Error }) => {
    return <div className={"text-xl text-center text-red-600"}>
        There was an error: {error.message}
    </div>
}

export default SessionError;