import * as gameHub from "./gameHub.tsx";
import * as localGameHub from "./localGameHub.ts";

type IGameHub = typeof gameHub | typeof localGameHub;

const getHub = (isLocalGame: boolean) : IGameHub => {
    return isLocalGame ? localGameHub : gameHub;
}

export { getHub };