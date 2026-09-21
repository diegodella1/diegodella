(function () {
  'use strict';
  // The same static release can be previewed without reporting test traffic.
  if (window.location.origin !== 'https://diegodella.ar' || window.gtag) return;
  var measurementId = 'G-TJF4P0NYFT';
  var pagePath = window.location.pathname;
  var pageLocation = window.location.origin + pagePath;
  var referrer = '';
  try {
    var source = new URL(document.referrer);
    referrer = source.origin + source.pathname;
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: pageLocation,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  window.trackContactSuccess = function (mode) {
    if (mode !== 'conversation' && mode !== 'updates') return;
    window.gtag('event', mode === 'conversation' ? 'generate_lead' : 'updates_request_success', {
      contact_mode: mode,
      page_path: pagePath,
      page_location: pageLocation
    });
  };
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);
})();
