(function(){
  var chips = Array.from(document.querySelectorAll('.filter-chip'));
  var cards = Array.from(document.querySelectorAll('.nugget-card'));
  var status = document.createElement('p');
  status.className = 'nugget-filter-status';
  status.setAttribute('role', 'status');
  document.querySelector('.filter-bar').appendChild(status);
  function expand(card, open) {
    var button = card.querySelector('.nugget-disclosure');
    var panel = card.querySelector('.nugget-expand');
    if (!open && panel.contains(document.activeElement)) button.focus();
    card.classList.toggle('expanded', open);
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  }
  function filter(source) {
    chips.forEach(function(chip){
      var selected = chip.dataset.filter === source;
      chip.classList.toggle('active', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });
    cards.forEach(function(card){
      var hidden = source !== 'all' && card.dataset.source !== source;
      if (hidden && card.contains(document.activeElement)) chips.find(function(c){ return c.dataset.filter === source; }).focus();
      card.classList.toggle('hidden', hidden);
      card.hidden = hidden;
    });
    var count = cards.filter(function(card){ return !card.hidden; }).length;
    status.textContent = count + (count === 1 ? ' nugget shown.' : ' nuggets shown.');
  }
  function reveal(card) {
    expand(card, true);
    card.classList.add('visible');
    card.querySelector('.nugget-disclosure').focus({ preventScroll: true });
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
    if (!reduced) {
      card.classList.add('flash');
      window.setTimeout(function(){ card.classList.remove('flash'); }, 1500);
    }
  }
  window.nuggetControls = { expand: expand, filter: filter, reveal: reveal };
  cards.forEach(function(card){ expand(card, false); });
  chips.forEach(function(chip){ chip.addEventListener('click', function(){ filter(chip.dataset.filter); }); });
  filter('all');
})();
