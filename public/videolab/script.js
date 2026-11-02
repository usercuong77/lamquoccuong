// VIDEOLAB PRO — HIGH-CONVERSION ENGINE
// ── 0. GLOBAL CLIPBOARD HELPER WITH VISUAL FEEDBACK & FALLBACK ──
window.copyToClipboard = function(text, btnElement) {
  if (!text) return;
  
  function triggerFeedback() {
    if (!btnElement) return;
    const originalText = btnElement.textContent;
    btnElement.textContent = '✓ Đã chép!';
    btnElement.classList.add('copied');
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.classList.remove('copied');
    }, 2000);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(triggerFeedback)
      .catch(() => fallbackCopy(text, triggerFeedback));
  } else {
    fallbackCopy(text, triggerFeedback);
  }
};

function fallbackCopy(text, callback) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'absolute';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    if (callback) callback();
  } catch (err) {
    console.warn('Copy command fallback failed:', err);
  }
  document.body.removeChild(ta);
}

function initCaptionsApp() {
  // ── 1. MOBILE NAVIGATION ──
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (nav?.classList.contains('open') && !nav.contains(event.target) && !menuButton?.contains(event.target)) {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });

  // Keep the fixed purchase bar out of the opening viewport so it never
  // covers the primary hero action. Reveal it once the visitor scrolls.
  const stickyPurchaseBar = document.querySelector('.mobile-sticky-bar');
  const primaryHeroCta = document.querySelector('.hero-actions .button');
  if (stickyPurchaseBar && primaryHeroCta && 'IntersectionObserver' in window) {
    const stickyObserver = new IntersectionObserver(([entry]) => {
      stickyPurchaseBar.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0.1 });
    stickyObserver.observe(primaryHeroCta);
  }

  // ── 2. SCROLL REVEAL OBSERVER ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.why-own-section, .token-section, .workflow-section, .roi-section, .timeline-features-section, .presets-section, .pricing-section, .faq-section, .final-cta').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // ── 3. LIVE COUNTDOWN TIMER (TARGET: ĐẾN HẾT THÁNG 11 / ROLLING FALLBACK) ──
  function initCountdown() {
    const now = Date.now();
    const currentYear = new Date().getFullYear();
    const novDeadline = new Date(currentYear, 10, 30, 23, 59, 59).getTime(); // 30/11 23:59:59
    const storageKey = 'vlp_urgency_deadline_nov';
    let targetTime = null;

    if (now < novDeadline) {
      targetTime = novDeadline;
    } else {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) targetTime = parseInt(stored, 10);
      } catch (e) {
        // Storage unavailable or disabled in browser
      }

      // Fallback rolling urgency window if past November
      if (!targetTime || targetTime <= now) {
        targetTime = now + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (25 * 60 * 1000);
        try { localStorage.setItem(storageKey, String(targetTime)); } catch (e) {}
      }
    }

    function updateTimers() {
      const currentTime = Date.now();
      let diff = targetTime - currentTime;

      if (diff <= 0) {
        if (currentTime < novDeadline) {
          targetTime = novDeadline;
          diff = targetTime - currentTime;
        } else {
          targetTime = currentTime + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
          try { localStorage.setItem(storageKey, String(targetTime)); } catch (e) {}
          diff = targetTime - currentTime;
        }
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, '0');

      // Top mini countdown
      const topDays = document.getElementById('countdown-days');
      const topHours = document.getElementById('countdown-hours');
      const topMins = document.getElementById('countdown-mins');
      if (topDays) topDays.textContent = pad(days);
      if (topHours) topHours.textContent = pad(hours);
      if (topMins) topMins.textContent = pad(minutes);

      // Large bottom countdown
      const cdDays = document.getElementById('cd-days');
      const cdHours = document.getElementById('cd-hours');
      const cdMins = document.getElementById('cd-mins');
      const cdSecs = document.getElementById('cd-secs');
      if (cdDays) cdDays.textContent = pad(days);
      if (cdHours) cdHours.textContent = pad(hours);
      if (cdMins) cdMins.textContent = pad(minutes);
      if (cdSecs) cdSecs.textContent = pad(seconds);
    }

    updateTimers();
    setInterval(updateTimers, 1000);
  }
  initCountdown();

  // ── 3.1. DYNAMIC INDEPENDENT RANDOM SCARCITY ENGINE (LITE VS PRO) ──
  function initRandomScarcity() {
    // 1. Random ĐỘC LẬP cho bản LITE (34 - 38 suất)
    let liteActivated = 36;
    try {
      const storedLite = sessionStorage.getItem('vll_scarcity_activated');
      if (storedLite) {
        liteActivated = parseInt(storedLite, 10);
      } else {
        // Random từ 34 đến 38 suất (còn 12 đến 16 suất)
        liteActivated = Math.floor(Math.random() * 5) + 34;
        sessionStorage.setItem('vll_scarcity_activated', String(liteActivated));
      }
    } catch (e) {
      liteActivated = Math.floor(Math.random() * 5) + 34;
    }

    // 2. Random ĐỘC LẬP cho bản PRO - Best Seller (41 - 45 suất)
    let proActivated = 43;
    try {
      const storedPro = sessionStorage.getItem('vlp_scarcity_activated');
      if (storedPro) {
        proActivated = parseInt(storedPro, 10);
      } else {
        // Random từ 41 đến 45 suất (còn 5 đến 9 suất cực kỳ cấp bách)
        proActivated = Math.floor(Math.random() * 5) + 41;
        sessionStorage.setItem('vlp_scarcity_activated', String(proActivated));
      }
    } catch (e) {
      proActivated = Math.floor(Math.random() * 5) + 41;
    }

    // Đảm bảo tuyệt đối 2 số không bao giờ trùng nhau
    if (proActivated <= liteActivated) {
      proActivated = liteActivated + 5;
    }

    const liteRemaining = 50 - liteActivated;
    const litePercent = Math.round((liteActivated / 50) * 100);

    const proRemaining = 50 - proActivated;
    const proPercent = Math.round((proActivated / 50) * 100);

    // 1. Cập nhật Top Announcement Bar
    const topScarcity = document.getElementById('top-scarcity-text');
    if (topScarcity) {
      topScarcity.innerHTML = `Tiến độ: Lite còn <b>${liteRemaining}</b> suất • Pro chỉ còn <b>${proRemaining}</b> suất cuối!`;
    }

    // 2. Cập nhật Thẻ LABPRO LITE (379K)
    const liteFill = document.getElementById('lite-counter-fill');
    const liteAct = document.getElementById('lite-activated-count');
    const liteUrg = document.getElementById('lite-urgent-count');
    if (liteFill) liteFill.style.width = litePercent + '%';
    if (liteAct) liteAct.innerHTML = `Đã kích hoạt: <strong>${liteActivated} / 50 suất</strong>`;
    if (liteUrg) liteUrg.innerHTML = `Chỉ còn ${liteRemaining} suất cuối 379K!`;

    // 3. Cập nhật Thẻ VIDEOLAB PRO (589K)
    const proFill = document.getElementById('pro-counter-fill');
    const proAct = document.getElementById('pro-activated-count');
    const proUrg = document.getElementById('pro-urgent-count');
    if (proFill) proFill.style.width = proPercent + '%';
    if (proAct) proAct.innerHTML = `Đã kích hoạt: <strong>${proActivated} / 50 suất</strong>`;
    if (proUrg) proUrg.innerHTML = `Chỉ còn ${proRemaining} suất cuối 589K!`;
  }
  initRandomScarcity();


  // Helper: Split text into kinetic word spans with individual tokens
  function renderWordSpans(container, text, isKaraoke = false) {
    if (!container) return [];
    container.innerHTML = '';
    const words = text.trim().split(/\s+/);
    const wordEls = [];
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = `k-word ${isKaraoke ? 'inactive-word' : ''}`;
      span.style.setProperty('--w-i', i);
      span.textContent = w;
      container.appendChild(span);
      if (i < words.length - 1) {
        container.appendChild(document.createTextNode(' '));
      }
      wordEls.push(span);
    });
    return wordEls;
  }

  // ── 4. HERO VIDEO ENGINE (AI CAPTION.mp4 DEMO) ──
  const heroVideo = document.getElementById('hero-main-video');
  const heroUnmuteBtn = document.getElementById('hero-unmute-btn');

  if (heroVideo) {
    const updateHeroSoundBtn = () => {
      if (!heroUnmuteBtn) return;
      const isMuted = heroVideo.muted || heroVideo.volume === 0;
      const soundIcon = heroUnmuteBtn.querySelector('.sound-icon');
      const soundLabel = heroUnmuteBtn.querySelector('.sound-label');
      if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔊';
      if (soundLabel) soundLabel.textContent = isMuted ? 'Bật Tiếng (SFX)' : 'Tắt Tiếng';
      heroUnmuteBtn.classList.toggle('sound-active', !isMuted);
    };

    heroUnmuteBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      heroVideo.muted = !heroVideo.muted;
      if (!heroVideo.muted) {
        heroVideo.volume = 1.0;
        heroVideo.play().catch(() => {});
      }
      updateHeroSoundBtn();
    });

    heroVideo.addEventListener('volumechange', updateHeroSoundBtn);

    // Initial safe autoplay handling
    const startHeroPlayback = () => {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          heroVideo.muted = true;
          heroVideo.play().catch(() => {});
          updateHeroSoundBtn();
        });
      }
    };
    startHeroPlayback();

    // Pause when hero is out of view to preserve resources
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            heroVideo.pause();
          } else {
            heroVideo.play().catch(() => {});
          }
        });
      }, { threshold: 0.2 });
      heroObserver.observe(heroVideo);
    }
  }

  // ── 5. PRODUCT SHOWCASE DUAL VIDEO SWITCHER (SECTION 06) ──
  const videoSwitcherTabs = document.querySelectorAll('.video-switcher-tab');
  const videoPanes = document.querySelectorAll('.video-showcase-pane');
  const showcaseVideos = document.querySelectorAll('.showcase-video-el');
  const showcaseUnmuteBtns = document.querySelectorAll('.showcase-unmute-btn');

  function updateShowcaseSoundBtn(btn, vid) {
    if (!btn || !vid) return;
    const isMuted = vid.muted || vid.volume === 0;
    const icon = btn.querySelector('.unmute-icon');
    const text = btn.querySelector('.unmute-text');
    if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
    if (text) text.textContent = isMuted ? 'Bật Tiếng (SFX & Hướng Dẫn)' : 'Tắt Tiếng';
    btn.classList.toggle('sound-active', !isMuted);
  }

  showcaseUnmuteBtns.forEach((btn) => {
    const videoId = btn.getAttribute('data-video');
    const vid = document.getElementById(videoId);
    if (!vid) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      vid.muted = !vid.muted;
      if (!vid.muted) {
        vid.volume = 1.0;
        vid.play().catch(() => {});
      }
      updateShowcaseSoundBtn(btn, vid);
    });

    vid.addEventListener('volumechange', () => {
      updateShowcaseSoundBtn(btn, vid);
    });
  });

  function switchShowcaseTab(targetPaneId) {
    videoSwitcherTabs.forEach((tab) => {
      const isTarget = tab.getAttribute('data-target') === targetPaneId;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    videoPanes.forEach((pane) => {
      const isTarget = pane.id === targetPaneId;
      const paneVid = pane.querySelector('.showcase-video-el');

      if (isTarget) {
        pane.style.display = 'flex';
        pane.classList.add('active');
        if (paneVid) {
          paneVid.play().catch(() => {});
        }
      } else {
        pane.style.display = 'none';
        pane.classList.remove('active');
        if (paneVid) {
          paneVid.pause();
        }
      }
    });
  }

  videoSwitcherTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-target');
      if (targetPaneId) {
        switchShowcaseTab(targetPaneId);
      }
    });

    // Keyboard navigation (ArrowLeft / ArrowRight)
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const tabList = Array.from(videoSwitcherTabs);
        const currentIndex = tabList.indexOf(tab);
        const nextIndex = e.key === 'ArrowRight'
          ? (currentIndex + 1) % tabList.length
          : (currentIndex - 1 + tabList.length) % tabList.length;
        const nextTab = tabList[nextIndex];
        nextTab.focus();
        const targetId = nextTab.getAttribute('data-target');
        if (targetId) switchShowcaseTab(targetId);
      }
    });
  });

  // IntersectionObserver for Section 06 videos
  if ('IntersectionObserver' in window) {
    const section06 = document.getElementById('presets');
    if (section06) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            showcaseVideos.forEach((v) => v.pause());
          } else {
            const activePane = document.querySelector('.video-showcase-pane.active');
            const activeVid = activePane?.querySelector('.showcase-video-el');
            if (activeVid) activeVid.play().catch(() => {});
          }
        });
      }, { threshold: 0.15 });
      sectionObserver.observe(section06);
    }
  }

  
  // ── 4.1. SIDE-BY-SIDE VIDEO COMPARISON (LITE VS PRO) ──
  const compareLiteVid = document.getElementById('video-compare-lite');
  const compareProVid = document.getElementById('video-compare-pro');
  const vcUnmuteBtns = document.querySelectorAll('.vc-unmute-btn');

  // Pause the other comparison video when one starts playing
  compareLiteVid?.addEventListener('play', () => {
    if (compareProVid && !compareProVid.paused) compareProVid.pause();
  });
  compareProVid?.addEventListener('play', () => {
    if (compareLiteVid && !compareLiteVid.paused) compareLiteVid.pause();
  });

  // Sound toggle button for comparison videos
  vcUnmuteBtns.forEach((btn) => {
    const targetId = btn.getAttribute('data-video');
    const targetVid = document.getElementById(targetId);
    if (!targetVid) return;

    btn.addEventListener('click', () => {
      targetVid.muted = !targetVid.muted;
      const isMuted = targetVid.muted || targetVid.volume === 0;
      const icon = btn.querySelector('.vc-sound-icon');
      const text = btn.querySelector('.vc-sound-text');
      if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
      if (text) text.textContent = isMuted ? 'Bật Tiếng SFX' : 'Đang Bật Tiếng';
      btn.classList.toggle('active-sound', !isMuted);
    });

    targetVid.addEventListener('volumechange', () => {
      const isMuted = targetVid.muted || targetVid.volume === 0;
      const icon = btn.querySelector('.vc-sound-icon');
      const text = btn.querySelector('.vc-sound-text');
      if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
      if (text) text.textContent = isMuted ? 'Bật Tiếng SFX' : 'Đang Bật Tiếng';
      btn.classList.toggle('active-sound', !isMuted);
    });
  });

// ── 6. CHECKOUT MODAL & VIETQR HANDLER ──
  const modalOverlay = document.getElementById('checkout-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const buyTriggerBtns = document.querySelectorAll('.buy-trigger-btn');
  const confirmOrderBtn = document.getElementById('confirm-order-btn');
  const orderForm = document.getElementById('order-form');
  const vietqrBox = document.getElementById('vietqr-box');
  const backToFormBtn = document.getElementById('back-to-form-btn');
  const orderMemo = document.getElementById('order-memo');
  const dynamicQr = document.getElementById('dynamic-qr');
  const qrCustomerInfo = document.getElementById('qr-customer-info');
  const qrAmountDisplay = document.getElementById('qr-amount-display');

  // Package Selector Elements
  const pkgRadioInputs = document.querySelectorAll('input[name="package-tier"]');
  const pkgLabelPro = document.getElementById('pkg-label-pro');
  const pkgLabelLite = document.getElementById('pkg-label-lite');
  const modalHeadingTitle = document.getElementById('modal-heading-title');
  const modalHeadingDesc = document.getElementById('modal-heading-desc');
  const summaryOldPrice = document.getElementById('summary-old-price');
  const summaryDiscountLabel = document.getElementById('summary-discount-label');
  const summaryDiscountNum = document.getElementById('summary-discount-num');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const summaryBonusText = document.getElementById('summary-bonus-text');
  const summaryLadderNote = document.getElementById('summary-ladder-note');

  let currentPackage = 'pro';

  function applyPackageDetails(tier) {
    currentPackage = tier === 'lite' ? 'lite' : 'pro';

    const radioInput = document.querySelector(`input[name="package-tier"][value="${currentPackage}"]`);
    if (radioInput) radioInput.checked = true;

    if (currentPackage === 'lite') {
      pkgLabelPro?.classList.remove('active');
      pkgLabelLite?.classList.add('active');

      if (modalHeadingTitle) modalHeadingTitle.textContent = 'Đơn Đặt Mua LABPRO LITE (50 Suất Đầu)';
      if (modalHeadingDesc) modalHeadingDesc.innerHTML = 'Sở hữu trọn đời <strong>LABPRO LITE</strong> với giá ưu đãi <strong>379.000 VNĐ</strong>';
      if (summaryOldPrice) summaryOldPrice.textContent = '1.890.000đ';
      if (summaryDiscountLabel) summaryDiscountLabel.textContent = 'Ưu đãi 50 suất đầu tiên (Tiết kiệm 69%):';
      if (summaryDiscountNum) summaryDiscountNum.textContent = '- 1.511.000đ';
      if (summaryTotalPrice) summaryTotalPrice.textContent = '379.000 VNĐ';
      if (summaryBonusText) summaryBonusText.textContent = '10 Font + 10 Preset + TẶNG 900MB SFX + Hỗ trợ cài đặt & hướng dẫn';
      if (summaryLadderNote) summaryLadderNote.textContent = '*(Đủ 50 suất giá tăng lên 868.500 VNĐ, đủ 100 suất lên 1.300.000 VNĐ)*';
    } else {
      pkgLabelLite?.classList.remove('active');
      pkgLabelPro?.classList.add('active');

      if (modalHeadingTitle) modalHeadingTitle.textContent = 'Đơn Đặt Mua VIDEOLAB PRO (50 Suất Đầu)';
      if (modalHeadingDesc) modalHeadingDesc.innerHTML = 'Sở hữu trọn đời <strong>VIDEOLAB PRO</strong> với giá ưu đãi <strong>589.000 VNĐ</strong>';
      if (summaryOldPrice) summaryOldPrice.textContent = '2.490.000đ';
      if (summaryDiscountLabel) summaryDiscountLabel.textContent = 'Ưu đãi 50 suất đầu tiên (Tiết kiệm 64%):';
      if (summaryDiscountNum) summaryDiscountNum.textContent = '- 1.901.000đ';
      if (summaryTotalPrice) summaryTotalPrice.textContent = '589.000 VNĐ';
      if (summaryBonusText) summaryBonusText.textContent = '10.000 Font chữ + Kho 2.5GB SFX Hollywood + Cập nhật trọn đời';
      if (summaryLadderNote) summaryLadderNote.textContent = '*(Đủ 50 suất giá sẽ tự động nhảy lên 1.333.500 VNĐ, đủ 100 suất lên 2.000.000 VNĐ)*';
    }
  }

  pkgRadioInputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      applyPackageDetails(e.target.value);
    });
  });

  let qrTimerInterval = null;

  function stopQrTimer() {
    if (qrTimerInterval) {
      clearInterval(qrTimerInterval);
      qrTimerInterval = null;
    }
  }

  // Open modal with preselected package
  buyTriggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pkg = btn.getAttribute('data-package') || 'pro';
      applyPackageDetails(pkg);

      // Return form to edit mode if reopened
      if (vietqrBox) vietqrBox.style.display = 'none';
      if (orderForm) orderForm.style.display = 'block';

      modalOverlay?.classList.add('open');
      modalOverlay?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    modalOverlay?.classList.remove('open');
    modalOverlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stopQrTimer();
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
      closeModal();
    }
  });

  // Confirm Order Form Submission
  confirmOrderBtn?.addEventListener('click', () => {
    const custName = (document.getElementById('cust-name'))?.value.trim() || '';
    const custPhone = (document.getElementById('cust-phone'))?.value.trim() || '';
    const custEmail = (document.getElementById('cust-email'))?.value.trim() || '';
    const osTypeInput = document.querySelector('input[name="os-type"]:checked');
    const osType = osTypeInput ? osTypeInput.value : 'win';
    const osLabel = osType === 'mac' ? 'macOS' : 'Windows';

    if (!custName || !custPhone || !custEmail) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email để nhận License Key!');
      return;
    }

    // Determine Package Details
    const isLite = currentPackage === 'lite';
    const amount = isLite ? 379000 : 589000;
    const amountStr = isLite ? '379.000 VNĐ' : '589.000 VNĐ';
    const prefix = isLite ? 'VLL' : 'VLP';
    const pkgName = isLite ? 'LABPRO LITE' : 'VIDEOLAB PRO';

    // Clean phone number for memo
    const cleanPhone = custPhone.replace(/\D/g, '').slice(-6) || (isLite ? '379K' : '589K');
    const memo = `${prefix} ${cleanPhone}`;

    // Display customer confirmation line
    if (qrCustomerInfo) {
      qrCustomerInfo.textContent = `${custName} • ${pkgName} (${osLabel})`;
    }

    if (qrAmountDisplay) {
      qrAmountDisplay.textContent = amountStr;
    }

    // Update Memo & Dynamic QR code URL
    if (orderMemo) {
      orderMemo.innerHTML = `${memo} <button type="button" class="copy-btn" onclick="copyToClipboard('${memo}', this)">Copy</button>`;
    }

    if (dynamicQr) {
      const qrUrl = `https://api.vietqr.io/image/970423-02653834001-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(memo)}`;
      dynamicQr.src = qrUrl;
    }

    // Switch view
    if (orderForm) orderForm.style.display = 'none';
    if (vietqrBox) vietqrBox.style.display = 'flex';

    // Start 15:00 session timer cleanly without duplicate intervals
    stopQrTimer();
    let timeLeft = 15 * 60;
    const qrTimerEl = document.getElementById('qr-countdown');
    if (qrTimerEl) qrTimerEl.textContent = '15:00';

    qrTimerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        stopQrTimer();
        if (qrTimerEl) qrTimerEl.textContent = 'Hết hạn (Hãy tải lại mã)';
        return;
      }
      timeLeft--;
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      if (qrTimerEl) qrTimerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
  });

  // Back to Form
  backToFormBtn?.addEventListener('click', () => {
    stopQrTimer();
    if (vietqrBox) vietqrBox.style.display = 'none';
    if (orderForm) orderForm.style.display = 'flex';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCaptionsApp);
} else {
  initCaptionsApp();
}
