/*export type Move = Partial<{
    fromRow: number;
    fromColumn: number;
    toRow: number;
    toColumn: number;
}>;*/

export interface Move {
    fromRow: number;
    fromColumn: number;
    toRow: number;
    toColumn: number;
}