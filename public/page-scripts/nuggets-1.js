(function(){
  document.querySelectorAll('.nugget-card').forEach(function(card){
    card.querySelector('.nugget-disclosure').addEventListener('click', function(){
      window.nuggetControls.expand(card, !card.classList.contains('expanded'));
    });
  });
})();
