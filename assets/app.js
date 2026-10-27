/* 嘉義市勞動力服務人員職業工會 網站互動
   每一頁都載入這支檔案，各功能只在該頁有對應元素時才啟動。 */
(function(){
'use strict';
var $=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var REDUCE=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var root=document.documentElement,HAS=!!(window.gsap&&window.ScrollTrigger);
if(HAS)gsap.registerPlugin(ScrollTrigger);
function css(n){return getComputedStyle(root).getPropertyValue(n).trim()}
function say(m){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(say.t);say.t=setTimeout(function(){t.classList.remove('on')},2400)}
function scrollToId(id){var el=document.getElementById(id);if(el)el.scrollIntoView({block:'start',behavior:REDUCE?'auto':'smooth'})}

/* 頁內的捲動按鈕（用 button，不用連結） */
document.addEventListener('click',function(e){var b=e.target.closest('button[data-to]');if(b)scrollToId(b.getAttribute('data-to'))});

/* 手機選單 */
var menu=document.getElementById('menu'),mp=document.getElementById('mpanel');
if(menu&&mp){
  menu.addEventListener('click',function(){var o=mp.hidden;mp.hidden=!o;menu.setAttribute('aria-expanded',String(o))});
  mp.addEventListener('click',function(e){if(e.target.closest('a[href^="#"]')){mp.hidden=true;menu.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!mp.hidden){mp.hidden=true;menu.setAttribute('aria-expanded','false');menu.focus()}});
}

/* 水深：標頭顏色跟著捲到的區塊變化 */
function setDepthFromScroll(){
  var y=window.innerHeight*.4,best=null;
  $('[data-depth]').forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y)best=s});
  if(best){var d=best.getAttribute('data-depth');root.style.setProperty('--head-bg',css('--d'+d+'-bg'));root.style.setProperty('--head-fg',css('--d'+d+'-fg'));root.classList.toggle('hd-dark',d==='9')}
}
var ticking=false;
window.addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;setDepthFromScroll()})},{passive:true});
window.addEventListener('resize',setDepthFromScroll);
setDepthFromScroll();

/* 入會頁：費用試算
   115 年（2026）職業工會會員每月個人負擔，金額用整數運算、四捨五入：
   - 勞保：普通事故 11.5%＋職災 0.25%（第 1 級 2,080 元，已由工會確認），會員自付 60%；普通事故投保薪資上限 45,800 元
   - 健保：5.17%，會員自付 60%，每位眷屬（最多 3 人）同一金額
   - 經常會費 180 元（固定）
   要改費率或級距，改下面這幾個數字即可。 */
var GR=[29500,30300,31800,33300,34800,36300,38200,40100,42000,43900,45800];
var DUES=180;
var fmt=function(n){return Math.round(n).toLocaleString('en-US')};
var rd=function(a,b){return Math.floor((2*a+b)/(2*b))};
var fLabor=function(g){return rd(Math.min(g,45800)*115*6,10000)+rd(g*25*6,100000)};
var fHealth=function(g){return rd(g*517*6,100000)};
var lv=document.getElementById('lvl'),famBtns=$('#fam button');
if(lv&&famBtns.length){
  var tt={v:fLabor(GR[0])+fHealth(GR[0])+DUES};
  var calc=function(){
    var g=GR[+lv.value],fb=$('#fam button[aria-pressed="true"]')[0],n=fb?+fb.getAttribute('data-n'):0;
    var l=fLabor(g),h=fHealth(g)*(n+1),total=l+h+DUES;
    document.getElementById('lf').textContent=fmt(l);document.getElementById('hc').textContent=n+1;document.getElementById('hf').textContent=fmt(h);
    $('.lvt tbody tr').forEach(function(r){r.classList.toggle('on',+r.getAttribute('data-i')===+lv.value)});
    if(HAS&&!REDUCE)gsap.to(tt,{v:total,duration:.5,ease:'power2.out',onUpdate:function(){document.getElementById('tt').textContent=fmt(tt.v)}});else document.getElementById('tt').textContent=fmt(total);
  };
  famBtns.forEach(function(b){b.addEventListener('click',function(){famBtns.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});calc()})});
  lv.addEventListener('change',calc);
  $('.lvt tbody tr').forEach(function(r){r.addEventListener('click',function(){lv.value=r.getAttribute('data-i');calc()})});
}

/* 可展開的問答與消息（內容已寫在 HTML 裡，沒有 JavaScript 時是全部展開） */
function wirePanel(btn,panel){
  panel.inert=true;
  btn.addEventListener('click',function(){
    var o=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',String(!o));btn.lastElementChild.textContent=o?'＋':'－';panel.inert=o;
    if(HAS&&!REDUCE)gsap.to(panel,{height:o?0:'auto',duration:.4,ease:'power2.inOut'});else panel.style.height=o?'0':'auto';
  });
}
$('.faq>div').forEach(function(w){wirePanel(w.querySelector('button'),w.querySelector('.a'))});
$('.ni').forEach(function(w){var b=w.querySelector(':scope>button');if(b)wirePanel(b,w.querySelector('.na'))});

/* 最新消息：分類篩選 */
var chips=document.getElementById('nchips');
if(chips){
  var cats=['全部','勞保局公告','會員服務','課程活動','權益提醒','工會公告'],items=$('.ni'),none=document.getElementById('nnone');
  cats.forEach(function(c,i){
    var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=c;b.setAttribute('aria-pressed',String(i===0));
    b.addEventListener('click',function(){
      $('.chip',chips).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
      var n=0;items.forEach(function(it){var show=c==='全部'||it.getAttribute('data-c')===c;it.hidden=!show;if(show)n++});
      if(none)none.hidden=n>0;
    });
    chips.appendChild(b);
  });
}

/* 勞保給付：電腦預設展開，手機預設收合 */
(function(){var big=matchMedia('(min-width:861px)').matches;$('details.bk').forEach(function(d){d.open=big})})();

/* 複製號碼、撥號提示 */
$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
  var v=b.getAttribute('data-copy');
  function fb(){var el=b.previousElementSibling,r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);say('請長按號碼，選「拷貝」')}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(function(){say('已複製 '+v)},fb)}else fb();
})});
$('a[href^="tel:"]').forEach(function(a){a.addEventListener('click',function(e){
  var num=a.getAttribute('data-num')||a.textContent;
  if(a.classList.contains('d-call')&&matchMedia('(min-width:861px) and (hover:hover)').matches){
    e.preventDefault();
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(num).then(function(){say('已複製服務專線 '+num)},function(){say('服務專線：'+num)});else say('服務專線：'+num);
    return;
  }
  setTimeout(function(){if(!document.hidden)say('如果沒有跳出撥號，請複製號碼：'+num)},900)})});

/* 進場動畫 */
var main=document.getElementById('main');
if(HAS&&!REDUCE&&main){
  try{
    $('.kick,h2,.sub,.chk,.svc>div,.step,.ben a,.box,.warn,.bov button,.bsec .bh,.bsec .bgrid,.bsec .blinks,.ni,.faq>div,.chips,.empty',main).forEach(function(el){
      gsap.from(el,{y:34,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
    });
    if(matchMedia('(min-width:861px)').matches)$('[data-steps]',main).forEach(function(st){
      gsap.to(st.querySelector('.rail'),{scaleX:1,ease:'none',scrollTrigger:{trigger:st,start:'top 75%',end:'bottom 55%',scrub:true}});
    });
    gsap.from('#contact .contact',{y:34,duration:.85,ease:'power3.out',scrollTrigger:{trigger:'#contact',start:'top 85%',once:true}});
  }catch(err){console.error(err)}
}
function heroIntro(){
  if(!HAS||REDUCE)return;
  gsap.from('.hero .h1 .ln>span',{yPercent:110,duration:1.1,ease:'power4.out',stagger:.14});
  gsap.from('.hero .lead,.hero .acts',{y:22,duration:.9,ease:'power3.out',stagger:.1,delay:.25});
}
if(HAS&&!REDUCE&&document.querySelector('.phero .in'))gsap.from('.phero .in',{y:26,duration:.7,ease:'power3.out',clearProps:'all'});

/* 封面：只在首頁；每次新開啟網站才出現，從別頁回首頁或帶 #錨點進來就略過 */
var cover=document.getElementById('cover');
if(!cover&&document.body.getAttribute('data-page')==='home')heroIntro();
if(cover){
  if(root.classList.contains('nocover')){cover.parentNode.removeChild(cover);heroIntro()}
  else{
    var behind=[].slice.call(document.body.children).filter(function(n){return n.id!=='cover'&&['SCRIPT','STYLE','LINK','NOSCRIPT'].indexOf(n.tagName)<0});
    var lockBehind=function(on){behind.forEach(function(n){try{n.inert=on}catch(e){}})};
    var entered=false,go=document.getElementById('cvgo');
    var enter=function(){
      if(entered)return;entered=true;lockBehind(false);root.classList.remove('lock');
      try{sessionStorage.setItem('cu','1')}catch(e){}
      if(REDUCE)cover.classList.add('fade');else cover.classList.add('out');
      setTimeout(function(){cover.hidden=true},REDUCE?450:950);
      heroIntro();
    };
    root.classList.add('lock');lockBehind(true);
    if(HAS&&!REDUCE)gsap.from('#cover .cv-t .ln>span',{yPercent:110,duration:1.1,ease:'power4.out',stagger:.14,delay:.1});
    go.addEventListener('click',enter);
    cover.addEventListener('click',enter);document.addEventListener('keydown',function(e){if(!entered&&!cover.hidden&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&['Tab','Shift','Control','Alt','Meta','CapsLock'].indexOf(e.key)<0){e.preventDefault();enter()}});
  }
}

/* 從別頁帶錨點進來時，等字型和動畫就位後再對齊一次 */
window.addEventListener('load',function(){if(location.hash.length>1){var el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(el)el.scrollIntoView()}if(HAS)ScrollTrigger.refresh();setDepthFromScroll()});
})();
