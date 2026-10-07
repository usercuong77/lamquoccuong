// === Runtime Module: Welcome Overlay Gate ===
/* === Welcome Overlay (pre-menu) === */
(function(){
  const overlay = document.getElementById('welcomeOverlay');
  const card = document.getElementById('welcomeCard');
  const startScreen = document.getElementById('startScreen');
  const btn = document.getElementById('welcomeContinueBtn');
  if(!overlay || !card || !startScreen || !btn) return;
  if(window.__WELCOME_OVERLAY_INITED__) return;
  window.__WELCOME_OVERLAY_INITED__ = true;

  // Keep the embed preview one step closer to the game menu.
  const previewParams = new URLSearchParams(window.location.search);
  const isGameDemo = previewParams.get('embed') === '1' || previewParams.get('preview') === '1';
  if(isGameDemo){
    const easyMode = document.querySelector('input[name="modeDifficulty"][value="easy"]');
    if(easyMode) easyMode.checked = true;
    overlay.style.display = 'none';
    return;
  }

  // Show welcome card on top of start menu (no dim background)
  overlay.style.display = 'flex';

  const close = () => {
    overlay.style.display = 'none';
  };

  // Allow closing when clicking outside the card.
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });

  // Also allow explicit close via the continue button.
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    try{ window.BGM && window.BGM.onUserGesture && window.BGM.onUserGesture('menu'); }catch(_e){}
    close();
  }, { passive: false });
})();

