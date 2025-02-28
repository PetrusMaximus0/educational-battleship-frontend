import {tagTemplate} from "../common/types.tsx";
import {mockGameData} from "./mockGameData.ts";

const templates : tagTemplate[] = [
    {id: "1", name: "Template A", rows: mockGameData.rowTags, cols: mockGameData.colTags},
    {id: "2", name: "Template B", rows: mockGameData.colTags, cols: mockGameData.colTags},
    {id: "3", name: "Template C", rows: mockGameData.colTags, cols: mockGameData.rowTags}
]

export const getTagTemplates = () => {
    return templates;
}