/* ══════════════════════════════════════════════
   global.js — diegodella.ar shared scripts v2
   ══════════════════════════════════════════════ */

/* Nav toggle (hamburger menu) */
(function(){
  var t = document.getElementById('navToggle'),
      l = document.getElementById('navLinks'),
      nav = document.querySelector('.nav');
  if (!t || !l) return;

  t.setAttribute('aria-expanded', 'false');
  if (!t.getAttribute('aria-controls')) t.setAttribute('aria-controls', 'navLinks');

  function closeNav() {
    l.classList.remove('open');
    t.setAttribute('aria-expanded', 'false');
  }

  function openNav() {
    l.classList.add('open');
    t.setAttribute('aria-expanded', 'true');
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

/* Theme toggle (dark/light) */
(function(){
  var b = document.getElementById('themeToggle');
  if (b) b.addEventListener('click', function(){
    var d = document.documentElement,
        c = d.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    d.setAttribute('data-theme', c);
    localStorage.setItem('theme', c);
  });
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
    series: '/series.html',
    essays: '/essays.html',
    notes: '/notes.html',
    about: '/about.html'
  };

  var tools = [
    {
      name: 'open_narrative_route',
      title: 'Open Narrative Route',
      description: 'Open one of the main Narrative Mechanics routes such as archive, frameworks, series, essays, notes, or about.',
      inputSchema: {
        type: 'object',
        properties: {
          route: {
            type: 'string',
            enum: ['home', 'archive', 'frameworks', 'series', 'essays', 'notes', 'about'],
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
    },
    {
      name: 'toggle_site_theme',
      title: 'Toggle Site Theme',
      description: 'Switch the site between light and dark themes.',
      inputSchema: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            enum: ['light', 'dark'],
            description: 'Theme to apply.'
          }
        },
        required: ['theme'],
        additionalProperties: false
      },
      annotations: {
        readOnlyHint: false
      },
      execute: async function(input) {
        var theme = input && input.theme;
        if (theme !== 'light' && theme !== 'dark') {
          return result('Unknown theme.', { ok: false });
        }
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        return result('Applied ' + theme + ' theme.', { ok: true, theme: theme });
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
    pbar.style.width = pct + '%';
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
  var modal = document.getElementById('contactModal');
  var backdrop = document.getElementById('contactModalBackdrop');
  if (!modal || !backdrop) return;

  var title = document.getElementById('contactModalTitle');
  var desc = document.getElementById('contactModalDesc');
  var name = document.getElementById('contactName');
  var subject = document.getElementById('contactSubject');
  var reply = document.getElementById('contactReply');
  var body = document.getElementById('contactBody');
  var submit = document.getElementById('contactSubmit');
  var status = document.getElementById('contactStatus');
  var focusTarget = subject;

  function openModal(mode) {
    var isUpdates = mode === 'updates';
    modal.setAttribute('data-mode', isUpdates ? 'updates' : 'conversation');
    title.textContent = isUpdates ? 'Request Updates' : 'Start a Conversation';
    desc.textContent = isUpdates
      ? 'Leave your details and the site will send Diego a direct email while also adding your address to the low-frequency update list.'
      : 'Add context and the site will send Diego a direct email through Resend.';
    name.value = '';
    reply.value = '';
    subject.value = isUpdates ? 'Request updates about new essays' : 'Work with Diego';
    body.value = isUpdates
      ? 'Hi Diego,\n\nPlease add me to the low-frequency update list for new essays.\n\nA bit of context:\n'
      : 'Hi Diego,\n\nI am reaching out about:\n\nContext:\n\nWhat I am working on:\n';
    submit.textContent = isUpdates ? 'Send Update Request' : 'Send Email';
    status.textContent = '';
    backdrop.classList.add('open');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(function(){ focusTarget.focus(); }, 20);
  }

  function closeModal() {
    backdrop.classList.remove('open');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

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

  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  modal.addEventListener('submit', function(e){
    e.preventDefault();
    if (!navigator.onLine) {
      status.textContent = 'This form needs a connection. The notebook stays offline, but email does not.';
      return;
    }
    status.textContent = 'Sending…';
    submit.disabled = true;
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
          return { ok: res.ok, data: data };
        });
      })
      .then(function(result){
        if (!result.ok) throw new Error(result.data.error || 'Something went wrong.');
        status.textContent = 'Sent.';
        window.setTimeout(closeModal, 500);
      })
      .catch(function(err){
        status.textContent = err.message || 'Could not send the email.';
      })
      .finally(function(){
        submit.disabled = false;
      });
  });
})();
