// *********************************************
// public
// *********************************************
export type OperateTabletagCompare = "number" | "text";
export type OperateTabletagOrder = "asc" | "desc";

// *********************************************
// private
// *********************************************
function tdval(td: HTMLTableDataCellElement): string {
    const val = td.getAttribute(OperateTabletag.operatetabletagval);
    if (val === null) {
        // 指定がなければtdの中身
        const ret = td.innerText.trim();
        return ret.toString();
    } else {
        // 値があればそのまま
        return val.toString();
    }
}

export class OperateTabletag {
    private table: HTMLTableElement;
    private trs: HTMLTableRowElement[]; // クローンしたtr
    private ths: HTMLTableHeaderCellElement[];
    private trstrings: {
        ridx: number, // 行idx
        trtext: string // 列の値を結合したもの
    }[]; // フィルタ用データ。列のデータを結合したもの。
    private nowfilter: HTMLInputElement | null;
    private nowcount: HTMLElement | null;

    /**
     * ソート時に参照する値
     */
    public static readonly operatetabletagval = "operatetabletagval";
    public static readonly operatetabletagcompare = "operatetabletagcompare";

    constructor(tableselector: string, filterselector?: string | null, countselector?: string | null) {
        this.table = <HTMLTableElement>document.querySelector(tableselector);
        this.nowcount = countselector ? <HTMLElement>document.querySelector(<string>countselector) : null;
        this.nowfilter = filterselector ? <HTMLInputElement>document.querySelector(<string>filterselector) : null;

        // filterが指定されていればkeyupに登録
        if (this.nowfilter) {
            this.nowfilter.addEventListener("keyup", () => { this.draw(null, null, null); });
        }

        // trsをクローン
        this.trs = [];
        const eleTrs: NodeList = this.table.querySelectorAll(`tbody tr`);
        let idx = 0;
        for(let i = 0; i < eleTrs.length; i++) {
            this.trs[idx] = (<HTMLTableRowElement>eleTrs[i].cloneNode(true));
            idx++;
        }

        // フィルタ用trstringsの生成
        this.trstrings = [];
        for (let i = 0; i < this.trs.length; i++) {
            // 行の取得
            const tr = this.trs[i];
            // 行文字列の生成。この中に含まれるoperatetabletagvalを全て抽出して結合
            const vals = tr.querySelectorAll("td");
            let str = "";
            for (let i = 0; i < vals.length; i++) {
                const v = tdval(vals[i]);
                str += v;
            }
            this.trstrings.push({
                ridx: i,
                trtext: str
            });
        }

        // ソート用tdstringsの生成
        // 列の代表としてtheadのtdの数を数える
        const eleths: NodeList = this.table.querySelectorAll(`thead tr th`);
        let cidx = 0;
        this.ths = [];
        for (let i = 0; i < eleths.length; i++) {
            const th: HTMLTableHeaderCellElement = <HTMLTableHeaderCellElement>eleths[i];
            new OperateTabletagCol(this, th, this.trs, cidx);
            this.ths[cidx] = th;
            cidx++;
        }
    }

    /**
     * 現在の設定をもとにテーブルを表示
     */
    public draw(cidx: number | null, odrridxs: number[] | null, odr: OperateTabletagOrder | null) {
        // 現在のtbody trを一旦クリア
        const tbody: HTMLTableSectionElement = <HTMLTableSectionElement>this.table.querySelector("tbody");
        const trs = tbody.querySelectorAll("tr");
        for (let i = 0; i < trs.length; i++) {
            tbody.removeChild(trs[i]);
        }

        const filterrows: number[] = [];
        const filtertext = this.nowfilter ? this.nowfilter.value : "";
        for (const trstring of this.trstrings) {
            // フィルタ未設定 or フィルターに合致
            if (filtertext === "" || trstring.trtext.indexOf(filtertext) >= 0) {
                filterrows.push(trstring.ridx);
            }
        }

        // cidxのデータに応じてソート
        let ridxs: number[] = [];
        if (odrridxs === null) {
            // ソートなし
            ridxs = filterrows;
        } else {
            for (const ridx of odrridxs) {
                if (filterrows.indexOf(ridx) >= 0) {
                    ridxs.push(ridx);
                }
            }
        }

        // ソートしたtrsをtbody にappend
        for (const ridx of ridxs) {
            const newtr = this.trs[ridx].cloneNode(true);
            tbody.append(newtr);
        }

        // カウントを更新
        if (this.nowcount) {
            this.nowcount.innerText = ridxs.length.toString();
        }

        // thのスタイリング
        if (cidx !== null) {
            // 一旦全部のdesc, ascを除去
            for (const th of this.ths) {
                th.classList.remove("asc");
                th.classList.remove("desc");
            }

            // 今回のオーダーを追加
            if (odr) {
                const th = this.ths[cidx];
                th.classList.add(odr);
            }
        }
    }
}
class OperateTabletagCol {
    private cidx: number;
    private odrridxs: number[]; // 小さい順にridxを並べる
    public nowodr: OperateTabletagOrder;
    private table: OperateTabletag;
    private ccompare: OperateTabletagCompare;

    constructor(table: OperateTabletag, th: HTMLTableHeaderCellElement, trs: HTMLTableRowElement[], cidx: number) {
        this.odrridxs = [];
        this.table = table;
        this.cidx = cidx;
        this.nowodr = "asc";
        this.ccompare = <OperateTabletagCompare>th.getAttribute(OperateTabletag.operatetabletagcompare);
        //cidxの位置のデータを集計
        const coltds: {
            val: string,
            ridx: number
        }[] = [];
        let ridx = 0;
        for (const tr of trs) {
            const tds: NodeList = tr.querySelectorAll("td");
            const val: string = tdval(<HTMLTableDataCellElement>tds.item(cidx));

            coltds.push({ val, ridx });
            ridx++;
        }

        if (this.ccompare === "text") {
        } else if (this.ccompare === "number") {
        } else {
            // それ以外はイベント
            return;
        }

        // 列のデータの順にridxをpushする。比較の方法
        let compfunc = null;
        switch (this.ccompare) {
            case "text":
                coltds.sort(this.comparetext);
                break;
            case "number":
                coltds.sort(this.comparenumber);
                break;
            default:
                // それ以外の指定はソート無効
                return;
        }

        // ridxだけ抽出
        for (let coltd of coltds) {
            this.odrridxs.push(coltd.ridx);
        }

        // イベントハンドラの登録
        th.addEventListener("click", () => this.order());

        // ソートのthスタイリング
        th.classList.add("operate-tabletag-th");
    }

    private comparetext(a: { val: string; ridx: number; }, b: { val: string; ridx: number; }): number {
        // 文字列比較＝単純比較
        return (a.val > b.val) ? 1 : ((a.val < b.val) ? -1 : 0);
    }

    private comparenumber(a: { val: string; ridx: number; }, b: { val: string; ridx: number; }): number {
        // 数値に変換して比較。小数点も含む。カンマは除去
        const aval = parseFloat(a.val);
        const bval = parseFloat(b.val);
        return aval - bval;
    }

    public order(): void {
        // 現在のorderをトグル
        this.nowodr = this.nowodr === "asc" ? "desc" : "asc";

        let odr = [];
        if (this.nowodr === "asc") {
            // そのまま -> cloneして返す
            odr = this.odrridxs.concat();
        } else { // this.nowodr === "desc"
            // 逆順
            odr = this.odrridxs.concat().reverse();
        }
        this.table.draw(this.cidx, odr, this.nowodr);
    }
}
