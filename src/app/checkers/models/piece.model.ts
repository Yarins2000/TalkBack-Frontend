import { CheckerState } from "./CheckerState.model";

/**
 * Represents a single piece.
 */
export class Piece{
    constructor(public color: CheckerState, public position: [number, number], public isKing: boolean, public isAlive: boolean){}
}