
  (function(){
    var BASE = 'https://diegodella.ar/nuggets.html';
    var cards = document.querySelectorAll('.nugget-card');

    /* ── Assign IDs ── */
    cards.forEach(function(c, i){ if(!c.id) c.id = 'n' + (i + 1); });

    /* ── Inject share buttons into each expand section ── */
    cards.forEach(function(card){
      var expand = card.querySelector('.nugget-expand');
      if(!expand) return;
      var title = (card.querySelector('.nugget-title') || {}).textContent || '';
      var row = document.createElement('div');
      row.className = 'nugget-actions';
      row.innerHTML =
        '<span class="nugget-actions-label">Drop this on someone</span>' +
        '<button class="nugget-share-btn" data-share="x" type="button">Post on X &rarr;</button>' +
        '<button class="nugget-share-btn" data-share="li" type="button">Share on LinkedIn &rarr;</button>' +
        '<button class="nugget-share-btn" data-share="copy" type="button">Copy link</button>';
      expand.appendChild(row);

      row.addEventListener('click', function(e){
        var btn = e.target.closest('.nugget-share-btn');
        if(!btn) return;
        e.stopPropagation();
        var url = BASE + '#' + card.id;
        var text = title + ' - Narrative Nuggets';
        var type = btn.getAttribute('data-share');

        if(type === 'x'){
          window.open('https://x.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'width=550,height=420');
        } else if(type === 'li'){
          window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), '_blank', 'width=550,height=500');
        } else if(type === 'copy'){
          copyText(url, btn);
        }
      });
    });

    /* ── Clipboard (HTTP-safe fallback) ── */
    function copyText(text, btn){
      var row = btn.closest('.nugget-actions');
      var previous = row.querySelector('.copy-feedback');
      if (previous) previous.remove();
      function failed(){
        var feedback = document.createElement('span');
        feedback.className = 'copy-feedback';
        feedback.setAttribute('role', 'status');
        feedback.textContent = 'Copy unavailable. Select this link: ';
        var input = document.createElement('input');
        input.readOnly = true;
        input.value = text;
        input.setAttribute('aria-label', 'Link to this nugget');
        feedback.appendChild(input);
        row.appendChild(feedback);
        input.focus();
        input.select();
      }
      if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(text).then(function(){ flash(btn); }).catch(failed);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
        document.body.appendChild(ta);
        ta.select();
        var copied = false;
        try { copied = document.execCommand('copy'); } catch (_) {}
        ta.remove();
        btn.focus();
        if (copied) flash(btn); else failed();
      }
    }
    function flash(btn){
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      var feedback = document.createElement('span');
      feedback.className = 'copy-feedback';
      feedback.setAttribute('role', 'status');
      feedback.textContent = 'Link copied.';
      btn.closest('.nugget-actions').appendChild(feedback);
      setTimeout(function(){ btn.textContent = orig; btn.classList.remove('copied'); }, 1800);
    }

    /* ── Deep link: scroll to #nX on load ── */
    function openHash(){
      var h = location.hash.replace('#','');
      if(!h) return;
      var target = document.getElementById(h);
      if(!target || !target.classList.contains('nugget-card')) return;
      window.nuggetControls.filter('all');
      window.nuggetControls.reveal(target);
    }
    openHash();
    window.addEventListener('hashchange', openHash);

    /* ── Surprise me ── */
    var surpriseBtn = document.getElementById('surprise');
    if(surpriseBtn){
      surpriseBtn.addEventListener('click', function(){
        var visible = [];
        cards.forEach(function(c){ if(!c.classList.contains('hidden')) visible.push(c); });
        if(!visible.length) return;
        var pick = visible[Math.floor(Math.random() * visible.length)];
        cards.forEach(function(c){ window.nuggetControls.expand(c, false); c.classList.remove('flash'); });
        window.nuggetControls.reveal(pick);
      });
    }
  })();
  