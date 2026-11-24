(function(){
  var d=document;
  // menu
  var b=d.getElementById('burger'),n=d.getElementById('nav');
  function zamknij(){n.classList.remove('otw');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu');}
  if(b){
    b.addEventListener('click',function(){var o=n.classList.toggle('otw');b.setAttribute('aria-expanded',o?'true':'false');b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');});
  }
  d.querySelectorAll('.nav-g').forEach(function(g){
    g.addEventListener('click',function(){if(innerWidth<=1100)return;var li=g.parentNode,o=li.classList.toggle('otw');g.setAttribute('aria-expanded',o?'true':'false');});
  });
  d.addEventListener('click',function(e){d.querySelectorAll('.has-sub.otw').forEach(function(li){if(!li.contains(e.target)){li.classList.remove('otw');li.firstElementChild.setAttribute('aria-expanded','false');}});});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){zamknij();d.querySelectorAll('.has-sub.otw').forEach(function(li){li.classList.remove('otw');});}});

  // przewijane listy: palec, mysz, strzalki
  d.querySelectorAll('[data-przes]').forEach(function(w){
    var t=w.querySelector('.przes-tor'),x0=0,s0=0,ciag=false,ruch=0;
    function krok(){var el=t.children[0];return el?el.getBoundingClientRect().width+18:300;}
    var l=w.querySelector('.pn-l'),p=w.querySelector('.pn-p');
    if(l)l.addEventListener('click',function(){t.scrollBy({left:-krok(),behavior:'smooth'});});
    if(p)p.addEventListener('click',function(){t.scrollBy({left:krok(),behavior:'smooth'});});
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;ciag=true;ruch=0;x0=e.clientX;s0=t.scrollLeft;t.classList.add('ciag');});
    window.addEventListener('pointermove',function(e){if(!ciag)return;ruch=Math.abs(e.clientX-x0);t.scrollLeft=s0-(e.clientX-x0);});
    window.addEventListener('pointerup',function(){if(!ciag)return;ciag=false;t.classList.remove('ciag');});
    t.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();}},true);
    t.addEventListener('dragstart',function(e){e.preventDefault();});
  });

  // powiekszanie zdjec (galerie, wpisy)
  var lb=null,lista=[],ind=0,img,opis;
  function pokaz(i){ind=(i+lista.length)%lista.length;var a=lista[ind];img.src=a.getAttribute('href');img.alt=a.querySelector('img').alt;opis.textContent=(ind+1)+' / '+lista.length+(img.alt?' · '+img.alt:'');}
  function zbuduj(){
    lb=d.createElement('div');lb.className='lb';lb.hidden=true;lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Powiększone zdjęcie');
    lb.innerHTML='<img alt=""><button type="button" class="lb-x" aria-label="Zamknij">&#215;</button><button type="button" class="lb-l" aria-label="Poprzednie">&#8592;</button><button type="button" class="lb-p" aria-label="Następne">&#8594;</button><p></p>';
    d.body.appendChild(lb);img=lb.querySelector('img');opis=lb.querySelector('p');
    lb.querySelector('.lb-x').onclick=zamk;lb.querySelector('.lb-l').onclick=function(){pokaz(ind-1);};lb.querySelector('.lb-p').onclick=function(){pokaz(ind+1);};
    lb.addEventListener('click',function(e){if(e.target===lb)zamk();});
    var x=null;lb.addEventListener('touchstart',function(e){x=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',function(e){if(x===null)return;var dx=e.changedTouches[0].clientX-x;if(Math.abs(dx)>40)pokaz(ind+(dx<0?1:-1));x=null;});
    d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='ArrowRight')pokaz(ind+1);if(e.key==='ArrowLeft')pokaz(ind-1);if(e.key==='Escape')zamk();});
  }
  var ostatni=null;
  function zamk(){lb.hidden=true;d.body.style.overflow='';if(ostatni)ostatni.focus();}
  d.querySelectorAll('[data-lb]').forEach(function(g){
    var a=[].slice.call(g.querySelectorAll('a'));
    a.forEach(function(el,i){el.addEventListener('click',function(e){e.preventDefault();if(!lb)zbuduj();lista=a;ostatni=el;pokaz(i);lb.hidden=false;d.body.style.overflow='hidden';lb.querySelector('.lb-x').focus();});});
  });

  // filtr laureatow
  var fm=d.getElementById('f-miasto'),fq=d.getElementById('f-szukaj'),fo=d.getElementById('f-wynik');
  function filtruj(){
    var m=fm?fm.value:'',q=fq?fq.value.trim().toLowerCase():'',ile=0;
    d.querySelectorAll('.lau li').forEach(function(li){var ok=(!m||li.getAttribute('data-m')===m)&&(!q||li.textContent.toLowerCase().indexOf(q)>-1);li.hidden=!ok;if(ok)ile++;});
    d.querySelectorAll('.grupa').forEach(function(g){g.hidden=!g.querySelector('.lau li:not([hidden])');});
    if(fo)fo.textContent='Pozycji: '+ile;
  }
  if(fm){fm.addEventListener('change',filtruj);var pm=new URLSearchParams(location.search).get('miasto');if(pm){fm.value=pm;filtruj();}}
  if(fq)fq.addEventListener('input',filtruj);

  // formularz (podglad bez wysylki)
  var f=d.getElementById('form');
  if(f){
    var l=d.getElementById('l-nazwa'),info=d.getElementById('form-info');
    var et={restauracja:'Nazwa restauracji',kucharz:'Imię i nazwisko kucharza',produkt:'Nazwa firmy i produktu',wspolpraca:'Nazwa firmy'};
    function ustaw(v){var r=f.querySelector('input[name="typ"][value="'+v+'"]');if(r){r.checked=true;l.textContent=et[v];}}
    f.addEventListener('change',function(e){if(e.target.name==='typ')l.textContent=et[e.target.value];});
    var pt=new URLSearchParams(location.search).get('typ');if(pt&&et[pt])ustaw(pt);
    f.addEventListener('submit',function(e){e.preventDefault();
      if(!f.checkValidity()){info.textContent='Uzupełnij pola oznaczone gwiazdką i zaznacz zgodę na kontakt.';return;}
      info.textContent='To wersja testowa strony: formularz nie wysyła jeszcze danych. Zgłoszenia prosimy kierować na adres biuro@polskaodkuchni.com.pl.';});
  }

  // zgody cookies i mapa
  var KL='pok-zgoda',c=d.getElementById('cookies');
  function zgoda(){try{return localStorage.getItem(KL);}catch(e){return null;}}
  function zapisz(v){try{localStorage.setItem(KL,v);}catch(e){}if(c)c.hidden=true;if(v==='tak')mapy(true);}
  if(c){
    c.querySelector('[data-c="tak"]').addEventListener('click',function(){zapisz('tak');});
    c.querySelector('[data-c="nie"]').addEventListener('click',function(){zapisz('nie');});
  }
  d.querySelectorAll('[data-cookies]').forEach(function(x){x.addEventListener('click',function(){if(c)c.hidden=false;});});
  function wstaw(m){if(m.querySelector('iframe'))return;var i=d.createElement('iframe');i.src=m.getAttribute('data-src');i.title='Mapa Google: Fundacja WIP, ul. J. Kochanowskiego 31, Warszawa';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';m.appendChild(i);var z=m.querySelector('.mapa-z');if(z)z.remove();}
  function mapy(teraz){
    d.querySelectorAll('.mapa[data-src]').forEach(function(m){
      var b=m.querySelector('button');if(b)b.onclick=function(){wstaw(m);};
      if(zgoda()==='nie'&&!teraz)return;
      if(!('IntersectionObserver' in window)){wstaw(m);return;}
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){wstaw(m);io.disconnect();}});},{rootMargin:'300px'});io.observe(m);
    });
  }
  mapy(false);

  // filmy: YouTube ladowany dopiero po kliknieciu w kadr
  d.querySelectorAll('.film[data-yt] .film-k').forEach(function(k){
    k.addEventListener('click',function(){
      var id=k.parentNode.getAttribute('data-yt'),i=d.createElement('iframe');
      i.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
      i.title=k.getAttribute('aria-label').replace('Odtwórz film: ','');
      i.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';i.allowFullscreen=true;
      var w=d.createElement('div');w.className='film-k';w.appendChild(i);k.replaceWith(w);
    });
  });

  var r=d.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
