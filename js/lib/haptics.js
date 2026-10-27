/* Getaran ringan saat tombol ditekan */
"use strict";
/* ===== Haptic v2.3.0 =====
   Chrome Android hanya mengizinkan navigator.vibrate() setelah halaman pernah mendapat "user activation".
   Untuk sentuhan, aktivasi itu baru terjadi saat jari DIANGKAT (pointerup) — sehingga getar di pointerdown
   pertama selalu diblokir dan baru jalan di sentuhan kedua. Perbaikan: jika belum ada aktivasi, getar
   ditunda ke pointerup (hanya sentuhan pertama, selisihnya hitungan milidetik). Tombol menu bawah
   bergetar tepat saat tab berpindah (event click), jadi selalu sinkron, termasuk di sentuhan pertama. */
/* Aplikasi Android (Capacitor): WebView sering tidak menggetarkan lewat navigator.vibrate, jadi pakai plugin Haptics bawaan. */
function nativeHaptics() {
    try {
        const c = window.Capacitor;
        if (c && c.isNativePlatform && c.isNativePlatform())
            return (c.Plugins && c.Plugins.Haptics) || (c.registerPlugin && c.registerPlugin('Haptics')) || null;
    }
    catch (e) { }
    return null;
}
function setupHaptics() {
    if (window.__hapticsReady || (typeof navigator.vibrate !== 'function' && !nativeHaptics())) return;
    window.__hapticsReady = true;
    const NAV_SEL = '.nav-item';
    const LIGHT_SEL = '.pill,.tsel,.dfield,.cal-cell,.pe-tabs button,.pe-years button,button[aria-label="Buka kalender"]';
    let pending = null;
    const isTouch = e => e.pointerType === 'touch' || e.pointerType === 'pen';
    const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const hasActivation = () => !!nativeHaptics() || !navigator.userActivation || navigator.userActivation.hasBeenActive;
    const targetOf = e => (e.target && e.target.closest) ? e.target.closest('button,[role="button"]') : null;
    function patternFor(el) {
        const label = (el.textContent || '').trim().toLowerCase();
        if (el.matches('.delete-btn,.account-delete') || /hapus|delete|remove/.test(label)) return [40, 40, 40];
        if (el.matches('.ok') || /simpan|deposit modal|tambah akun|cloud backup|backup berhasil/.test(label)) return [15, 30, 20];
        if (el.matches('.fab,.primary-btn,.nav-add') || /add trade|tambah trade/.test(label)) return 18;
        if (el.matches(NAV_SEL + ',' + LIGHT_SEL)) return 10;
        return 8;
    }
    function fire(pattern) {
        const nh = nativeHaptics();
        if (nh) {
            try {
                let t = 0;
                [].concat(pattern).forEach((d, i) => { if (i % 2 === 0) setTimeout(() => { try { const r = nh.vibrate({ duration: d }); if (r && r.catch) r.catch(() => { }); } catch (e) { } }, t); t += d; });
                return true;
            }
            catch (err) { return false; }
        }
        try { return navigator.vibrate(pattern); } catch (err) { return false; }
    }
    document.addEventListener('pointerdown', e => {
        pending = null;
        const el = targetOf(e);
        if (!el || !isTouch(e) || reduced()) return;
        if (el.closest('.performance-detail-page')) return;
        if (el.matches(NAV_SEL)) return;              // menu bawah: getar saat click (sinkron dengan pindah tab)
        const p = patternFor(el);
        if (hasActivation()) { if (fire(p) === false) pending = p; }
        else pending = p;                              // sentuhan pertama: tunda sampai jari diangkat
    }, true);
    const flush = () => { if (pending !== null) { const p = pending; pending = null; fire(p); } };
    document.addEventListener('pointerup', flush, true);
    document.addEventListener('touchend', flush, true);
    document.addEventListener('pointercancel', () => { pending = null; }, true);
    document.addEventListener('click', e => {
        flush();
        const el = targetOf(e);
        if (!el || !el.matches(NAV_SEL) || !isTouch(e) || reduced()) return;
        fire(patternFor(el));
    }, true);
}
setupHaptics();
