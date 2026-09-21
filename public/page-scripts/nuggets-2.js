
  (function(){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.06 });
    document.querySelectorAll('.fade-in').forEach(function(el){ obs.observe(el); });
  })();
  