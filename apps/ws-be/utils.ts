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

// AI written

const randInt = (min : number, max : number) : number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const MAX_ADD_SUB = 99;   // operands and results stay within 0-99 (two-digit mental math)
const MAX_MUL_DIV = 12;   // times-table range
const MAX_DIVIDEND = 144; // cap on the number being divided

// ADD: each operand 1..floor(99/n) so the total never exceeds 99.
const buildAdditionOperands = (count : number) : number[] => {
    const maxEach = Math.floor(MAX_ADD_SUB / count);
    return Array.from({ length: count }, () => randInt(1, maxEach));
};

// MINUS: pick the subtrahends first, then a starting number that is at least their sum.
// This guarantees a - b - c - ... >= 0 and the starting number stays <= 99.
const buildSubtractionOperands = (count : number) : number[] => {
    const maxEach = Math.floor(MAX_ADD_SUB / count);
    const subtrahends = Array.from({ length: count - 1 }, () => randInt(1, maxEach));
    const sum = subtrahends.reduce((a, b) => a + b, 0);
    const first = sum + randInt(0, MAX_ADD_SUB - sum);
    return [first, ...subtrahends];
};

// MULTIPLY: 2 operands use 1-12; 3 operands use 2-9 to keep the product mentally manageable.
const buildMultiplicationOperands = (count : number) : number[] => {
    const max = count === 2 ? MAX_MUL_DIV : 9;
    const min = count === 2 ? 1 : 2;
    return Array.from({ length: count }, () => randInt(min, max));
};

// DIVIDE: divisors 2-9, quotient 1-12, so a / b / c / ... is always a whole number.
// Regenerate if the dividend would exceed MAX_DIVIDEND.
const buildDivisionOperands = (count : number) : number[] => {
    while (true) {
        const divisors = Array.from({ length: count - 1 }, () => randInt(2, 9));
        const quotient = randInt(1, MAX_MUL_DIV);
        const first = quotient * divisors.reduce((a, b) => a * b, 1);
        if (first <= MAX_DIVIDEND) return [first, ...divisors];
    }
};

export const GenerateQuestions = () : Question[] =>{
    try{
        const questions : Question[] = [];
        const Signs = ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"] as const;

        for(let i = 0; i<60; i++){
            const OperandsNum = randInt(2, 3);
            const sign = Signs[randInt(0, Signs.length - 1)]!;

            const Operands =
                sign === "DIVIDE" ? buildDivisionOperands(OperandsNum) :
                sign === "MULTIPLY" ? buildMultiplicationOperands(OperandsNum) :
                sign === "MINUS" ? buildSubtractionOperands(OperandsNum) :
                buildAdditionOperands(OperandsNum);

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

