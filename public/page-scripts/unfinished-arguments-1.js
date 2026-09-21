
(function(){
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function(el){ obs.observe(el); });
})();
