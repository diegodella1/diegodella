/* ══════════════════════════════════════════════
   global.js — diegodella.ar shared scripts v2
   ══════════════════════════════════════════════ */

/* Theme is intentionally fixed. Keep the document contract explicit for pages
   opened from disk and for older cached HTML. */
document.documentElement.setAttribute('data-theme', 'dark');

/* Nav toggle (hamburger menu) */
(function(){
  var t = document.getElementById('navToggle'),
      l = document.getElementById('navLinks'),
      nav = document.querySelector('.nav');
  if (!t || !l) return;

  if (nav && !nav.getAttribute('aria-label')) nav.setAttribute('aria-label', 'Primary navigation');
  if (!l.getAttribute('aria-label')) l.setAttribute('aria-label', 'Primary sections');
  t.setAttribute('aria-expanded', 'false');
  if (!t.getAttribute('aria-controls')) t.setAttribute('aria-controls', 'navLinks');

  function closeNav() {
    l.classList.remove('open');
    t.setAttribute('aria-expanded', 'false');
    t.setAttribute('aria-label', 'Open menu');
  }

  function openNav() {
    l.classList.add('open');
    t.setAttribute('aria-expanded', 'true');
    t.setAttribute('aria-label', 'Close menu');
  }

  function toggleNav() {
    if (l.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  }

  t.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
  });

  l.addEventListener('click', function(e){
    if (e.target.closest('.nav-link')) {
      closeNav();
    }
  });

  document.addEventListener('click', function(e){
    if (l.classList.contains('open') && nav && !nav.contains(e.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && l.classList.contains('open')) {
      closeNav();
      t.focus();
    }
  });

  window.addEventListener('resize', function(){
    if (window.innerWidth > 900 && l.classList.contains('open')) {
      closeNav();
    }
  });
})();

/* Shared route context */
(function(){
  var loc = window.location;
  var path = loc.pathname === '/' ? '/index.html' : loc.pathname;

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function route(sectionKey, sectionName, sectionUrl, family, crumbName, pageType) {
    return {
      sectionKey: sectionKey,
      sectionName: sectionName,
      sectionUrl: sectionUrl,
      family: family,
      crumbName: crumbName,
      pageType: pageType || 'page'
    };
  }

  function buildMap() {
    return {
      '/index.html': route('home', 'Home', '/index.html', 'Home', 'Home', 'home'),
      '/archive.html': route('archive', 'Start', '/archive.html', 'Hub', 'Start', 'hub'),
      '/series.html': route('archive', 'Start', '/archive.html', 'Hub', 'Reading Paths', 'hub'),
      '/frameworks.html': route('frameworks', 'Frameworks', '/frameworks.html', 'Hub', 'Frameworks', 'hub'),
      '/concepts.html': route('frameworks', 'Frameworks', '/frameworks.html', 'Hub', 'Concepts', 'hub'),
      '/essays.html': route('essays', 'Essays', '/essays.html', 'Hub', 'Essays', 'hub'),
      '/notes.html': route('archive', 'Start', '/archive.html', 'Hub', 'Notes', 'hub'),
      '/about.html': route('about', 'About', '/about.html', 'About', 'About', 'about'),
      '/404.html': route('home', 'Home', '/index.html', 'Error', 'Not Found', 'error')
    };
  }

  function getPageContext(currentPath) {
    var map = buildMap();
    var current = map[currentPath];
    var frameworkPattern = /^\/(thesis|zmox|occlusion-bias|paper-\d+)\.html$/;
    var essayPattern = /^\/(already-decided|before-you-delegate|origin-gravity|the-empty-room|the-great-contraction|the-last-human-impression|the-last-manual-moment|the-last-scarcity|the-proxy-self|the-rhyme|the-transition-tax|the-trust-collapse|writing-for-the-filter)\.html$/;
    var notePattern = /^\/(nuggets|unfinished-arguments)\.html$/;

    if (!current) {
      if (frameworkPattern.test(currentPath)) {
        current = route('frameworks', 'Frameworks', '/frameworks.html', 'Framework', null, 'framework');
      } else if (essayPattern.test(currentPath)) {
        current = route('essays', 'Essays', '/essays.html', 'Essay', null, 'essay');
      } else if (notePattern.test(currentPath)) {
        current = route('archive', 'Start', '/archive.html', 'Note', 'Notes', 'note');
      }
    }

    if (!current) return null;

    current.path = currentPath;
    current.slug = currentPath.replace(/^\//, '').replace(/\.html$/, '') || 'index';
    current.title = clean((document.querySelector('h1') || {}).textContent || document.title);

    function tailLink(label, title, href, copy) {
      return { label: label, title: title, href: href, copy: copy };
    }

    var customTailLinks = {
      concepts: [
        tailLink('Core model', 'The Continuous Moment of Intent', '/thesis.html', 'Read the main thesis once the vocabulary is clear.'),
        tailLink('Reading path', 'Narrative-First', '/series.html', 'Move from vocabulary into the sequenced builder path.'),
        tailLink('Back to section', 'Frameworks', '/frameworks.html', 'Return to the main frameworks shelf.')
      ],
      'already-decided': [
        tailLink('Core model', 'The Continuous Moment of Intent', '/thesis.html', 'Connect this argument back to pre-search intent formation.'),
        tailLink('Pattern map', 'The Rhyme', '/the-rhyme.html', 'Move into the recurring pattern underneath mediated change.'),
        tailLink('Back to section', 'Essays', '/essays.html', 'Return to the long-form archive.')
      ],
      'the-rhyme': [
        tailLink('Cost map', 'The Transition Tax', '/the-transition-tax.html', 'Continue into the structural costs of the shift.'),
        tailLink('Agency thread', 'Already Decided', '/already-decided.html', 'Read the companion argument about decisions before the visible decision.'),
        tailLink('Scarcity thread', 'The Last Scarcity', '/the-last-scarcity.html', 'Move from pattern to what remains scarce after abundance.')
      ],
      'the-transition-tax': [
        tailLink('AI trust route', 'The Last Human Impression', '/the-last-human-impression.html', 'Continue into the guided route on AI, filters, and trust.'),
        tailLink('Macro thread', 'The Great Contraction', '/the-great-contraction.html', 'Read the broader systems argument beside the cost map.'),
        tailLink('Back to section', 'Essays', '/essays.html', 'Return to standalone long-form entries.')
      ],
      nuggets: [
        tailLink('Vocabulary', 'Concepts', '/concepts.html', 'Use the framework glossary when a compressed idea needs a stable definition.'),
        tailLink('Core model', 'The Continuous Moment of Intent', '/thesis.html', 'Open the main thesis behind many of the fragments.'),
        tailLink('More fragments', 'Unfinished Arguments', '/unfinished-arguments.html', 'Move into active lines of thought that are still under pressure.')
      ],
      'unfinished-arguments': [
        tailLink('Compressed ideas', 'Nuggets', '/nuggets.html', 'Return to the shortest notes and extracted claims.'),
        tailLink('Foundation', 'Before You Delegate', '/before-you-delegate.html', 'Read the sovereignty argument that anchors several fragments.'),
        tailLink('Back to section', 'Notes', '/notes.html', 'Return to the compressed notes shelf.')
      ],
      series: [
        tailLink('Builder sequence', 'Narrative-First', '/paper-01.html', 'Read the full product clarity sequence from the first paper.'),
        tailLink('AI trust sequence', 'The Last Human Impression', '/the-last-human-impression.html', 'Start the guided route on filters, proxy identity, and trust.'),
        tailLink('Orientation', 'Start', '/archive.html', 'Return to the site-wide map.')
      ],
      'paper-01': [
        tailLink('Next paper', 'Message-Market Fit', '/paper-02.html', 'Continue into the market-language fit layer.'),
        tailLink('Practical entry', 'Launching Into Noise', '/paper-05.html', 'Jump to the most practical launch diagnosis in the sequence.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to the guided reading paths.')
      ],
      'paper-02': [
        tailLink('Previous paper', 'Before You Build', '/paper-01.html', 'Step back to Strategic Debt.'),
        tailLink('Next paper', 'The Architecture of Coherence', '/paper-03.html', 'Continue into operating narrative and internal alignment.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'paper-03': [
        tailLink('Previous paper', 'Message-Market Fit', '/paper-02.html', 'Step back to the market-language fit argument.'),
        tailLink('Next paper', 'Narrative Drift', '/paper-04.html', 'Continue into the coherence failure that follows weak operating narrative.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'paper-04': [
        tailLink('Previous paper', 'The Architecture of Coherence', '/paper-03.html', 'Step back to the operating narrative layer.'),
        tailLink('Next paper', 'Launching Into Noise', '/paper-05.html', 'Continue into launch conditions and market legibility.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'paper-05': [
        tailLink('Previous paper', 'Narrative Drift', '/paper-04.html', 'Step back to the drift problem behind failed launches.'),
        tailLink('Next paper', 'Before You Map', '/paper-06.html', 'Continue into mediated journeys and the negotiated moment.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'paper-06': [
        tailLink('Previous paper', 'Launching Into Noise', '/paper-05.html', 'Step back to launch conditions before the customer journey layer.'),
        tailLink('Foundation', 'Before You Delegate', '/before-you-delegate.html', 'Read the sovereignty frame beside mediated journeys.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'the-last-human-impression': [
        tailLink('Next essay', 'The Empty Room', '/the-empty-room.html', 'Continue into changed reception conditions after publishing.'),
        tailLink('Related concept', 'Origin Gravity', '/origin-gravity.html', 'Jump to the pull of trusted origin in agent-mediated environments.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'the-empty-room': [
        tailLink('Previous essay', 'The Last Human Impression', '/the-last-human-impression.html', 'Step back to the threshold essay.'),
        tailLink('Next essay', 'The Proxy Self', '/the-proxy-self.html', 'Continue into delegated identity and synthetic presence.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'the-proxy-self': [
        tailLink('Previous essay', 'The Empty Room', '/the-empty-room.html', 'Step back to reception and absence.'),
        tailLink('Next essay', 'Writing for the Filter', '/writing-for-the-filter.html', 'Continue into writing for mediated discovery.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'writing-for-the-filter': [
        tailLink('Previous essay', 'The Proxy Self', '/the-proxy-self.html', 'Step back to delegated identity.'),
        tailLink('Next essay', 'The Trust Collapse', '/the-trust-collapse.html', 'Continue into what filter-first systems do to trust.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'the-trust-collapse': [
        tailLink('Previous essay', 'Writing for the Filter', '/writing-for-the-filter.html', 'Step back to mediated discovery.'),
        tailLink('Next essay', 'Origin Gravity', '/origin-gravity.html', 'Continue into the pull of trusted origin.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ],
      'origin-gravity': [
        tailLink('Previous essay', 'The Trust Collapse', '/the-trust-collapse.html', 'Step back to the trust failure that makes origin matter.'),
        tailLink('Framework', 'Occlusion Bias', '/occlusion-bias.html', 'Read the visibility model beside this argument.'),
        tailLink('Reading paths', 'Reading Paths', '/series.html', 'Return to reading paths inside Start.')
      ]
    };

    if (current.family === 'Framework') {
      current.tail = {
        title: 'Keep moving through Frameworks',
        copy: 'Use one core model, one glossary pass, and one practical route so the theory stays connected to application.',
        links: customTailLinks[current.slug] || [
          { label: 'Back to section', title: 'Frameworks', href: '/frameworks.html', copy: 'Return to the core models and browse the conceptual spine.' },
          { label: 'Vocabulary', title: 'Concepts', href: '/concepts.html', copy: 'Open the definitions block when you want the shortest path into the vocabulary.' },
          { label: 'Practical route', title: 'Launching Into Noise', href: '/paper-05.html', copy: 'Move from theory into launch diagnosis and message-market fit.' }
        ]
      };
    } else if (current.family === 'Essay') {
      current.tail = {
        title: 'Read the next useful thread',
        copy: 'Stay in Essays, branch into Reading Paths, or take the compressed path before coming back deeper.',
        links: customTailLinks[current.slug] || [
          { label: 'Back to section', title: 'Essays', href: '/essays.html', copy: 'Return to the standalone long-form archive.' },
          { label: 'Reading paths', title: 'Start', href: '/series.html', copy: 'Switch from isolated reading to sequenced editorial paths.' },
          { label: 'Compressed path', title: 'Compressed Path', href: '/notes.html', copy: 'Open shorter entries and sharper fragments before the next long read.' }
        ]
      };
    } else if (current.family === 'Note') {
      current.tail = {
        title: 'Expand from the compressed path',
        copy: 'Use notes as the short route in, then move outward into a full argument or into the conceptual shelf.',
        links: customTailLinks[current.slug] || [
          { label: 'Back to section', title: 'Notes', href: '/notes.html', copy: 'Return to notes inside Start.' },
          { label: 'Full arguments', title: 'Essays', href: '/essays.html', copy: 'Open the longer pieces once a fragment names the question.' },
          { label: 'Core models', title: 'Frameworks', href: '/frameworks.html', copy: 'Go to the theory layer when you want the site’s conceptual center.' }
        ]
      };
    }

    return current;
  }

  window.__diegodellaSiteContext = getPageContext(path);
})();

/* Essay topic filter: shareable, keyboard-native, and progressively enhanced. */
(function(){
  var controls = document.querySelector('.library-filter');
  if (!controls) return;

  var buttons = Array.prototype.slice.call(controls.querySelectorAll('[data-essay-filter]'));
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-topics]'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-essay-group]'));
  var status = controls.querySelector('.library-filter-status');
  var validTopics = buttons.map(function(button){ return button.getAttribute('data-essay-filter'); });

  function applyFilter(topic, updateUrl) {
    if (validTopics.indexOf(topic) === -1) topic = 'all';
    var visible = 0;

    items.forEach(function(item){
      var topics = (item.getAttribute('data-topics') || '').split(/\s+/);
      var show = topic === 'all' || topics.indexOf(topic) !== -1;
      item.hidden = !show;
      if (show) visible += 1;
    });

    groups.forEach(function(group){
      group.hidden = !group.querySelector('[data-topics]:not([hidden])');
    });

    buttons.forEach(function(button){
      button.setAttribute('aria-pressed', button.getAttribute('data-essay-filter') === topic ? 'true' : 'false');
    });

    if (status) status.textContent = visible + (visible === 1 ? ' entry' : ' entries') + ' shown.';

    if (updateUrl && window.history && window.history.replaceState) {
      var url = new URL(window.location.href);
      if (topic === 'all') url.searchParams.delete('topic');
      else url.searchParams.set('topic', topic);
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
    }
  }

  controls.addEventListener('click', function(event){
    var button = event.target.closest('[data-essay-filter]');
    if (!button) return;
    applyFilter(button.getAttribute('data-essay-filter'), true);
  });

  var initial = new URLSearchParams(window.location.search).get('topic') || 'all';
  applyFilter(initial, false);
})();

/* Navigation state + lightweight prefetch */
(function(){
  var loc = window.location;
  var path = loc.pathname === '/' ? '/index.html' : loc.pathname;
  var siteContext = window.__diegodellaSiteContext;
  var prefetched = Object.create(null);
  var supportsPrefetch = (function() {
    var link = document.createElement('link');
    return !!(link.relList && link.relList.supports && link.relList.supports('prefetch'));
  })();
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var slowConnection = !!(navigator.connection && /2g/.test(navigator.connection.effectiveType || ''));

  function sameOriginInternal(href) {
    if (!href || href.charAt(0) === '#') return false;
    try {
      var url = new URL(href, loc.href);
      return url.origin === loc.origin && (url.pathname === '/' || /\.html$/.test(url.pathname));
    } catch (error) {
      return false;
    }
  }

  function markCurrentNav() {
    var links = document.querySelectorAll('.nav-link[href]');
    var activeHref = '/index.html';
    if (siteContext) {
      activeHref = siteContext.sectionUrl || '/index.html';
    }
    links.forEach(function(link){
      var href = link.getAttribute('href');
      if (!href) return;
      try {
        var url = new URL(href, loc.href);
        var candidate = url.pathname === '/' ? '/index.html' : url.pathname;
        var hashMatchesCurrent = !!url.hash && candidate === path && url.hash === loc.hash;
        link.classList.remove('active');
        if ((!url.hash && candidate === activeHref) || hashMatchesCurrent) {
          link.setAttribute('aria-current', 'page');
          link.classList.add('active');
        } else {
          link.removeAttribute('aria-current');
        }
      } catch (error) {}
    });
  }

  function prefetchLink(href) {
    if (!supportsPrefetch || saveData || slowConnection || !sameOriginInternal(href)) return;
    var url = new URL(href, loc.href);
    var key = url.pathname;
    if (prefetched[key] || key === path) return;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = url.pathname;
    document.head.appendChild(link);
    prefetched[key] = true;
  }

  function wirePrefetch() {
    var links = document.querySelectorAll('a[href]');
    links.forEach(function(link){
      var href = link.getAttribute('href');
      if (!sameOriginInternal(href)) return;
      var handler = function() { prefetchLink(href); };
      link.addEventListener('pointerenter', handler, { passive: true, once: true });
      link.addEventListener('focus', handler, { passive: true, once: true });
      link.addEventListener('touchstart', handler, { passive: true, once: true });
    });
  }

  function prefetchPrimaryRoutes() {
    if (!supportsPrefetch || saveData || slowConnection) return;
    var primary = ['/', '/archive.html', '/frameworks.html', '/essays.html', '/about.html', '/notes.html', '/concepts.html', '/series.html'];
    var runner = function() {
      primary.forEach(function(href){ prefetchLink(href); });
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(runner, { timeout: 1800 });
    } else {
      window.setTimeout(runner, 1200);
    }
  }

  markCurrentNav();
  wirePrefetch();
  prefetchPrimaryRoutes();
})();

/* Shared SEO / GEO structured data */
(function(){
  var doc = document;
  var html = doc.documentElement;
  var loc = window.location;
  var canonicalNode = doc.querySelector('link[rel="canonical"]');
  var canonical = canonicalNode ? canonicalNode.href : loc.href;
  var pathname = new URL(canonical, loc.href).pathname;
  var normalizedPath = pathname === '/' ? '/index.html' : pathname;
  var metaRobots = (doc.querySelector('meta[name="robots"]') || {}).content || '';
  var isNoindex = /\bnoindex\b/i.test(metaRobots);
  var titleNode = doc.querySelector('meta[property="og:title"]');
  var descNode = doc.querySelector('meta[name="description"]');
  var pageTitle = titleNode && titleNode.content ? titleNode.content : doc.title;
  var pageDescription = descNode && descNode.content ? descNode.content : '';
  var ogTypeNode = doc.querySelector('meta[property="og:type"]');
  var pageType = ogTypeNode && ogTypeNode.content ? ogTypeNode.content : 'website';
  var pageHeading = doc.querySelector('h1');
  var headline = pageHeading ? pageHeading.textContent.replace(/\s+/g, ' ').trim() : pageTitle;
  var existingScripts = Array.prototype.map.call(
    doc.querySelectorAll('script[type="application/ld+json"]'),
    function(node) { return node.textContent || ''; }
  ).join('\n');

  if (isNoindex) return;

  function hasSchemaType(type) {
    var pattern = new RegExp('"@type"\\s*:\\s*"' + type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"');
    return pattern.test(existingScripts);
  }

  function appendSchema(schema) {
    var script = doc.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    doc.head.appendChild(script);
  }

  function cleanLabel(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function pageLabelFromPath(path) {
    var raw = path.split('/').pop().replace(/\.html$/, '');
    if (raw === 'index') return 'Narrative Mechanics';
    return raw.split('-').map(function(part){
      return part ? part.charAt(0).toUpperCase() + part.slice(1) : '';
    }).join(' ');
  }

  function sectionForPath(path) {
    var map = {
      '/archive.html': { name: 'Start', url: 'https://diegodella.ar/archive.html' },
      '/frameworks.html': { name: 'Frameworks', url: 'https://diegodella.ar/frameworks.html' },
      '/series.html': { name: 'Start', url: 'https://diegodella.ar/archive.html' },
      '/essays.html': { name: 'Essays', url: 'https://diegodella.ar/essays.html' },
      '/notes.html': { name: 'Start', url: 'https://diegodella.ar/archive.html' },
      '/about.html': { name: 'About', url: 'https://diegodella.ar/about.html' },
      '/concepts.html': { name: 'Frameworks', url: 'https://diegodella.ar/frameworks.html' }
    };
    if (map[path]) return map[path];
    if (/^\/(thesis|zmox|occlusion-bias|paper-\d+)\.html$/.test(path)) return map['/frameworks.html'];
    if (/^\/(nuggets|unfinished-arguments)\.html$/.test(path)) return map['/notes.html'];
    if (/^\/(already-decided|before-you-delegate|origin-gravity|the-empty-room|the-great-contraction|the-last-human-impression|the-last-manual-moment|the-last-scarcity|the-proxy-self|the-rhyme|the-transition-tax|the-trust-collapse|writing-for-the-filter)\.html$/.test(path)) {
      return map['/essays.html'];
    }
    return null;
  }

  if (!hasSchemaType('Organization')) {
    appendSchema({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Narrative Mechanics',
      url: 'https://diegodella.ar/',
      logo: 'https://diegodella.ar/og-default.png',
      founder: {
        '@type': 'Person',
        name: "Diego Dell'Agostino",
        url: 'https://diegodella.ar/about.html'
      }
    });
  }

  if (!hasSchemaType('WebSite')) {
    appendSchema({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Narrative Mechanics',
      url: 'https://diegodella.ar/',
      inLanguage: html.lang || 'en',
      publisher: {
        '@type': 'Organization',
        name: 'Narrative Mechanics',
        url: 'https://diegodella.ar/'
      }
    });
  }

  if (!hasSchemaType('WebPage') && !hasSchemaType('CollectionPage') && !hasSchemaType('Article') && !hasSchemaType('DefinedTermSet') && !hasSchemaType('Person')) {
    appendSchema({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: cleanLabel(pageTitle),
      headline: cleanLabel(headline),
      description: pageDescription,
      url: canonical,
      inLanguage: html.lang || 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Narrative Mechanics',
        url: 'https://diegodella.ar/'
      },
      about: pageType === 'article' ? ['Narrative strategy', 'AI', 'attention economics'] : undefined
    });
  }

  if (!hasSchemaType('BreadcrumbList') && normalizedPath !== '/index.html') {
    var items = [{
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://diegodella.ar/'
    }];
    var section = sectionForPath(normalizedPath);
    var currentName = cleanLabel(headline || pageLabelFromPath(normalizedPath));

    if (section && section.url !== canonical) {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: section.name,
        item: section.url
      });
    }

    items.push({
      '@type': 'ListItem',
      position: items.length + 1,
      name: currentName,
      item: canonical
    });

    appendSchema({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    });
  }
})();

/* Shared shell normalization */
(function(){
  var context = window.__diegodellaSiteContext;
  var doc = document;
  var body = doc.body;
  var nav = doc.querySelector('.nav');
  var main = doc.querySelector('main');
  var footer = doc.querySelector('footer');

  if (!context || !body) return;

  body.classList.add('site-shell');
  body.classList.add('page-family-' + context.family.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  body.classList.add('page-' + context.pageType.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

  function create(tag, className, text) {
    var el = doc.createElement(tag);
    if (className) el.className = className;
    if (typeof text === 'string') el.textContent = text;
    return el;
  }

  function normalizePrimaryNav() {
    if (!nav) return;
    var brand = nav.querySelector('.nav-brand');
    if (brand) {
      brand.textContent = 'NARRATIVE MECHANICS';
      brand.setAttribute('aria-label', 'Narrative Mechanics — Home');
    }
    var navLinks = doc.getElementById('navLinks');
    if (!navLinks) return;
    nav.setAttribute('aria-label', 'Primary navigation');
    navLinks.setAttribute('aria-label', 'Primary sections');
    navLinks.innerHTML =
      '<a href="thesis.html" class="nav-link">Idea</a>' +
      '<a href="frameworks.html" class="nav-link">Frameworks</a>' +
      '<a href="essays.html" class="nav-link">Essays</a>' +
      '<a href="about.html#work" class="nav-link" data-open-contact data-contact-mode="conversation">Work</a>' +
      '<a href="about.html" class="nav-link">About</a>';

    var navRight = nav.querySelector('.nav-right');
    if (navRight) navRight.remove();
  }

  function ensureFooter() {
    if (footer) return;
    footer = create('footer', '');
    var pageWrap = doc.querySelector('.page-wrap');
    if (pageWrap) {
      pageWrap.appendChild(footer);
    } else if (main && main.parentNode) {
      main.parentNode.insertBefore(footer, main.nextSibling);
    } else {
      body.appendChild(footer);
    }
  }

  function injectBreadcrumb() {
    if (!nav || context.path === '/index.html' || doc.querySelector('.site-breadcrumb-wrap')) return;
    var wrap = create('div', 'site-breadcrumb-wrap');
    var breadcrumb = create('nav', 'site-breadcrumb');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');

    var home = create('a', '', 'Home');
    home.href = 'index.html';
    breadcrumb.appendChild(home);

    if (context.sectionUrl && context.sectionUrl !== '/index.html') {
      breadcrumb.appendChild(create('span', 'site-breadcrumb-sep', '/'));
      if (context.sectionUrl === context.path) {
        breadcrumb.appendChild(create('span', 'site-breadcrumb-current', context.sectionName));
      } else {
        var section = create('a', '', context.sectionName);
        section.href = context.sectionUrl.replace(/^\//, '');
        breadcrumb.appendChild(section);
        breadcrumb.appendChild(create('span', 'site-breadcrumb-sep', '/'));
        breadcrumb.appendChild(create('span', 'site-breadcrumb-current', context.crumbName || context.title));
      }
    }

    wrap.appendChild(breadcrumb);
    nav.insertAdjacentElement('afterend', wrap);
  }

  function injectReadingMap() {
    if (!main || doc.querySelector('.reading-map')) return;
    var headings = Array.prototype.slice.call(main.querySelectorAll('.section h2, main.content h2'));
    if (headings.length < 6) return;
    var details = create('details', 'reading-map');
    details.open = window.matchMedia('(min-width: 901px)').matches;
    details.appendChild(create('summary', '', 'On this page'));
    var list = create('ol', 'reading-map-list');
    headings.forEach(function(heading, index){
      if (!heading.id) heading.id = 'section-' + (index + 1);
      var item = create('li', '');
      var link = create('a', '', clean(heading.textContent));
      link.href = '#' + heading.id;
      item.appendChild(link);
      list.appendChild(item);
    });
    details.appendChild(list);
    main.insertAdjacentElement('afterbegin', details);
  }

  function injectTailNav() {
    if (!main || !footer || !context.tail || doc.querySelector('.site-tail-nav')) return;
    if (doc.querySelector('.series-nav, .series-preview')) return;
    if (context.family === 'Essay' && doc.querySelector('.paper-nav')) return;
    var compact = /^(Framework|Essay|Note)$/.test(context.family);
    var section = create('section', 'site-tail-nav' + (compact ? ' site-tail-nav-compact' : ''));
    section.setAttribute('aria-label', 'Continue reading');

    var head = create('div', 'site-tail-head');
    head.appendChild(create('div', 'site-tail-kicker', compact ? 'Continue' : 'Next'));
    if (!compact) {
      var headCopy = create('div', '');
      headCopy.appendChild(create('div', 'site-tail-title', context.tail.title));
      headCopy.appendChild(create('div', 'site-tail-copy', context.tail.copy));
      head.appendChild(headCopy);
    }
    section.appendChild(head);

    var grid = create('div', 'site-tail-grid');
    context.tail.links.forEach(function(link){
      var card = create('a', 'site-tail-card');
      card.href = link.href.replace(/^\//, '');
      card.appendChild(create('div', 'site-tail-card-label', link.label));
      card.appendChild(create('div', 'site-tail-card-title', link.title));
      if (!compact && link.copy) {
        card.appendChild(create('div', 'site-tail-card-copy', link.copy));
      }
      grid.appendChild(card);
    });
    section.appendChild(grid);
    footer.insertAdjacentElement('beforebegin', section);
  }

  function injectMobileSecondaryRoutes() {
    var navLinks = doc.getElementById('navLinks');
    if (!navLinks || navLinks.querySelector('.nav-secondary')) return;

    var secondary = create('div', 'nav-secondary');
    secondary.appendChild(create('div', 'nav-secondary-label', 'More routes'));

    [
      { label: 'Reading Paths', href: 'series.html' },
      { label: 'Notes', href: 'notes.html' },
      { label: 'Concepts', href: 'concepts.html' }
    ].forEach(function(item){
      var link = create('a', 'nav-secondary-link', item.label);
      link.href = item.href;
      secondary.appendChild(link);
    });

    navLinks.appendChild(secondary);
  }

  function normalizeTopBar() {
    var topBar = doc.querySelector('.top-bar');
    if (!topBar) return;

    var copyByFamily = {
      Home: 'The market decides before the search begins',
      Hub: 'Routes into the thesis, frameworks, and essays',
      Framework: 'Models for intent, visibility, trust, and market meaning',
      Essay: 'Long-form arguments on AI, trust, identity, and attention',
      Note: 'Compressed notes and active fragments',
      About: 'Background, advisory focus, and editorial direction',
      Error: 'The page moved or never existed &middot; <a href="archive.html">Start again</a>'
    };

    var familyKey = context.family === 'About' ? 'About' : context.family;
    var secondary = copyByFamily[familyKey] || copyByFamily.Hub;
    topBar.innerHTML =
      '<span>Buenos Aires &middot; Since 2008</span>' +
      '<span>' + secondary + '</span>';
  }

  function normalizeFooter() {
    if (!footer) return;
    footer.removeAttribute('style');
    footer.className = ((footer.className || '').trim() + ' site-footer').trim();
    footer.innerHTML =
      '<div class="site-footer-inner">' +
        '<div class="site-footer-brand">' +
          '<div class="site-footer-mark">D</div>' +
          '<div class="site-footer-copy">' +
            '<div class="site-footer-title">DIEGO</div>' +
            '<p>Essays, frameworks, and notes on product clarity, mediated trust, filtered discovery, and the language that makes strong work legible.</p>' +
          '</div>' +
        '</div>' +
        '<div class="site-footer-nav">' +
          '<div class="site-footer-links site-footer-links-primary">' +
            '<a class="site-footer-link" href="thesis.html">Idea</a>' +
            '<a class="site-footer-link" href="about.html#work" data-open-contact data-contact-mode="conversation">Work</a>' +
            '<a class="site-footer-link" href="about.html">About</a>' +
          '</div>' +
          '<div class="site-footer-links site-footer-links-secondary" aria-label="Explore more">' +
            '<a class="site-footer-link" href="archive.html">Start</a>' +
            '<a class="site-footer-link" href="frameworks.html">Frameworks</a>' +
            '<a class="site-footer-link" href="essays.html">Essays</a>' +
            '<a class="site-footer-link" href="series.html">Reading paths</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  normalizePrimaryNav();
  normalizeTopBar();
  injectBreadcrumb();
  injectReadingMap();
  injectMobileSecondaryRoutes();
  ensureFooter();
  injectTailNav();
  normalizeFooter();
})();

/* WebMCP / modelContext discovery */
(function(){
  function result(text, data) {
    var payload = {
      content: [{ type: 'text', text: text }]
    };
    if (data) payload.structuredContent = data;
    return payload;
  }

  var routes = {
    home: '/',
    archive: '/archive.html',
    frameworks: '/frameworks.html',
    concepts: '/concepts.html',
    series: '/series.html',
    essays: '/essays.html',
    notes: '/notes.html',
    about: '/about.html'
  };

  var tools = [
    {
      name: 'open_narrative_route',
      title: 'Open Narrative Route',
      description: 'Open one of the main Narrative Mechanics routes such as start, frameworks, concepts, reading paths, essays, notes, or about.',
      inputSchema: {
        type: 'object',
        properties: {
          route: {
            type: 'string',
            enum: ['home', 'archive', 'frameworks', 'concepts', 'series', 'essays', 'notes', 'about'],
            description: 'The main site route to open.'
          }
        },
        required: ['route'],
        additionalProperties: false
      },
      annotations: {
        readOnlyHint: true
      },
      execute: async function(input) {
        var route = input && input.route;
        var href = routes[route];
        if (!href) {
          return result('Unknown route.', { ok: false });
        }
        window.location.href = href;
        return result('Opening ' + route + '.', { ok: true, route: route, href: href });
      }
    },
    {
      name: 'open_contact_flow',
      title: 'Open Contact Flow',
      description: 'Open the site contact flow to start a conversation or request updates.',
      inputSchema: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['conversation', 'updates'],
            description: 'Choose conversation to contact Diego directly or updates to request update emails.'
          }
        },
        required: ['mode'],
        additionalProperties: false
      },
      annotations: {
        readOnlyHint: false
      },
      execute: async function(input) {
        var mode = input && input.mode ? input.mode : 'conversation';
        var trigger = document.querySelector('[data-open-contact][data-contact-mode="' + mode + '"]') ||
          document.querySelector('[data-open-contact]');

        if (!trigger) {
          window.location.href = '/about.html';
          return result('No contact trigger on this page. Opening the about page instead.', { ok: true, fallback: '/about.html' });
        }

        trigger.setAttribute('data-contact-mode', mode);
        trigger.click();
        return result('Opened the contact flow.', { ok: true, mode: mode });
      }
    }
  ];

  if (!window.__diegodellaWebMcpTools || !window.__diegodellaWebMcpTools.length) {
    window.__diegodellaWebMcpTools = tools;
  }
  
  function setRegistrationState(methods, reason, activeTools, modelContext) {
    window.__diegodellaWebMcpRegistered = true;
    window.__diegodellaWebMcpRegistrationMethod = methods.join('+');
    window.__diegodellaWebMcpRegistrationReason = reason;
    window.__diegodellaWebMcpRegistrationToolCount = activeTools.length;
    window.__diegodellaWebMcpLastRegistrationAt = Date.now();
    window.__diegodellaWebMcpLastModelContext = modelContext;
  }

  function registerTools(reason, preferredTools) {
    var modelContext = navigator.modelContext;
    var activeTools = preferredTools || window.__diegodellaWebMcpTools || tools;
    var methods = [];
    var needsImperativeRegistration = false;
    if (!modelContext) return false;

    try {
      needsImperativeRegistration =
        typeof modelContext.registerTool === 'function' && (
          window.__diegodellaWebMcpLastModelContext !== modelContext ||
          window.__diegodellaWebMcpRegisteredToolCount !== activeTools.length
        );

      if (needsImperativeRegistration) {
        activeTools.forEach(function(tool){
          modelContext.registerTool(tool);
        });
        window.__diegodellaWebMcpRegisteredToolCount = activeTools.length;
        methods.push('registerTool');
      }

      if (typeof modelContext.provideContext === 'function') {
        modelContext.provideContext({ tools: activeTools });
        methods.push('provideContext');
      }
    } catch (error) {
      console.warn('WebMCP registration failed.', error);
      return false;
    }

    if (!methods.length) return false;
    setRegistrationState(methods, reason || 'unspecified', activeTools, modelContext);
    return true;
  }

  window.__diegodellaWebMcpRegister = function(toolset) {
    return registerTools('manual', toolset || window.__diegodellaWebMcpTools || tools);
  };

  registerTools('script');
  document.addEventListener('DOMContentLoaded', function() {
    registerTools('domcontentloaded');
  }, { once: true });
  window.addEventListener('load', function() {
    registerTools('load');
  }, { once: true });

  var attempts = 0;
  var maxAttempts = 60;
  var retryTimer = window.setInterval(function(){
    attempts += 1;
    if (registerTools('retry-' + attempts) || attempts >= maxAttempts) {
      window.clearInterval(retryTimer);
    }
  }, 500);
})();

/* Progress bar + section tracking */
(function(){
  var pbar = document.getElementById('pbar');
  var pbarLabel = document.getElementById('pbar-label');
  if (!pbar) return;

  function updatePbar() {
    var s = window.scrollY,
        h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? (s / h) * 100 : 0;
    pbar.style.transform = 'scaleX(' + (pct / 100) + ')';
    if (pbarLabel) pbarLabel.style.left = Math.min(pct, 97) + '%';
  }
  window.addEventListener('scroll', updatePbar, { passive: true });
  updatePbar();

  /* Section tracking for label */
  var sections = document.querySelectorAll('.section');
  if (sections.length && pbarLabel) {
    var secObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          var badge = e.target.querySelector('.section-number');
          if (badge) {
            pbarLabel.textContent = badge.textContent.trim();
            pbarLabel.classList.add('show');
          }
        }
      });
    }, { threshold: 0.2 });
    sections.forEach(function(el) { secObs.observe(el); });

    /* Hide label on hero/footer */
    var heroEl = document.querySelector('.hero');
    var footerEl = document.querySelector('footer');
    var hideObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting && pbarLabel) pbarLabel.classList.remove('show');
      });
    }, { threshold: 0.3 });
    if (heroEl) hideObs.observe(heroEl);
    if (footerEl) hideObs.observe(footerEl);
  }
})();

/* Contact modal -> sends direct email through backend/Resend */
(function(){
  var host = document.createElement('div');
  host.innerHTML =
    '<dialog class="contact-modal" id="contactModal" aria-labelledby="contactModalTitle" aria-describedby="contactModalDesc">' +
      '<div class="contact-modal-inner">' +
        '<div class="contact-modal-top"><div><div class="contact-modal-kicker">Direct contact</div><h2 class="contact-modal-title" id="contactModalTitle">Work with Diego</h2></div>' +
        '<button class="contact-modal-close" type="button" data-close-contact aria-label="Close contact dialog">×</button></div>' +
        '<p class="contact-modal-desc" id="contactModalDesc">Share what you are building and where clarity is breaking. Diego will reply directly.</p>' +
        '<form class="contact-modal-form" id="contactModalForm" novalidate>' +
          '<label class="contact-modal-label" for="contactName">Name</label><input class="contact-modal-input" id="contactName" name="name" type="text" autocomplete="name" maxlength="120">' +
          '<label class="contact-modal-label" for="contactSubject">Subject</label><input class="contact-modal-input" id="contactSubject" name="subject" type="text" required maxlength="160" aria-describedby="contactSubjectError"><span class="contact-field-error" id="contactSubjectError"></span>' +
          '<label class="contact-modal-label" for="contactReply">Your email</label><input class="contact-modal-input" id="contactReply" name="reply_email" type="email" inputmode="email" autocomplete="email" required maxlength="254" aria-describedby="contactReplyError"><span class="contact-field-error" id="contactReplyError"></span>' +
          '<label class="contact-modal-label" for="contactBody">Message</label><textarea class="contact-modal-textarea" id="contactBody" name="body" required maxlength="5000" aria-describedby="contactBodyError"></textarea><span class="contact-field-error" id="contactBodyError"></span>' +
          '<div class="contact-modal-actions"><button class="contact-modal-submit" id="contactSubmit" type="submit">Send email</button><button class="contact-modal-secondary" type="button" data-close-contact>Cancel</button><button class="contact-modal-secondary contact-retry" id="contactRetry" type="button" hidden>Retry</button></div>' +
          '<div class="contact-modal-status" id="contactStatus" role="status" aria-live="polite"></div>' +
          '<p class="contact-modal-footnote">Your message goes directly to Diego. Typical response: within two working days. If the form fails, <a href="mailto:dellagostino@gmail.com">send an email</a>.</p>' +
        '</form>' +
      '</div>' +
    '</dialog>';
  while (host.firstChild) document.body.appendChild(host.firstChild);

  var modal = document.getElementById('contactModal');

  var title = document.getElementById('contactModalTitle');
  var desc = document.getElementById('contactModalDesc');
  var name = document.getElementById('contactName');
  var subject = document.getElementById('contactSubject');
  var reply = document.getElementById('contactReply');
  var body = document.getElementById('contactBody');
  var submit = document.getElementById('contactSubmit');
  var status = document.getElementById('contactStatus');
  var retry = document.getElementById('contactRetry');
  var lastTrigger = null;
  var controller = null;

  function setError(field, message) {
    var error = document.getElementById(field.id + 'Error');
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  }

  function validate() {
    setError(subject, subject.value.trim() ? '' : 'Add a subject.');
    setError(reply, !reply.value.trim() ? 'Add your email.' : (reply.validity.typeMismatch ? 'Use a valid email address.' : ''));
    setError(body, body.value.trim() ? '' : 'Add a short message.');
    var invalid = modal.querySelector('[aria-invalid="true"]');
    if (invalid) invalid.focus();
    return !invalid;
  }

  function openModal(mode) {
    var isUpdates = mode === 'updates';
    modal.setAttribute('data-mode', isUpdates ? 'updates' : 'conversation');
    title.textContent = isUpdates ? 'Request Updates' : 'Start a Conversation';
    desc.textContent = isUpdates
      ? 'Leave your details and the site will send Diego a direct email while also adding your address to the low-frequency update list.'
      : 'Add context and the site will send Diego a direct email through Resend.';
    lastTrigger = document.activeElement;
    subject.value = isUpdates ? 'Request updates about new essays' : 'Work with Diego';
    if (!body.value.trim()) body.value = isUpdates
      ? 'Hi Diego,\n\nPlease add me to the low-frequency update list for new essays.\n\nA bit of context:\n'
      : 'Hi Diego,\n\nI am reaching out from ' + document.title + ' (' + window.location.href + ').\n\nWhat I am building:\n\nWhere clarity is breaking:\n';
    submit.textContent = isUpdates ? 'Send Update Request' : 'Send Email';
    status.textContent = '';
    retry.hidden = true;
    if (!modal.open) modal.showModal();
    document.body.classList.add('modal-open');
    window.setTimeout(function(){ name.focus(); }, 20);
  }

  function closeModal() {
    if (modal.open) modal.close();
    if (controller) controller.abort();
    controller = null;
  }

  modal.addEventListener('close', function(){
    document.body.classList.remove('modal-open');
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  });

  document.addEventListener('click', function(e){
    var trigger = e.target.closest('[data-open-contact]');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.getAttribute('data-contact-mode') || 'conversation');
      return;
    }
    if (e.target.closest('[data-close-contact]')) {
      e.preventDefault();
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e){
    if (!modal.open) return;
    if (e.key === 'Escape') closeModal();
  });

  modal.addEventListener('click', function(e){
    if (e.target !== modal) return;
    var rect = modal.getBoundingClientRect();
    var inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) closeModal();
  });

  function submitForm() {
    if (!validate()) return;
    if (!navigator.onLine) {
      status.textContent = 'You appear to be offline. Reconnect and retry, or use the email fallback.';
      retry.hidden = false;
      return;
    }
    status.textContent = 'Sending…';
    submit.disabled = true;
    retry.hidden = true;
    controller = new AbortController();
    var timeout = window.setTimeout(function(){ controller.abort(); }, 12000);
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        mode: modal.getAttribute('data-mode') || 'conversation',
        name: name.value.trim(),
        email: reply.value.trim(),
        subject: subject.value.trim(),
        message: body.value.trim()
      })
    })
      .then(function(res){
        return res.text().then(function(text){
          var data;
          try {
            data = text ? JSON.parse(text) : {};
          } catch (_) {
            data = {
              error: res.ok
                ? 'The server returned an unexpected response.'
                : 'The contact service is not available right now.'
            };
          }
          return { ok: res.ok, status: res.status, data: data };
        });
      })
      .then(function(result){
        if (!result.ok) {
          if (result.status === 429) throw new Error('Too many attempts. Wait a minute and retry.');
          throw new Error(result.data.error || 'The contact service could not send your message.');
        }
        status.textContent = 'Message sent. Diego will reply directly.';
        modal.querySelector('form').reset();
        retry.hidden = true;
      })
      .catch(function(err){
        status.textContent = err.name === 'AbortError' ? 'The request took too long. Retry, or use the email fallback.' : (err.message || 'Could not send the email.');
        retry.hidden = false;
      })
      .finally(function(){
        window.clearTimeout(timeout);
        submit.disabled = false;
        controller = null;
      });
  }

  modal.addEventListener('submit', function(e){
    e.preventDefault();
    submitForm();
  });
  retry.addEventListener('click', submitForm);
})();
