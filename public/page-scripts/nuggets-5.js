
  (function(){
    var pbar = document.getElementById('pbar');
    var pbarLabel = document.getElementById('pbar-label');
    if (!pbar) return;
    function updatePbar() {
      var s = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (s / h) * 100 : 0;
      pbar.style.width = pct + '%';
      if (pbarLabel) pbarLabel.style.left = Math.min(pct, 97) + '%';
    }
    window.addEventListener('scroll', updatePbar, { passive: true });
    updatePbar();

    /* Label: show active filter + visible nugget count */
    if (pbarLabel) {
      var filterChips = document.querySelectorAll('.filter-chip');
      var allCards = document.querySelectorAll('.nugget-card');

      function updateLabel() {
        var activeChip = document.querySelector('.filter-chip.active');
        var filterName = activeChip ? activeChip.getAttribute('data-filter') : 'all';
        var label = filterName === 'all' ? 'All' : filterName.toUpperCase();
        var visible = 0;
        allCards.forEach(function(c) { if (!c.classList.contains('hidden')) visible++; });
        pbarLabel.textContent = label + ' \u00b7 ' + visible + ' nuggets';
      }
      updateLabel();
      filterChips.forEach(function(chip) {
        chip.addEventListener('click', function() { setTimeout(updateLabel, 50); });
      });

      /* Show/hide on hero & footer */
      var gridEl = document.querySelector('.nuggets-grid');
      var showObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { pbarLabel.classList.add('show'); updateLabel(); }
        });
      }, { threshold: 0.05 });
      if (gridEl) showObs.observe(gridEl);

      var hideObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) { if (e.isIntersecting) pbarLabel.classList.remove('show'); });
      }, { threshold: 0.3 });
      var heroEl = document.querySelector('.hero');
      var footerEl = document.querySelector('footer');
      if (heroEl) hideObs.observe(heroEl);
      if (footerEl) hideObs.observe(footerEl);
    }
  })();
  