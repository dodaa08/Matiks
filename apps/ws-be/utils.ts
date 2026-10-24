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

export const GenerateQuestions = () : Question[] =>{
    try{
       
        const questions : Question[] = [];
        
        for(let i = 0; i<60; i++){
            const OperandsNum = Math.floor(Math.random() * 4)+2;
            const Operands = [];
        const Signs = ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"] as const;
        for(let j = 0; j<OperandsNum; j++){
            let Op = Math.floor(Math.random() * 20);
            Operands.push(Op);
        }

        const sign = Signs[Math.floor(Math.random() * Signs.length)]!;
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

