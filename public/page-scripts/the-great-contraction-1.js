
(function(){
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function(el){ obs.observe(el); });
  // Share button
  var sb = document.getElementById('shareBtn');
  if (sb) sb.addEventListener('click', function(){
    var url = window.location.href;
    if (navigator.share) { navigator.share({ title: document.title, url: url }); }
    else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function(){ sb.classList.add('copied'); sb.textContent = 'Copied'; setTimeout(function(){ sb.classList.remove('copied'); sb.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> Share'; }, 2000); });
    }
  });
})();
