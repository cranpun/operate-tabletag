// *********************************************
// private
// *********************************************
function tdval(td) {
    var val = td.getAttribute(OperateTabletag.operatetabletagval);
    if (val === null) {
        // 指定がなければtdの中身
        var ret = td.innerText.trim();
        return ret.toString();
    }
    else {
        // 値があればそのまま
        return val.toString();
    }
}
var OperateTabletag = /** @class */ (function () {
    function OperateTabletag(tableselector, filterselector, countselector) {
        var _this = this;
        this.table = document.querySelector(tableselector);
        this.nowcount = countselector ? document.querySelector(countselector) : null;
        this.nowfilter = filterselector ? document.querySelector(filterselector) : null;
        // filterが指定されていればkeyupに登録
        if (this.nowfilter) {
            this.nowfilter.addEventListener("keyup", function () { _this.draw(null, null, null); });
        }
        // trsをクローン
        this.trs = [];
        var eleTrs = this.table.querySelectorAll("tbody tr");
        var idx = 0;
        for (var i = 0; i < eleTrs.length; i++) {
            this.trs[idx] = eleTrs[i].cloneNode(true);
            idx++;
        }
        // フィルタ用trstringsの生成
        this.trstrings = [];
        for (var i = 0; i < this.trs.length; i++) {
            // 行の取得
            var tr = this.trs[i];
            // 行文字列の生成。この中に含まれるzzztabledataを全て抽出して結合
            var vals = tr.querySelectorAll("td");
            var str = "";
            for (var i_1 = 0; i_1 < vals.length; i_1++) {
                var v = tdval(vals[i_1]);
                str += v;
            }
            this.trstrings.push({
                ridx: i,
                trtext: str
            });
        }
        // ソート用tdstringsの生成
        // 列の代表としてtheadのtdの数を数える
        var eleths = this.table.querySelectorAll("thead tr th");
        var cidx = 0;
        this.ths = [];
        for (var i = 0; i < eleths.length; i++) {
            var th = eleths[i];
            new OperateTabletagCol(this, th, this.trs, cidx);
            this.ths[cidx] = th;
            cidx++;
        }
    }
    /**
     * 現在の設定をもとにテーブルを表示
     */
    OperateTabletag.prototype.draw = function (cidx, odrridxs, odr) {
        // 現在のtbody trを一旦クリア
        var tbody = this.table.querySelector("tbody");
        var trs = tbody.querySelectorAll("tr");
        for (var i = 0; i < trs.length; i++) {
            tbody.removeChild(trs[i]);
        }
        var filterrows = [];
        var filtertext = this.nowfilter ? this.nowfilter.value : "";
        for (var _i = 0, _a = this.trstrings; _i < _a.length; _i++) {
            var trstring = _a[_i];
            // フィルタ未設定 or フィルターに合致
            if (filtertext === "" || trstring.trtext.indexOf(filtertext) >= 0) {
                filterrows.push(trstring.ridx);
            }
        }
        // cidxのデータに応じてソート
        var ridxs = [];
        if (odrridxs === null) {
            // ソートなし
            ridxs = filterrows;
        }
        else {
            for (var _b = 0, odrridxs_1 = odrridxs; _b < odrridxs_1.length; _b++) {
                var ridx = odrridxs_1[_b];
                if (filterrows.indexOf(ridx) >= 0) {
                    ridxs.push(ridx);
                }
            }
        }
        // ソートしたtrsをtbody にappend
        for (var _c = 0, ridxs_1 = ridxs; _c < ridxs_1.length; _c++) {
            var ridx = ridxs_1[_c];
            var newtr = this.trs[ridx].cloneNode(true);
            tbody.append(newtr);
        }
        // カウントを更新
        if (this.nowcount) {
            this.nowcount.innerText = ridxs.length.toString();
        }
        // thのスタイリング
        if (cidx !== null) {
            // 一旦全部のdesc, ascを除去
            for (var _d = 0, _e = this.ths; _d < _e.length; _d++) {
                var th = _e[_d];
                th.classList.remove("asc");
                th.classList.remove("desc");
            }
            // 今回のオーダーを追加
            if (odr) {
                var th = this.ths[cidx];
                th.classList.add(odr);
            }
        }
    };
    /**
     * ソート時に参照する値
     */
    OperateTabletag.operatetabletagval = "operatetabletagval";
    OperateTabletag.operatetabletagcompare = "operatetabletagcompare";
    return OperateTabletag;
}());
export { OperateTabletag };
var OperateTabletagCol = /** @class */ (function () {
    function OperateTabletagCol(table, th, trs, cidx) {
        var _this = this;
        this.odrridxs = [];
        this.table = table;
        this.cidx = cidx;
        this.nowodr = "asc";
        this.ccompare = th.getAttribute(OperateTabletag.operatetabletagcompare);
        //cidxの位置のデータを集計
        var coltds = [];
        var ridx = 0;
        for (var _i = 0, trs_1 = trs; _i < trs_1.length; _i++) {
            var tr = trs_1[_i];
            var tds = tr.querySelectorAll("td");
            var val = tdval(tds.item(cidx));
            coltds.push({ val: val, ridx: ridx });
            ridx++;
        }
        if (this.ccompare === "text") {
        }
        else if (this.ccompare === "number") {
        }
        else {
            // それ以外はイベント
            return;
        }
        // 列のデータの順にridxをpushする。比較の方法
        var compfunc = null;
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
        for (var _a = 0, coltds_1 = coltds; _a < coltds_1.length; _a++) {
            var coltd = coltds_1[_a];
            this.odrridxs.push(coltd.ridx);
        }
        // イベントハンドラの登録
        th.addEventListener("click", function () { return _this.order(); });
        // ソートのthスタイリング
        th.classList.add("zzzth");
    }
    OperateTabletagCol.prototype.comparetext = function (a, b) {
        // 文字列比較＝単純比較
        return (a.val > b.val) ? 1 : ((a.val < b.val) ? -1 : 0);
    };
    OperateTabletagCol.prototype.comparenumber = function (a, b) {
        // 数値に変換して比較。小数点も含む。カンマは除去
        var aval = parseFloat(a.val);
        var bval = parseFloat(b.val);
        return aval - bval;
    };
    OperateTabletagCol.prototype.order = function () {
        // 現在のorderをトグル
        this.nowodr = this.nowodr === "asc" ? "desc" : "asc";
        var odr = [];
        if (this.nowodr === "asc") {
            // そのまま -> cloneして返す
            odr = this.odrridxs.concat();
        }
        else { // this.nowodr === "desc"
            // 逆順
            odr = this.odrridxs.concat().reverse();
        }
        this.table.draw(this.cidx, odr, this.nowodr);
    };
    return OperateTabletagCol;
}());
