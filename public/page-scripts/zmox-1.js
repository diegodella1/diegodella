(function(){
  var modal = document.getElementById('dlb');
  var content = document.getElementById('dlb-svg');
  var caption = document.getElementById('dlb-cap');
  var close = document.getElementById('dlb-close');
  var trigger;
  document.querySelectorAll('figure.diagram').forEach(function(figure){
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'diagram-expand';
    button.textContent = 'Expand diagram';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'dlb');
    button.setAttribute('aria-label', 'Expand diagram: ' + (figure.getAttribute('aria-label') || 'Diagram'));
    button.addEventListener('click', function(){
      var svg = figure.querySelector('svg');
      if (!svg) return;
      trigger = button;
      var clone = svg.cloneNode(true);
      var ids = new Map();
      clone.querySelectorAll('[id]').forEach(function(node){ ids.set(node.id, 'expanded-' + node.id); node.id = ids.get(node.id); });
      clone.querySelectorAll('*').forEach(function(node){
        Array.from(node.attributes).forEach(function(attribute){
          var value = attribute.value;
          ids.forEach(function(newId, oldId){ value = value.replaceAll('url(#' + oldId + ')', 'url(#' + newId + ')'); if (value === '#' + oldId) value = '#' + newId; });
          if (value !== attribute.value) node.setAttribute(attribute.name, value);
        });
      });
      content.replaceChildren(clone);
      caption.textContent = figure.getAttribute('aria-label') || 'Diagram';
      modal.showModal();
      document.body.classList.add('modal-open');
      close.focus();
    });
    figure.appendChild(button);
  });
  close.addEventListener('click', function(){ modal.close(); });
  modal.addEventListener('click', function(event){
    if (event.target !== modal) return;
    var bounds = modal.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close();
  });
  modal.addEventListener('close', function(){
    document.body.classList.remove('modal-open');
    if (trigger) trigger.focus();
  });
})();
