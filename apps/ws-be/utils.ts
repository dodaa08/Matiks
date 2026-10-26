import type { Question } from "./types";
import { randomUUID } from "crypto";

export const CalAnswer = (sign : string, operands : number[]) : number =>{
    switch(sign){
        case "PLUS":
            return operands.reduce((a,b)=> a+b, 0);
        case "MINUS":
            return operands.reduce((a,b)=> a-b);
        case "MULTIPLY":
            return operands.reduce((a,b)=>a*b, 1);
        case "DIVIDE":
            return operands.reduce((a,b)=> (b != 0 ? a / b : a));
        default:
            throw new Error(`Unknown sign: ${sign}`);
    }
}

const randInt = (min : number, max : number) : number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

// Builds DIVIDE operands so that a / b / c / ... is always a whole number.
// Pick the divisors first, then start from the quotient and multiply back up.
const buildDivisionOperands = (count : number) : number[] => {
    const divisors = Array.from({ length: count - 1 }, () => randInt(1, 9));
    const quotient = randInt(0, 19);

    let first = quotient;
    for (const d of divisors) first *= d;

    return [first, ...divisors];
};

export const GenerateQuestions = () : Question[] =>{
    try{
        const questions : Question[] = [];
        const Signs = ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"] as const;

        for(let i = 0; i<60; i++){
            const OperandsNum = randInt(2, 5);
            const sign = Signs[randInt(0, Signs.length - 1)]!;

            const Operands = sign === "DIVIDE"
                ? buildDivisionOperands(OperandsNum)
                : Array.from({ length: OperandsNum }, () => randInt(0, 19));

            questions.push({
                id : `q-${randomUUID()}`,
                operation : sign,
                numOfOperands : OperandsNum,
                numsToBeUsed : Operands,
            });
        };

        return questions;

    }catch(e){
        console.error("GenerateQuestions failed:", e);
        return [];    
    };
}

