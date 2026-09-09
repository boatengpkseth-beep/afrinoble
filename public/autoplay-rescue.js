// Forces muted autoplay on every autoplay video (React's muted-SSR quirk).
// Lives in its own file so the site's Content-Security-Policy can stay free
// of 'unsafe-inline' for scripts.
(function () {
  function kick() {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.muted = true;
      v.defaultMuted = true;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
  }
  kick();
  setTimeout(kick, 600);
  setTimeout(kick, 2000);
  document.addEventListener('visibilitychange', kick);
  window.addEventListener('pageshow', kick);
  document.addEventListener(
    'pause',
    function (e) {
      var t = e.target;
      if (t && t.tagName === 'VIDEO' && t.autoplay && !t.ended) {
        t.muted = true;
        var p = t.play();
        if (p && p.catch) p.catch(function () {});
      }
    },
    true
  );
})();
