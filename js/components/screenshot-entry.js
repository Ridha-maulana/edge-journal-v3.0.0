/* Menu tombol + (Manual / Screenshot) dan layar tunggu saat screenshot dibaca */
"use strict";
function AddMenu({ onManual, onScreenshot, onClose }) {
    return React.createElement(React.Fragment, null,
        React.createElement("div", { className: "add-menu-backdrop", onClick: onClose }),
        React.createElement("div", { className: "add-menu", role: "menu" },
            React.createElement("button", { type: "button", className: "add-menu-item", role: "menuitem", onClick: onManual },
                React.createElement("span", { className: "add-menu-ico" }, React.createElement(Plus, { size: 17 })),
                React.createElement("span", null, "Manual Trade Entry")),
            React.createElement("button", { type: "button", className: "add-menu-item", role: "menuitem", onClick: onScreenshot },
                React.createElement("span", { className: "add-menu-ico" }, React.createElement(Camera, { size: 17 })),
                React.createElement("span", null, "Screenshot Trade Entry ", React.createElement("em", { className: "beta-tag" }, "Beta")))));
}
function ScanOverlay({ progress, text }) {
    const pct = Math.max(0, Math.min(100, Math.round((progress || 0) * 100)));
    return React.createElement("div", { className: "scan-overlay", role: "status" },
        React.createElement("div", { className: "scan-card" },
            React.createElement("div", { className: "scan-spinner" }),
            React.createElement("strong", null, "Membaca data trade dari screenshot…"),
            React.createElement("span", null, text || 'Mohon tunggu'),
            React.createElement("div", { className: "scan-bar" }, React.createElement("i", { style: { width: pct + '%' } }))));
}
/* ubah hasil baca (parseMt5Text) jadi isi awal form Tambah trade */
function buildPrefill(row, tzMode) {
    const hasOpen = !!row.openTime;
    const openW = mt5ToWib(row.openTime || row.closeTime, tzMode);
    const closeW = mt5ToWib(row.closeTime, tzMode);
    const tol = Math.max(0.011, Math.abs(row.entry) * 0.0001); // toleransi selip harga (slippage)
    const near = (a, b) => a != null && b != null && Math.abs(a - b) <= tol;
    const method = near(row.exit, row.tp) ? 'TP' : near(row.exit, row.sl) ? 'SL' : 'Manual';
    const feeTotal = -((Number(row.swap) || 0) + (Number(row.commission) || 0));
    const net = row.profit == null ? null : row.profit + (Number(row.swap) || 0) + (Number(row.commission) || 0);
    return { symbol: row.symbol || 'XAUUSD', symbolRaw: row.symbolRaw, symbolKnown: !!row.symbol, side: row.side, entry: row.entry, exit: row.exit, lots: row.lots, sl: row.sl, tp: row.tp, fees: Math.round(feeTotal * 100) / 100, exitMethod: method, ticket: row.ticket, profit: row.profit, net, rawOpen: row.openTime || row.closeTime, rawClose: row.closeTime, hasOpen, date: openW, closeDate: closeW };
}
