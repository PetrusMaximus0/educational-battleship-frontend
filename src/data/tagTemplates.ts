import {tagTemplate} from "../types/types.tsx";

const colTagsA: string[] = [
    "I",
    "You",
    "He",
    "She",
    "It",
    "We",
    "They"
];

const rowTagsA: string[] = [
    "A cat",
    "A dog",
    "A parrot",
    "A tiger",
    "A mouse",
    "A turtle",
    "A bird"
];

export const templates : tagTemplate[] = [
    {id: "1", name: "Template A", rows: rowTagsA, cols: colTagsA},
    {id: "2", name: "Template B", rows: rowTagsA, cols: rowTagsA},
    {id: "3", name: "Template C", rows: colTagsA, cols: rowTagsA}
]