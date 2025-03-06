import {tagTemplate} from "../common/types.tsx";
import {mockGameData} from "./mockGameData.ts";

let id = 0;
function getId () {
    id = id+1;
    return `${id}`
}

const templates : tagTemplate[] = [
    {
        id: getId(),
        name: "Template A",
        rows: mockGameData.rowTags,
        cols: mockGameData.colTags
    },
    {
        id: getId(),
        name: "Daily Routine - Present Simple",
        rows: [
            "(wake up) at 10 o'clock",
            "(have) a shower everyday",
            "(make) breakfast in the morning",
            "(brush) my teeth twice a day",
            "(walk) my dog in the morning",
            "(go) to school five times a week",
            "(do) homework in the evenings",
            "(read) a lot of books",
            "(wash) my clothes once a week",
            "(clean) the car",
        ],
        cols: [
            "I",
            "You",
            "He",
            "They",
            "She",
            "We",
            "My dog",
            "My grandma",
            "My parents",
            "My grandpa",
        ]
    },
    {
        id: getId(),
        name: "Possessive Pronouns and Demonstratives #1",
        rows: [
            "(are/is) (I)",
            "(are/is) (you)",
            "(are/is) (she)",
            "(are/is) (he)",
            "(are/is) (we)",
            "(are/is) (Miłosz)",
            "(are/is) (grandma)",
            "(are/is) (dog)",
            "(are/is) (they)",
            "(are/is) (grandpa)",
        ],
        cols: [
            "This cat",
            "That cake",
            "These flowers",
            "Those cars",
            "This book",
            "That game",
            "These balls",
            "Those notebooks",
            "This computer",
            "That bag",
        ]
    },
    {
        id: getId(),
        name: "Possessive Pronouns and Demonstratives #2",
        rows: [
            "(I) cat(s)",
            "(you) cake(s)",
            "(she) cookie(s)",
            "(he) car(s)",
            "(we) book(s)",
            "(Miłosz) game(s)",
            "(grandma) flower(s)",
            "(dog) notebooks(s)",
            "(they) computer(s)",
            "(grandpa) bag(s)",
        ],
        cols: [
            "This is",
            "That is",
            "These are",
            "Those are",
            "This is",
            "That is",
            "These are",
            "Those are",
            "This is",
            "That is",
        ]
    }
]

export const getTagTemplates = () => {
    return templates;
}