import { CheckerState } from "./CheckerState.model";

export class Piece{
    constructor(public color: CheckerState, public position: [number, number], public isKing: boolean, public isAlive: boolean){}
}