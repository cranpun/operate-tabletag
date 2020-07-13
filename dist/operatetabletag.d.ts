export declare type OperateTabletagCompare = "number" | "text";
export declare type OperateTabletagOrder = "asc" | "desc";
export declare class OperateTabletag {
    private table;
    private trs;
    private ths;
    private trstrings;
    private nowfilter;
    private nowcount;
    /**
     * ソート時に参照する値
     */
    static readonly operatetabletagval = "operatetabletagval";
    static readonly operatetabletagcompare = "operatetabletagcompare";
    constructor(tableselector: string, filterselector?: string | null, countselector?: string | null);
    /**
     * 現在の設定をもとにテーブルを表示
     */
    draw(cidx: number | null, odrridxs: number[] | null, odr: OperateTabletagOrder | null): void;
}
