/* Splash / layar pembuka: tampil seketika dan memudar setelah aplikasi siap */
/* Splash: tampil sekarang juga, tampil minimal ~1 detik agar animasi selesai, lalu memudar halus. */
window.__splashStart=(window.performance&&performance.now)?performance.now():0;
window.__splashMin=1350;
(function(){var m=document.querySelector('#splash .sp-mark');if(m)m.addEventListener('animationstart',function(){if(window.__splashAnimStart==null)window.__splashAnimStart=performance.now();},{once:true});})();
/* Splash Android sekarang kosong (ikon maskable = warna latar), jadi animasi langsung muncul dari tengah layar:
   logo besar tampil sebentar, lalu menyusut ke kiri sambil tulisan muncul. Tidak ada pergeseran vertikal. */
(function(){
  try{
    var sp=document.getElementById('splash'),mk=sp&&sp.querySelector('.sp-mark');
    if(!mk)return;
    var W=innerWidth;
    var lk=mk.offsetParent.getBoundingClientRect(),w=mk.offsetWidth; if(!w)return;   /* ukuran layout, tidak terpengaruh transform */
    var mx=lk.left+mk.offsetLeft+w/2;
    var size=Math.min(W*0.3345,w*2.4);    /* logo awal besar di tengah */
    sp.style.setProperty('--ss',(size/w).toFixed(4));
    sp.style.setProperty('--sx',(W/2-mx).toFixed(1)+'px');
    sp.style.setProperty('--sy','0px');
    sp.classList.add('sp-morph');
  }catch(e){}
})();
window.__hideSplash=function(){
  var sp=document.getElementById('splash');
  if(!sp||sp.__going)return; sp.__going=true;
  sp.classList.add('sp-out');
  setTimeout(function(){if(sp&&sp.parentNode)sp.parentNode.removeChild(sp);},520);
};
