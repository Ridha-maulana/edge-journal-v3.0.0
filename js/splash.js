/* Splash / layar pembuka: tampil seketika dan memudar setelah aplikasi siap */
/* Splash: tampil sekarang juga, tampil minimal ~1 detik agar animasi selesai, lalu memudar halus. */
window.__splashStart=(window.performance&&performance.now)?performance.now():0;
window.__splashMin=1350;
(function(){var m=document.querySelector('#splash .sp-mark');if(m)m.addEventListener('animationstart',function(){if(window.__splashAnimStart==null)window.__splashAnimStart=performance.now();},{once:true});})();
/* Splash Android menampilkan logo bulat (ikon maskable v5). Saat dibuka sebagai aplikasi terpasang, animasi halaman mulai dari
   logo yang sama di tengah layar (tanpa fade-in) lalu menyusut jadi kotak membulat ke kiri sambil tulisan muncul.
   Di tab browser biasa (tanpa splash Android) logo memudar masuk seperti sebelumnya. */
(function(){
  try{
    var sp=document.getElementById('splash'),mk=sp&&sp.querySelector('.sp-mark');
    if(!mk)return;
    var W=innerWidth;
    var lk=mk.offsetParent.getBoundingClientRect(),w=mk.offsetWidth; if(!w)return;   /* ukuran layout, tidak terpengaruh transform */
    var mx=lk.left+mk.offsetLeft+w/2;
    var size=Math.min(W*0.4711,520);    /* logo awal = ukuran logo splash Android hasil ukur video (47,11% lebar layar, tepat di tengah) */
    sp.style.setProperty('--ss',(size/w).toFixed(4));
    sp.style.setProperty('--sx',(W/2-mx).toFixed(1)+'px');
    sp.style.setProperty('--sy','0px');
    try{if((window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone)sp.classList.add('sp-android');}catch(e){}
    sp.classList.add('sp-morph');
  }catch(e){}
})();
window.__hideSplash=function(){
  var sp=document.getElementById('splash');
  if(!sp||sp.__going)return; sp.__going=true;
  sp.classList.add('sp-out');
  setTimeout(function(){if(sp&&sp.parentNode)sp.parentNode.removeChild(sp);},520);
};
