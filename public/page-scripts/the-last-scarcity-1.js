
    function handleShare() {
      var u = window.location.href;
      var t = 'The Last Scarcity';
      var x = 'When every material scarcity falls, one remains. It can\'t be automated. It can only come from inside a body that wants something it can\'t quite name.';
      if (navigator.share) {
        navigator.share({ title: t, text: x, url: u }).catch(function(){});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(u).then(function() {
          var b = document.getElementById('shareBtn');
          b.classList.add('copied');
          b.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied';
          setTimeout(function() {
            b.classList.remove('copied');
            b.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Share';
          }, 2000);
        });
      }
    }
  