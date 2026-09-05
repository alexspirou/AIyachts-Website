/* ============================================================
   AIyachts — site behaviour
   Vanilla JS, no dependencies. Every block guards its own DOM.
   ============================================================ */
(function(){
  "use strict";

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function(sel, ctx){ return (ctx || document).querySelector(sel); };
  var $$ = function(sel, ctx){ return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* -------------------------------------------------- intro splash */
  (function(){
    var splash = $('#introSplash');
    if(!splash) return;
    if(document.documentElement.getAttribute('data-intro') === 'done'){
      document.body.classList.remove('intro-lock');
      splash.remove();
      return;
    }
    var done = false;
    var finish = function(){
      if(done) return;
      done = true;
      splash.classList.add('hide');
      document.body.classList.remove('intro-lock');
      setTimeout(function(){ if(splash.parentNode) splash.remove(); }, 950);
    };
    if(reduced){ finish(); }
    else {
      setTimeout(finish, 1400);
      splash.addEventListener('click', finish);
    }
  })();

  /* -------------------------------------------------- hero video */
  (function(){
    var v = $('.hero-photo');
    if(!v || v.tagName !== 'VIDEO') return;
    v.muted = true;
    if(reduced){ v.removeAttribute('autoplay'); v.pause(); }
    else { var p = v.play(); if(p && p.catch) p.catch(function(){}); }
  })();

  /* -------------------------------------------------- header + back to top */
  (function(){
    var header = $('#siteHeader');
    var toTop = $('#toTop');
    var ticking = false;
    function onScroll(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var y = window.scrollY;
        if(header) header.classList.toggle('scrolled', y > 40);
        if(toTop) toTop.classList.toggle('show', y > 900);
        ticking = false;
      });
    }
    document.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
    if(toTop) toTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'});
    });
  })();

  /* -------------------------------------------------- mobile menu */
  (function(){
    var btn = $('#menuBtn');
    var menu = $('#mobile-menu');
    if(!btn || !menu) return;
    var close = function(){
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      document.body.style.removeProperty('overflow');
    };
    btn.addEventListener('click', function(){
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', menu).forEach(function(a){ a.addEventListener('click', close); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
  })();

  /* -------------------------------------------------- scroll reveal */
  (function(){
    var els = $$('.reveal, .reveal-stagger');
    if(!els.length) return;
    if(!('IntersectionObserver' in window) || reduced){
      els.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){ io.observe(el); });
  })();

  /* -------------------------------------------------- greece map */
  (function(){
    var wrap = $('#greeceMap');
    if(!wrap) return;
    var sw = $('.sea-switch', wrap);
    var setSea = function(sea){
      wrap.dataset.active = sea;
      if(!sw) return;
      sw.dataset.active = sea;
      $$('.sea-switch-opt', sw).forEach(function(b){
        b.setAttribute('aria-pressed', String(b.dataset.sea === sea));
      });
    };
    if(sw) $$('.sea-switch-opt', sw).forEach(function(b){
      b.addEventListener('click', function(){ setSea(b.dataset.sea); });
    });
    $$('.sea-zone', wrap).forEach(function(el){
      el.addEventListener('click', function(){ setSea(el.dataset.sea); });
      el.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setSea(el.dataset.sea); }
      });
    });
    $$('.sea-card', wrap).forEach(function(el){
      el.addEventListener('mouseenter', function(){ setSea(el.dataset.sea); });
      el.addEventListener('focus', function(){ setSea(el.dataset.sea); });
    });
    setSea('ionian');
  })();

  /* -------------------------------------------------- booking bar */
  (function(){
    var form = $('#bookingForm');
    if(!form) return;
    setTimeout(function(){ form.classList.add('in'); }, reduced ? 0 : 450);

    var out = $('#guestCount');
    var field = $('#guestsField');
    var minus = $('#guestMinus');
    var plus = $('#guestPlus');
    var n = 2;
    var sync = function(){
      if(out) out.textContent = String(n);
      if(field) field.value = String(n);
    };
    if(minus) minus.addEventListener('click', function(){ n = Math.max(1, n-1); sync(); });
    if(plus)  plus.addEventListener('click', function(){ n = Math.min(12, n+1); sync(); });
    sync();
    /* <output> would post an empty value — the hidden field carries it instead */
    if(out) out.removeAttribute('name');
  })();

  /* -------------------------------------------------- contact form */
  (function(){
    var form = $('#enquiryForm');
    if(!form) return;

    /* prefill from ?destination=&start=&end=&guests=&yacht= */
    var q = new URLSearchParams(location.search);
    var setVal = function(id, key){
      var el = document.getElementById(id);
      var v = q.get(key);
      if(!el || !v) return;
      if(el.tagName === 'SELECT'){
        var match = Array.prototype.find.call(el.options, function(o){
          return o.value === v || o.text === v || o.text.indexOf(v) === 0;
        });
        if(match) el.value = match.value || match.text;
      } else {
        el.value = v;
      }
    };
    setVal('fDestination','destination');
    setVal('fStart','start');
    setVal('fEnd','end');
    setVal('fGuests','guests');
    setVal('fYacht','yacht');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var get = function(id){ var el = document.getElementById(id); return el ? String(el.value).trim() : ''; };
      var name = get('fName'), email = get('fEmail');
      if(!name || !email){
        (name ? document.getElementById('fEmail') : document.getElementById('fName')).focus();
        return;
      }
      var lines = [
        'Name: ' + name,
        'Email: ' + email,
        'Destination: ' + get('fDestination'),
        'Yacht of interest: ' + get('fYacht'),
        'Dates: ' + (get('fStart') || '—') + ' to ' + (get('fEnd') || '—'),
        'Guests: ' + get('fGuests'),
        'Charter type: ' + get('fCharterType'),
        '',
        get('fMessage') || '(no additional notes)',
        '',
        '— sent from ai-yachting.com'
      ];
      var subject = 'Charter enquiry — ' + name + ' — ' + (get('fStart') || 'dates to confirm');
      var href = 'mailto:aiyachtsea@gmail.com?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(lines.join('\n'));
      form.classList.add('sent');
      var btn = form.querySelector('button[type="submit"]');
      if(btn) btn.textContent = 'Opening your email…';
      window.location.href = href;
      setTimeout(function(){
        if(btn) btn.innerHTML = 'Send the enquiry <span class="arrow" aria-hidden="true">→</span>';
        form.classList.remove('sent');
      }, 4000);
    });
  })();

  /* -------------------------------------------------- newsletter */
  (function(){
    var form = $('#subscribeForm');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var email = input ? input.value.trim() : '';
      if(!email){ if(input) input.focus(); return; }
      var btn = form.querySelector('button');
      form.classList.add('sent');
      if(btn) btn.textContent = 'Opening your email…';
      window.location.href = 'mailto:aiyachtsea@gmail.com' +
        '?subject=' + encodeURIComponent('Subscribe to the AIyachts dispatches') +
        '&body=' + encodeURIComponent('Please add ' + email + ' to your mailing list.');
      setTimeout(function(){
        if(btn) btn.textContent = "You're on the list";
      }, 1200);
    });
  })();

  /* -------------------------------------------------- fleet filters */
  (function(){
    var bar = $('#fleetFilters');
    var grid = $('#fleetGrid');
    if(!bar || !grid) return;
    var cards = $$('.yacht-card', grid);
    $$('.xg-chip', bar).forEach(function(chip){
      chip.addEventListener('click', function(){
        var f = chip.dataset.filter;
        $$('.xg-chip', bar).forEach(function(c){ c.setAttribute('aria-pressed', String(c === chip)); });
        cards.forEach(function(card){
          card.hidden = !(f === 'all' || card.dataset.cat === f);
        });
      });
    });
  })();

  /* ==========================================================
     GALLERY OF EXPERIENCES
     ========================================================== */
  (function(){
    var grids = $$('.xg-grid');
    if(!grids.length) return;

    /* --- fade images in as they decode --- */
    $$('.xg-tile img').forEach(function(img){
      if(img.complete && img.naturalWidth) img.classList.add('is-loaded');
      else img.addEventListener('load', function(){ img.classList.add('is-loaded'); }, {once:true});
    });

    /* --- filters --- */
    var bar = $('.xg-filters:not(.fleet-filters)');
    var mainGrid = $('#xgGrid');
    var empty = $('#xgEmpty');
    if(bar && mainGrid){
      var tiles = $$('.xg-tile', mainGrid);
      $$('.xg-chip', bar).forEach(function(chip){
        chip.addEventListener('click', function(){
          var f = chip.dataset.filter;
          $$('.xg-chip', bar).forEach(function(c){ c.setAttribute('aria-pressed', String(c === chip)); });
          var shown = 0;
          tiles.forEach(function(t){
            var on = (f === 'all' || t.dataset.cat === f);
            t.hidden = !on;
            if(on) shown++;
          });
          if(empty) empty.hidden = shown > 0;
        });
      });
    }

    /* --- hover-play videos in their tile --- */
    if(!reduced && window.matchMedia('(hover:hover)').matches){
      $$('.xg-tile.is-video').forEach(function(tile){
        var vid = null;
        tile.addEventListener('mouseenter', function(){
          if(document.body.classList.contains('xg-locked')) return;
          if(!vid){
            vid = document.createElement('video');
            vid.src = tile.dataset.video;
            vid.muted = true; vid.loop = true; vid.playsInline = true;
            vid.setAttribute('playsinline',''); vid.setAttribute('aria-hidden','true');
            vid.preload = 'none';
            tile.insertBefore(vid, tile.firstChild);
          }
          var p = vid.play();
          if(p && p.catch) p.catch(function(){});
          vid.classList.add('is-playing');
        });
        tile.addEventListener('mouseleave', function(){
          if(!vid) return;
          vid.classList.remove('is-playing');
          setTimeout(function(){ if(vid && !vid.classList.contains('is-playing')) vid.pause(); }, 700);
        });
      });
    }

    /* --- lightbox --- */
    var lb = $('#xgLightbox');
    var teaser = $('.xg-teaser');

    if(!lb){
      /* teaser grid without a viewer: send people to the full gallery */
      if(teaser){
        $$('.xg-open', teaser).forEach(function(btn){
          btn.addEventListener('click', function(){
            location.href = teaser.dataset.fallback || 'experiences.html';
          });
        });
      }
      return;
    }

    var stage = $('#xgStage');
    var capEl = $('#xgCap');
    var countEl = $('#xgCount');
    var items = $$('.xg-tile', mainGrid || document);
    var index = 0;
    var lastFocus = null;

    function visibleItems(){
      return items.filter(function(t){ return !t.hidden; });
    }

    function render(){
      var list = visibleItems();
      var tile = list[index];
      if(!tile) return;
      stage.innerHTML = '';
      var node;
      if(tile.dataset.video){
        node = document.createElement('video');
        node.src = tile.dataset.video;
        node.poster = tile.dataset.poster || '';
        node.controls = true;
        node.autoplay = true;
        node.loop = true;
        node.playsInline = true;
        node.setAttribute('playsinline','');
        node.preload = 'auto';
      } else {
        node = document.createElement('img');
        node.src = tile.dataset.full;
        node.alt = tile.dataset.alt || '';
        node.decoding = 'async';
      }
      stage.appendChild(node);
      capEl.textContent = tile.dataset.title || '';
      countEl.textContent = String(index + 1).padStart(2,'0') + ' / ' + String(list.length).padStart(2,'0');
      /* warm the neighbours */
      [list[index+1], list[index-1]].forEach(function(t){
        if(t && !t.dataset.video && t.dataset.full){ var i = new Image(); i.src = t.dataset.full; }
      });
    }

    function open(i){
      lastFocus = document.activeElement;
      index = i;
      lb.hidden = false;
      document.body.classList.add('xg-locked');
      requestAnimationFrame(function(){ lb.classList.add('is-open'); });
      render();
      var close = $('.xg-lb-close', lb);
      if(close) close.focus();
    }

    function close(){
      lb.classList.remove('is-open');
      document.body.classList.remove('xg-locked');
      setTimeout(function(){
        lb.hidden = true;
        stage.innerHTML = '';
      }, 380);
      if(lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function step(d){
      var list = visibleItems();
      if(!list.length) return;
      index = (index + d + list.length) % list.length;
      render();
    }

    items.forEach(function(tile){
      var btn = $('.xg-open', tile);
      if(!btn) return;
      btn.addEventListener('click', function(){
        var list = visibleItems();
        var i = list.indexOf(tile);
        open(i < 0 ? 0 : i);
      });
    });

    $$('[data-close]', lb).forEach(function(el){ el.addEventListener('click', close); });
    var prev = $('[data-prev]', lb), next = $('[data-next]', lb);
    if(prev) prev.addEventListener('click', function(){ step(-1); });
    if(next) next.addEventListener('click', function(){ step(1); });

    document.addEventListener('keydown', function(e){
      if(lb.hidden) return;
      if(e.key === 'Escape'){ e.preventDefault(); close(); }
      else if(e.key === 'ArrowRight'){ e.preventDefault(); step(1); }
      else if(e.key === 'ArrowLeft'){ e.preventDefault(); step(-1); }
      else if(e.key === 'Tab'){
        var focusable = $$('button', lb).filter(function(b){ return b.offsetParent !== null; });
        if(!focusable.length) return;
        var first = focusable[0], last = focusable[focusable.length - 1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    });

    /* swipe */
    var x0 = null;
    lb.addEventListener('touchstart', function(e){ x0 = e.changedTouches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){
      if(x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if(Math.abs(dx) > 55) step(dx < 0 ? 1 : -1);
      x0 = null;
    }, {passive:true});

    /* deep link: experiences.html#slug */
    if(location.hash){
      var slug = location.hash.slice(1);
      var found = items.findIndex(function(t){
        return (t.dataset.full || '').indexOf('/' + slug + '-') > -1;
      });
      if(found > -1) open(found);
    }
  })();

})();
