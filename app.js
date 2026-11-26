/**
 * SHREYA'S 18TH BIRTHDAY - MOBILE-FIRST INTERACTIVE ENGINE
 * Features:
 * - Strict Single-Instance Play/Pause Music Controller (Custom Audio + Built-in Chime Fallback)
 * - Mobile Scroll & Touch Guard (Zero Ghost Clicks / Accidental Taps While Scrolling)
 * - Live Countdown Timer to 27th November + Real-Time Seconds Ticker
 * - 3D Wax Seal Envelope Unwrapping ("18" Wax Seal)
 * - Candle Blowing via Stationary Tap, Horizontal Swipe & Microphone Breath (Candles 1 & 8)
 * - 6-Slot Touch-Optimized Polaroid Swiper Carousel & Local Photo Customizer
 * - Multi-Cannon Confetti & Fireworks FX
 * - Pop-able Secret Wish Balloons & Interactive Heart Shower
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIGURATION & STATE
  // ==========================================================================
  const BIRTH_DATE = new Date(2008, 10, 27, 0, 0, 0); // November 27, 2008
  const UNLOCK_TARGET_DATE = new Date(2026, 10, 27, 0, 0, 0); // November 27, 2026, 12:00:00 AM
  let audioContext = null;
  let isPlaying = false; // Strict single source of truth for music playback
  let isSiteUnlocked = false;
  let isReadyToUnlock = false;
  let lockCountdownInterval = null;
  let synthMusicInterval = null;
  let synthMasterGain = null;
  let activeOscillators = [];

  let micStream = null;
  let micAudioContext = null;
  let micAnalyser = null;
  let micInterval = null;
  let isMicFallbackMode = false;

  let loveCount = 0;
  let currentCarouselIndex = 0;
  let isEnvelopeOpened = false;
  let candlesBlown = false;

  // Mobile Touch & Scroll Guard State
  let gestureStartX = 0;
  let gestureStartY = 0;
  let touchMovedDuringGesture = false;
  let lastDragEndTime = 0;
  let lastScrollTime = 0;
  let lastTouchTime = 0;

  // Secret wish notes for balloons (Personalized for 18th Birthday / Adulthood)
  const BALLOON_NOTES = {
    1: {
      emoji: '🎁',
      title: 'A Gift From The Heart',
      text: 'Shreya, may your 18th year unlock door after door of laughter, grand triumphs, and unforgettable memories. We are all so profoundly proud of the phenomenal young woman you are today!'
    },
    2: {
      emoji: '🌟',
      title: 'Shooting For The Stars',
      text: 'Never doubt the incredible power inside your soul. You have the intellect, empathy, and courage to achieve any dream in adulthood. Reach for the highest galaxy!'
    },
    3: {
      emoji: '👑',
      title: 'The Fabulous 18 Milestone',
      text: 'Eighteen looks absolutely radiant on you! Welcome to official adulthood — keep smiling that infectious, whole-hearted smile that lights up every room you enter. Happy 18th Birthday!'
    },
    4: {
      emoji: '💖',
      title: 'Bright Future Ahead',
      text: 'This milestone 18th chapter is the opening of your greatest adventure yet. May good health, genuine friendships, wisdom, and boundless success accompany you always.'
    }
  };

  // 18th Birthday Riddle Quest & Mystery Gift Box Data
  const RIDDLES_DATA = [
    {
      step: 1,
      badge: 'Riddle #1 • Milestone Clue',
      question: 'I start at 18, bring freedom, new dreams, and make you officially an adult. What am I?',
      options: [
        { key: 'A', text: 'Childhood', isCorrect: false },
        { key: 'B', text: 'Adulthood / 18th Chapter', isCorrect: true },
        { key: 'C', text: 'Homework', isCorrect: false }
      ]
    },
    {
      step: 2,
      badge: 'Riddle #2 • Mystery Clue',
      question: 'The more you take away from me, the bigger I get. What am I?',
      options: [
        { key: 'A', text: 'A Hole', isCorrect: true },
        { key: 'B', text: 'Birthday Cake', isCorrect: false },
        { key: 'C', text: 'A Secret', isCorrect: false }
      ]
    },
    {
      step: 3,
      badge: 'Riddle #3 • The Final Key',
      question: 'What has to be broken before you can use it, just like a birthday surprise?',
      options: [
        { key: 'A', text: 'A Promise', isCorrect: false },
        { key: 'B', text: 'An Egg / Gift Seal', isCorrect: true },
        { key: 'C', text: 'A Mirror', isCorrect: false }
      ]
    }
  ];

  let currentRiddleIndex = 0;
  let isRiddleAnsweringLocked = false;

  // ==========================================================================
  // 2. DOM ELEMENT REFERENCES
  // ==========================================================================
  const preUnlockScreen = document.getElementById('preUnlockScreen');
  const mainDeviceContainer = document.getElementById('mainDeviceContainer');
  const lockCard = document.getElementById('lockCard');
  const lockStatusBadge = document.getElementById('lockStatusBadge');
  const lockDays = document.getElementById('lockDays');
  const lockHours = document.getElementById('lockHours');
  const lockMins = document.getElementById('lockMins');
  const lockSecs = document.getElementById('lockSecs');
  const lockActionBtn = document.getElementById('lockActionBtn');

  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicLabel = document.getElementById('musicLabel');
  const bgMusicAudio = document.getElementById('bgMusicAudio');

  const liveSecondsTicker = document.getElementById('liveSecondsTicker');

  const blowCandlesBtn = document.getElementById('blowCandlesBtn');
  const micBlowToggleBtn = document.getElementById('micBlowToggleBtn');
  const blowStatusHint = document.getElementById('blowStatusHint');
  const cakeContainer = document.getElementById('cakeContainer');
  const candle1 = document.querySelector('.candle-1');
  const candle2 = document.querySelector('.candle-2');

  const polaroidTrack = document.getElementById('polaroidTrack');
  const carouselDots = document.getElementById('carouselDots');
  const carouselCounterPill = document.getElementById('carouselCounterPill');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');

  const balloonCluster = document.getElementById('balloonCluster');
  const sendLoveBtn = document.getElementById('sendLoveBtn');
  const loveCounterBadge = document.getElementById('loveCounterBadge');
  const floatingPartyBtn = document.getElementById('floatingPartyBtn');
  const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const toastNotification = document.getElementById('toastNotification');

  const wishModal = document.getElementById('wishModal');
  const closeWishModalBtn = document.getElementById('closeWishModalBtn');
  const wishModalAckBtn = document.getElementById('wishModalAckBtn');

  const balloonWishModal = document.getElementById('balloonWishModal');
  const closeBalloonModalBtn = document.getElementById('closeBalloonModalBtn');
  const closeBalloonAckBtn = document.getElementById('closeBalloonAckBtn');
  const balloonModalEmoji = document.getElementById('balloonModalEmoji');
  const balloonModalTitle = document.getElementById('balloonModalTitle');
  const balloonModalText = document.getElementById('balloonModalText');

  // Riddle Quest & Mystery Gift Box DOM Elements
  const riddleQuestCard = document.getElementById('riddleQuestCard');
  const riddleActiveContainer = document.getElementById('riddleActiveContainer');
  const riddleStepText = document.getElementById('riddleStepText');
  const riddleProgressBar = document.getElementById('riddleProgressBar');
  const riddleBadge = document.getElementById('riddleBadge');
  const riddleQuestionText = document.getElementById('riddleQuestionText');
  const riddleOptionsGrid = document.getElementById('riddleOptionsGrid');
  const riddleFeedbackNotice = document.getElementById('riddleFeedbackNotice');
  const mysteryGiftContainer = document.getElementById('mysteryGiftContainer');
  const mysteryGiftBoxWrapper = document.getElementById('mysteryGiftBoxWrapper');
  const openGiftBoxBtn = document.getElementById('openGiftBoxBtn');
  const goldenVoucherContainer = document.getElementById('goldenVoucherContainer');
  const revealedGiftWrap = document.getElementById('revealedGiftWrap');
  const revealedGiftImg = document.getElementById('revealedGiftImg');
  const voucherCelebrateBtn = document.getElementById('voucherCelebrateBtn');
  const resetRiddlesBtn = document.getElementById('resetRiddlesBtn');

  // ==========================================================================
  // 3. MOBILE SCROLL & GHOST-CLICK GUARD
  // Prevents accidental button/card clicks when user scrolls or swipes vertically
  // ==========================================================================
  function setupGlobalTouchScrollGuard() {
    document.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches.length) return;
      gestureStartX = e.touches[0].clientX;
      gestureStartY = e.touches[0].clientY;
      touchMovedDuringGesture = false;
      lastTouchTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!e.touches || !e.touches.length) return;
      const dx = e.touches[0].clientX - gestureStartX;
      const dy = e.touches[0].clientY - gestureStartY;
      if (Math.hypot(dx, dy) > 10) {
        touchMovedDuringGesture = true;
      }
      lastTouchTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      lastTouchTime = Date.now();
      if (touchMovedDuringGesture) {
        lastDragEndTime = Date.now();
      }
      touchMovedDuringGesture = false;
    }, { passive: true });

    document.addEventListener('touchcancel', () => {
      touchMovedDuringGesture = false;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      lastScrollTime = Date.now();
    }, { passive: true });

    // Capture-phase click filter: blocks stray ghost clicks after touch drags/scrolls
    document.addEventListener('click', (e) => {
      const now = Date.now();
      const isRecentTouch = (now - lastTouchTime) < 1000;
      const draggedRecently = touchMovedDuringGesture || (now - lastDragEndTime) < 350;
      const scrolledDuringTouch = isRecentTouch && (now - lastScrollTime) < 200;

      if (draggedRecently || scrolledDuringTouch) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  // ==========================================================================
  // 4. UTILITIES & HAPTICS
  // ==========================================================================
  function triggerHaptic(pattern = [20, 40, 20]) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) { /* ignore */ }
    }
  }

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2600);
  }

  // ==========================================================================
  // 5. CONFETTI FX SYSTEM (With CDN & Autonomous Canvas Fallback)
  // ==========================================================================
  function fireConfettiBurst(x = 0.5, y = 0.6, particleCount = 70) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: particleCount,
        spread: 70,
        origin: { x: x, y: y },
        colors: ['#ff4d8d', '#fbbf24', '#c084fc', '#38bdf8', '#ffffff'],
        disableForReducedMotion: true
      });
    } else {
      spawnMiniFallingParticles(particleCount);
    }
  }

  function fireCelebrationFireworks() {
    if (typeof confetti === 'function') {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 120 };

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 } }));
      }, 250);
    } else {
      spawnMiniFallingParticles(90);
    }
  }

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnMiniFallingParticles(count = 50) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'flying-heart';
      const symbols = ['✨', '🎉', '💖', '⭐', '🌸'];
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = `${Math.random() * 90 + 5}vw`;
      particle.style.bottom = `${Math.random() * 40 + 20}vh`;
      particle.style.fontSize = `${Math.random() * 18 + 14}px`;
      particle.style.animationDuration = `${Math.random() * 1.5 + 1.2}s`;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 2600);
    }
  }

  // ==========================================================================
  // 6. STRICT SINGLE-INSTANCE AUDIO & MUSIC BOX CONTROLLER
  // Ensures zero overlapping/parallel playback when toggling Play/Pause
  // ==========================================================================
  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }

  function playOneShotTone(freq, startTime, duration = 0.45, type = 'sine') {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.22, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) { /* ignore */ }
  }

  function playSynthNote(freq, startTime, duration = 0.45, type = 'sine') {
    const ctx = getAudioContext();
    if (!ctx || !synthMasterGain || !isPlaying) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(synthMasterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);

      activeOscillators.push(osc);
      osc.onended = () => {
        activeOscillators = activeOscillators.filter(node => node !== osc);
      };
    } catch (e) { /* ignore */ }
  }

  function playSparkleSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      playOneShotTone(freq, now + idx * 0.08, 0.4, 'triangle');
    });
  }

  function startMusicBoxSynth() {
    stopMusicBoxSynth();
    if (!isPlaying) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    synthMasterGain = ctx.createGain();
    synthMasterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    synthMasterGain.connect(ctx.destination);

    const NOTE = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33
    };

    const melody = [
      { n: NOTE.G4, d: 0.3 }, { n: NOTE.G4, d: 0.3 }, { n: NOTE.A4, d: 0.6 }, { n: NOTE.G4, d: 0.6 }, { n: NOTE.C5, d: 0.6 }, { n: NOTE.B4, d: 1.0 },
      { n: NOTE.G4, d: 0.3 }, { n: NOTE.G4, d: 0.3 }, { n: NOTE.A4, d: 0.6 }, { n: NOTE.G4, d: 0.6 }, { n: NOTE.D5, d: 0.6 }, { n: NOTE.C5, d: 1.0 },
      { n: NOTE.G4, d: 0.3 }, { n: NOTE.G4, d: 0.3 }, { n: NOTE.G4 * 2, d: 0.6 }, { n: NOTE.E4 * 2, d: 0.6 }, { n: NOTE.C5, d: 0.6 }, { n: NOTE.B4, d: 0.6 }, { n: NOTE.A4, d: 0.8 },
      { n: NOTE.F4 * 2, d: 0.3 }, { n: NOTE.F4 * 2, d: 0.3 }, { n: NOTE.E4 * 2, d: 0.6 }, { n: NOTE.C5, d: 0.6 }, { n: NOTE.D5, d: 0.6 }, { n: NOTE.C5, d: 1.2 }
    ];

    function scheduleTune() {
      if (!isPlaying) return 0;
      const now = ctx.currentTime;
      let offset = 0.15;
      melody.forEach(item => {
        playSynthNote(item.n, now + offset, item.d, 'triangle');
        playSynthNote(item.n * 2, now + offset, item.d * 0.4, 'sine');
        offset += item.d + 0.12;
      });
      return offset * 1000;
    }

    const loopTime = scheduleTune();
    synthMusicInterval = setInterval(() => {
      if (isPlaying) {
        scheduleTune();
      } else {
        stopMusicBoxSynth();
      }
    }, loopTime + 800);
  }

  function stopMusicBoxSynth() {
    if (synthMusicInterval) {
      clearInterval(synthMusicInterval);
      synthMusicInterval = null;
    }
    // Immediately silence and stop all scheduled oscillators so zero notes linger
    activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) { /* ignore */ }
    });
    activeOscillators = [];

    if (synthMasterGain) {
      try {
        synthMasterGain.disconnect();
      } catch (e) { /* ignore */ }
      synthMasterGain = null;
    }
  }

  function setAudioPlayingState(playing) {
    isPlaying = playing;
    if (!musicToggleBtn) return;
    if (playing) {
      musicToggleBtn.classList.add('is-playing');
      if (musicIcon) musicIcon.textContent = '⏸️';
      if (musicLabel) musicLabel.textContent = 'Pause Music';
    } else {
      musicToggleBtn.classList.remove('is-playing');
      if (musicIcon) musicIcon.textContent = '🎵';
      if (musicLabel) musicLabel.textContent = 'Play Music';
    }
  }

  const DEFAULT_AUDIO_PATH = 'happy_bday.mpeg';

  function startMusic() {
    if (isPlaying) return; // Guard against duplicate starts
    setAudioPlayingState(true);
    stopMusicBoxSynth();

    if (bgMusicAudio) {
      const currentSrc = (bgMusicAudio.getAttribute('src') || '').trim();
      if (currentSrc === '') {
        bgMusicAudio.src = DEFAULT_AUDIO_PATH;
      }

      const playPromise = bgMusicAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // If user paused before the play() promise resolved, immediately pause
          if (!isPlaying) {
            bgMusicAudio.pause();
          }
        }).catch((err) => {
          console.warn('[Birthday Audio] Could not play "happy_bday.mpeg":', err);
          if (!isPlaying) return;

          if (err && err.name === 'NotAllowedError') {
            // Browser autoplay policy blocked playback without direct user gesture
            setAudioPlayingState(false);
            showToast('Tap "Play Music" to start the birthday song! 🎵');
          } else {
            // Codec unsupported or file unreachable -> graceful synth fallback
            startMusicBoxSynth();
          }
        });
      }
    } else {
      startMusicBoxSynth();
    }
  }

  function stopMusic() {
    setAudioPlayingState(false);
    if (bgMusicAudio) {
      bgMusicAudio.pause();
    }
    stopMusicBoxSynth();
  }

  function toggleMusic(e) {
    if (e) e.stopPropagation();
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  // ==========================================================================
  // 7. ENVELOPE UNWRAPPING INTERACTION
  // ==========================================================================
  function unwrapEnvelope(e) {
    if (e) e.stopPropagation();
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;
    triggerHaptic([30, 50, 40]);
    playSparkleSound();

    if (envelopeWrapper) {
      envelopeWrapper.classList.add('is-opened');
    }

    if (typeof confetti === 'function') {
      confetti({ particleCount: 60, spread: 60, origin: { x: 0.3, y: 0.55 } });
      confetti({ particleCount: 60, spread: 60, origin: { x: 0.7, y: 0.55 } });
    }

    if (!isPlaying) {
      startMusic();
    }
  }

  // ==========================================================================
  // 8. REAL-TIME MILESTONE TICKER & ANIMATED COUNTERS
  // ==========================================================================
  function updateLiveSeconds() {
    if (!liveSecondsTicker) return;
    const now = new Date();
    const diffMs = now.getTime() - BIRTH_DATE.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    liveSecondsTicker.textContent = totalSeconds.toLocaleString() + '+';
  }

  function animateCounters() {
    const counterElements = document.querySelectorAll('.stat-counter');
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const duration = 1800;
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeOut * target);
        el.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(updateNumber);
    });
  }

  function setupStatsObserver() {
    const statsSection = document.getElementById('statsSection');
    if (!statsSection) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateCounters();
          fireConfettiBurst(0.5, 0.7, 45);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(statsSection);
  }

  // ==========================================================================
  // 9. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWING
  // ==========================================================================
  function blowOutCandles() {
    if (candlesBlown) return;
    candlesBlown = true;
    triggerHaptic([40, 80, 50, 100]);

    if (candle1) candle1.classList.add('is-blown');
    if (candle2) candle2.classList.add('is-blown');

    const ctx = getAudioContext();
    if (ctx) {
      const now = ctx.currentTime;
      playOneShotTone(180, now, 0.4, 'triangle');
      playOneShotTone(523.25, now + 0.3, 0.5, 'sine');
      playOneShotTone(659.25, now + 0.45, 0.5, 'sine');
      playOneShotTone(783.99, now + 0.6, 0.7, 'sine');
      playOneShotTone(1046.5, now + 0.75, 1.0, 'sine');
    }

    if (blowCandlesBtn) {
      blowCandlesBtn.innerHTML = '<span>✨ Wish Made! ✨</span>';
      blowCandlesBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }

    if (blowStatusHint) {
      blowStatusHint.innerHTML = '🎉 <strong>Flames blown out!</strong> Your 18th birthday wish is on its way to the stars!';
    }

    stopMicListening();
    if (micBlowToggleBtn) {
      micBlowToggleBtn.style.display = 'none';
    }
    fireCelebrationFireworks();
    setTimeout(() => {
      openModal(wishModal);
    }, 700);
  }

  function setupCandleTouchGestures() {
    if (!cakeContainer) return;
    let swipeStartX = 0;
    let swipeStartY = 0;

    cakeContainer.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches.length) return;
      swipeStartX = e.touches[0].clientX;
      swipeStartY = e.touches[0].clientY;
    }, { passive: true });

    cakeContainer.addEventListener('touchend', (e) => {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const dx = e.changedTouches[0].clientX - swipeStartX;
      const dy = e.changedTouches[0].clientY - swipeStartY;
      // Only extinguish on an intentional horizontal swipe across the candles, never on vertical scrolling
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        blowOutCandles();
      }
    }, { passive: true });

    if (candle1) candle1.addEventListener('click', blowOutCandles);
    if (candle2) candle2.addEventListener('click', blowOutCandles);
  }

  function logMicSecurityWarning(reason) {
    console.warn(
      `[Birthday Cake Mic] ${reason}\n` +
      'Note: Mobile browsers require a secure context (HTTPS or http://localhost) for navigator.mediaDevices.getUserMedia().\n' +
      'When previewing over a local network IP (e.g., http://192.168.x.x), mic access is blocked by browser security policy.\n' +
      'To test mic blowing on mobile, serve over HTTPS (e.g., ngrok, local-ssl-proxy, or deploy to HTTPS) or use http://localhost on desktop.\n' +
      'Fallback active: Tap "Blow / Tap to Extinguish" or swipe horizontally across the flames!'
    );
  }

  function enableMicFallbackMode(toastMessage, hintMessage) {
    isMicFallbackMode = true;
    stopMicListening(true);

    if (micBlowToggleBtn) {
      micBlowToggleBtn.classList.remove('active');
      micBlowToggleBtn.innerHTML = '<span>💨 Mic unavailable — Tap here to blow!</span>';
    }
    if (blowStatusHint && !candlesBlown && hintMessage) {
      blowStatusHint.innerHTML = hintMessage;
    }
    if (toastMessage) {
      showToast(toastMessage);
    }
  }

  function toggleMicListening() {
    if (candlesBlown) return;

    if (isMicFallbackMode) {
      blowOutCandles();
      return;
    }

    if (micStream) {
      stopMicListening();
    } else {
      startMicListening();
    }
  }

  async function startMicListening() {
    if (candlesBlown) return;

    try {
      // Check for insecure HTTP origin (e.g., local network IP on mobile) or missing mediaDevices API
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '[::1]';
      if (!window.isSecureContext && !isLocalhost) {
        logMicSecurityWarning('Insecure HTTP context detected (' + location.origin + ').');
        enableMicFallbackMode(
          'Mic requires HTTPS or localhost — tap to blow candles! 💨',
          '🔒 <strong>Mic blocked on HTTP IP:</strong> Use HTTPS/localhost for mic, or simply tap <strong>"Blow / Tap to Extinguish"</strong>!'
        );
        return;
      }

      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        logMicSecurityWarning('navigator.mediaDevices.getUserMedia is unavailable in this browser/context.');
        enableMicFallbackMode(
          'Mic unavailable here — tap to blow candles instead! 💨',
          '✨ <strong>Mic not supported in this browser/origin:</strong> Tap <strong>"Blow / Tap to Extinguish"</strong> or swipe the flames!'
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('Web Audio API AudioContext is not supported.');
      }

      micAudioContext = new AudioCtx();
      if (micAudioContext.state === 'suspended') {
        await micAudioContext.resume();
      }

      const source = micAudioContext.createMediaStreamSource(stream);
      micAnalyser = micAudioContext.createAnalyser();
      micAnalyser.fftSize = 256;
      source.connect(micAnalyser);

      if (micBlowToggleBtn) {
        micBlowToggleBtn.classList.add('active');
        micBlowToggleBtn.innerHTML = '<span>🎙️ Listening... Blow now! (Tap to stop)</span>';
      }
      showToast('Blow into your microphone! 💨');

      const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);
      micInterval = setInterval(() => {
        if (!micAnalyser) return;
        micAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        if (average > 55) {
          blowOutCandles();
        }
      }, 100);
    } catch (err) {
      logMicSecurityWarning(`Microphone access failed (${err && err.name ? err.name : 'Error'}: ${err && err.message ? err.message : err}).`);
      enableMicFallbackMode(
        'Mic unavailable or denied — tap to blow candles instead! 💨',
        '✨ <strong>Mic unavailable:</strong> Tap <strong>"Blow / Tap to Extinguish"</strong> or swipe horizontally across the candles!'
      );
    }
  }

  function stopMicListening(keepFallbackLabel = false) {
    if (micInterval) {
      clearInterval(micInterval);
      micInterval = null;
    }
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      micStream = null;
    }
    if (micAudioContext) {
      try { micAudioContext.close(); } catch (e) { /* ignore */ }
      micAudioContext = null;
    }
    micAnalyser = null;
    if (micBlowToggleBtn && !keepFallbackLabel) {
      micBlowToggleBtn.classList.remove('active');
      micBlowToggleBtn.innerHTML = '<span>🎙️ Use Mic to Blow (or tap above if mic is blocked)</span>';
    }
  }

  // ==========================================================================
  // 10. 10-SLOT 9:16 POLAROID TOUCH CAROUSEL & SMART BLUR BACKDROP
  // ==========================================================================
  function applyImageToFrame(img, srcUrl) {
    if (!img) return;
    const frame = img.closest('.polaroid-img-frame');
    const blurBg = frame ? frame.querySelector('.photo-blur-bg') : null;

    if (srcUrl && srcUrl.trim() !== '') {
      img.classList.add('has-image');
      if (frame) frame.classList.add('has-loaded-photo');
      if (blurBg) {
        blurBg.style.backgroundImage = `url("${srcUrl}")`;
        blurBg.classList.add('is-active');
      }
    } else {
      img.classList.remove('has-image');
      if (frame) frame.classList.remove('has-loaded-photo');
      if (blurBg) {
        blurBg.style.backgroundImage = '';
        blurBg.classList.remove('is-active');
      }
    }
  }

  function syncPhotoPlaceholderStates() {
    const imgElements = document.querySelectorAll('.polaroid-img');
    imgElements.forEach(img => {
      const srcAttr = (img.getAttribute('src') || '').trim();
      if (srcAttr === '') {
        applyImageToFrame(img, '');
        return;
      }

      const handleError = () => {
        // Automatic fallback if a local file like photo10.jpg is actually saved as photo10.png
        if (!img.dataset.pngFallbackTried && /\.jpe?g$/i.test(srcAttr)) {
          img.dataset.pngFallbackTried = '1';
          const pngFallback = srcAttr.replace(/\.jpe?g$/i, '.png');
          img.addEventListener('load', () => applyImageToFrame(img, img.currentSrc || pngFallback), { once: true });
          img.addEventListener('error', () => applyImageToFrame(img, ''), { once: true });
          img.src = pngFallback;
        } else {
          applyImageToFrame(img, '');
        }
      };

      if (img.complete) {
        if (img.naturalWidth > 0) {
          applyImageToFrame(img, img.currentSrc || srcAttr);
        } else {
          handleError();
        }
      } else {
        img.addEventListener('load', () => applyImageToFrame(img, img.currentSrc || srcAttr), { once: true });
        img.addEventListener('error', handleError, { once: true });
      }
    });
  }

  function updateCarousel(index) {
    const cards = document.querySelectorAll('.polaroid-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    if (!cards.length) return;

    if (index < 0) index = 0;
    if (index >= cards.length) index = cards.length - 1;
    currentCarouselIndex = index;

    if (polaroidTrack) {
      polaroidTrack.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
    }

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentCarouselIndex);
    });

    if (carouselCounterPill) {
      carouselCounterPill.textContent = `Photo ${currentCarouselIndex + 1} / ${cards.length}`;
    }
  }

  function setupCarouselGestures() {
    syncPhotoPlaceholderStates();

    if (!polaroidTrack) return;
    let touchStartX = 0;
    let touchStartY = 0;

    polaroidTrack.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches.length) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    polaroidTrack.addEventListener('touchend', (e) => {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      // Only slide on horizontal dominant swipes so vertical scrolling stays smooth
      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
        if (diffX > 0) {
          updateCarousel(currentCarouselIndex + 1);
        } else {
          updateCarousel(currentCarouselIndex - 1);
        }
      }
    }, { passive: true });

    if (carouselPrevBtn) {
      carouselPrevBtn.addEventListener('click', () => updateCarousel(currentCarouselIndex - 1));
    }
    if (carouselNextBtn) {
      carouselNextBtn.addEventListener('click', () => updateCarousel(currentCarouselIndex + 1));
    }

    if (carouselDots) {
      carouselDots.addEventListener('click', (e) => {
        const targetDot = e.target.closest('.dot');
        if (targetDot) {
          const idx = parseInt(targetDot.getAttribute('data-index'), 10);
          updateCarousel(idx);
        }
      });
    }
  }

  // ==========================================================================
  // 11. BALLOON POPPING & ACCORDION NOTES
  // ==========================================================================
  function setupBalloonInteractions() {
    if (!balloonCluster) return;

    balloonCluster.addEventListener('click', (e) => {
      const balloon = e.target.closest('.balloon');
      if (!balloon || balloon.classList.contains('is-popped')) return;

      const wishId = balloon.getAttribute('data-wish-id');
      const note = BALLOON_NOTES[wishId];
      if (!note) return;

      // Mark permanently popped so it pops and plays sound only once
      balloon.classList.add('is-popped');
      balloon.setAttribute('aria-disabled', 'true');

      const emojiEl = balloon.querySelector('.balloon-emoji');
      const titleEl = balloon.querySelector('.balloon-title');
      if (emojiEl) emojiEl.textContent = '💥';
      if (titleEl) titleEl.textContent = 'Popped!';

      triggerHaptic([30, 40]);
      playSparkleSound();
      fireConfettiBurst(0.5, 0.5, 40);

      if (balloonModalEmoji) balloonModalEmoji.textContent = note.emoji;
      if (balloonModalTitle) balloonModalTitle.textContent = note.title;
      if (balloonModalText) balloonModalText.textContent = note.text;
      openModal(balloonWishModal);
    });
  }

  function setupAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        header.setAttribute('aria-expanded', !isExpanded);
        item.classList.toggle('is-open', !isExpanded);
        triggerHaptic([15]);
      });
    });
  }

  // ==========================================================================
  // 12. HEART SHOWER SPAWNER & SHARE ACTIONS
  // ==========================================================================
  function spawnFloatingHeart() {
    loveCount++;
    if (loveCounterBadge) {
      loveCounterBadge.textContent = loveCount;
    }
    triggerHaptic([15, 20]);

    const heart = document.createElement('div');
    heart.className = 'flying-heart';
    const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '👑', '⭐'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const rect = sendLoveBtn ? sendLoveBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight - 150, width: 60 };
    const randomOffset = (Math.random() - 0.5) * 160;
    const startX = rect.left + rect.width / 2 + randomOffset;
    const startY = rect.top;

    heart.style.left = `${Math.max(20, Math.min(window.innerWidth - 40, startX))}px`;
    heart.style.top = `${startY}px`;
    heart.style.fontSize = `${Math.random() * 16 + 22}px`;
    heart.style.animationDuration = `${Math.random() * 0.8 + 1.8}s`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2400);

    if (loveCount % 18 === 0) {
      fireCelebrationFireworks();
      showToast(`💖 ${loveCount}x Love Showered for Shreya's 18th Birthday!`);
    }
  }

  function setupShareActions() {
    const shareText = "Celebrating Shreya Tiwari's 18th Birthday! Tap to unwrap memories, blow virtual candles, and shower love:";
    const shareUrl = window.location.href;

    if (shareWhatsAppBtn) {
      shareWhatsAppBtn.addEventListener('click', () => {
        const whatsappMsg = `${encodeURIComponent(shareText)}%0A${encodeURIComponent(shareUrl)}`;
        window.open(`https://api.whatsapp.com/send?text=${whatsappMsg}`, '_blank');
      });
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('Link copied to clipboard! 📋');
          }).catch(() => {
            fallbackCopy(shareUrl);
          });
        } else {
          fallbackCopy(shareUrl);
        }
      });
    }

    function fallbackCopy(text) {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Link copied to clipboard! 📋');
    }
  }

  // ==========================================================================
  // 13. AMBIENT BACKGROUND STARRY CANVAS ANIMATION
  // ==========================================================================
  function setupAmbientStars() {
    const canvas = document.getElementById('ambientStarsCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const stars = [];
    const STAR_COUNT = 60;
    const colors = ['#f472b6', '#c084fc', '#fbbf24', '#38bdf8', '#ffffff'];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }

    function animateStars() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y -= s.speed;
        if (s.y < 0) s.y = height;

        s.alpha += Math.sin(Date.now() * s.twinkleSpeed) * 0.01;
        s.alpha = Math.max(0.15, Math.min(0.9, s.alpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateStars);
    }
    requestAnimationFrame(animateStars);
  }

  // ==========================================================================
  // 14. MODAL CONTROLS
  // ==========================================================================
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  function setupModals() {
    if (closeWishModalBtn) closeWishModalBtn.addEventListener('click', () => closeModal(wishModal));
    if (wishModalAckBtn) wishModalAckBtn.addEventListener('click', () => closeModal(wishModal));
    if (wishModal) {
      wishModal.addEventListener('click', (e) => {
        if (e.target === wishModal) closeModal(wishModal);
      });
    }

    if (closeBalloonModalBtn) closeBalloonModalBtn.addEventListener('click', () => closeModal(balloonWishModal));
    if (closeBalloonAckBtn) closeBalloonAckBtn.addEventListener('click', () => closeModal(balloonWishModal));
    if (balloonWishModal) {
      balloonWishModal.addEventListener('click', (e) => {
        if (e.target === balloonWishModal) closeModal(balloonWishModal);
      });
    }
  }

  // ==========================================================================
  // 15. PRE-UNLOCK COUNTDOWN LOCK SCREEN
  // ==========================================================================
  function setCountdownDigit(el, value) {
    if (!el) return;
    const formatted = String(value).padStart(2, '0');
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      el.classList.remove('tick-pop');
      void el.offsetWidth;
      el.classList.add('tick-pop');
    }
  }

  function activateUnlockReadyState(playCelebration = true) {
    if (isReadyToUnlock) return;
    isReadyToUnlock = true;

    if (lockCountdownInterval) {
      clearInterval(lockCountdownInterval);
      lockCountdownInterval = null;
    }

    setCountdownDigit(lockDays, 0);
    setCountdownDigit(lockHours, 0);
    setCountdownDigit(lockMins, 0);
    setCountdownDigit(lockSecs, 0);

    if (lockStatusBadge) {
      lockStatusBadge.classList.add('is-ready');
      lockStatusBadge.innerHTML = '<span class="lock-badge-icon">✨</span><span>It\'s Time! Happy 18th Birthday!</span>';
    }

    if (lockActionBtn) {
      lockActionBtn.classList.remove('is-waiting');
      lockActionBtn.classList.add('is-ready');
      lockActionBtn.textContent = '🎁 Tap to Unwrap Your Surprise!';
    }

    if (playCelebration) {
      playSparkleSound();
      fireConfettiBurst(0.5, 0.45, 70);
    }
  }

  function updateLockCountdown() {
    if (isSiteUnlocked || isReadyToUnlock) return;
    const diffMs = UNLOCK_TARGET_DATE.getTime() - Date.now();

    if (diffMs <= 0) {
      activateUnlockReadyState(true);
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    setCountdownDigit(lockDays, days);
    setCountdownDigit(lockHours, hours);
    setCountdownDigit(lockMins, mins);
    setCountdownDigit(lockSecs, secs);
  }

  function unlockMainWebsite({ startAudio = true, isPreview = false } = {}) {
    if (isSiteUnlocked) return;
    isSiteUnlocked = true;

    if (lockCountdownInterval) {
      clearInterval(lockCountdownInterval);
      lockCountdownInterval = null;
    }

    triggerHaptic([30, 40, 30]);

    if (mainDeviceContainer) {
      mainDeviceContainer.classList.remove('is-locked');
      mainDeviceContainer.classList.add('is-unlocked');
    }

    if (preUnlockScreen) {
      preUnlockScreen.classList.add('is-unlocking');
      setTimeout(() => {
        preUnlockScreen.classList.add('is-dismissed');
      }, 650);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });

    if (startAudio) {
      startMusic();
    }

    setTimeout(() => {
      fireCelebrationFireworks();
    }, 350);

    if (isPreview) {
      showToast('🔑 Preview Mode: Unlocked for testing!');
    } else {
      showToast('🎉 Welcome to Shreya\'s 18th Birthday!');
    }
  }

  function setupLockScreen() {
    if (!preUnlockScreen || !mainDeviceContainer) {
      isSiteUnlocked = true;
      return;
    }

    if (Date.now() >= UNLOCK_TARGET_DATE.getTime()) {
      activateUnlockReadyState(false);
    } else {
      updateLockCountdown();
      lockCountdownInterval = setInterval(updateLockCountdown, 1000);
    }

    if (lockActionBtn) {
      lockActionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isReadyToUnlock) {
          unlockMainWebsite({ startAudio: true, isPreview: false });
          return;
        }

        triggerHaptic([35, 30, 35]);
        if (lockCard) {
          lockCard.classList.remove('is-shaking');
          void lockCard.offsetWidth;
          lockCard.classList.add('is-shaking');
        }
        showToast('🔒 Too early! Surprise unlocks on 27th Nov at 12:00 AM!');
      });
    }
  }

  // ==========================================================================
  // 16. 18th BIRTHDAY RIDDLE QUEST & MYSTERY GIFT BOX
  // ==========================================================================
  function renderCurrentRiddle() {
    if (!riddleOptionsGrid || !riddleQuestionText) return;
    const riddle = RIDDLES_DATA[currentRiddleIndex];
    if (!riddle) return;

    if (riddleStepText) {
      riddleStepText.textContent = `Step ${currentRiddleIndex + 1} of ${RIDDLES_DATA.length}`;
    }

    if (riddleProgressBar) {
      const pct = ((currentRiddleIndex + 1) / RIDDLES_DATA.length) * 100;
      riddleProgressBar.style.width = `${pct}%`;
    }

    if (riddleBadge) {
      riddleBadge.textContent = riddle.badge;
    }

    riddleQuestionText.textContent = `"${riddle.question}"`;

    if (riddleFeedbackNotice) {
      riddleFeedbackNotice.textContent = '';
      riddleFeedbackNotice.style.opacity = '0';
    }

    riddleOptionsGrid.innerHTML = '';
    riddle.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'riddle-option-btn';
      btn.type = 'button';
      btn.setAttribute('data-key', opt.key);
      btn.setAttribute('data-index', idx);
      btn.innerHTML = `<span class="riddle-option-key">${opt.key}</span><span class="riddle-option-text">${opt.text}</span>`;
      btn.addEventListener('click', (e) => handleRiddleOptionClick(e, opt, btn));
      riddleOptionsGrid.appendChild(btn);
    });
  }

  function handleRiddleOptionClick(e, option, btn) {
    if (e) e.stopPropagation();
    // Guard against ghost clicks during scrolling / dragging
    if (touchMovedDuringGesture || isRiddleAnsweringLocked) return;

    if (option.isCorrect) {
      isRiddleAnsweringLocked = true;
      btn.classList.add('is-correct');
      triggerHaptic([20, 30]);
      playSparkleSound();
      fireConfettiBurst(0.5, 0.6, 25);

      if (riddleFeedbackNotice) {
        riddleFeedbackNotice.textContent = '✨ Correct! Spot on, birthday girl! 🎉';
        riddleFeedbackNotice.style.opacity = '1';
      }

      setTimeout(() => {
        if (currentRiddleIndex < RIDDLES_DATA.length - 1) {
          currentRiddleIndex++;
          isRiddleAnsweringLocked = false;
          renderCurrentRiddle();
        } else {
          isRiddleAnsweringLocked = false;
          revealMysteryGiftBox();
        }
      }, 700);
    } else {
      btn.classList.add('is-wrong');
      triggerHaptic([35, 40]);

      if (riddleQuestCard) {
        riddleQuestCard.classList.remove('is-shaking');
        void riddleQuestCard.offsetWidth;
        riddleQuestCard.classList.add('is-shaking');
      }

      const wrongMsg = 'Oops! Try again birthday girl 😉';
      if (riddleFeedbackNotice) {
        riddleFeedbackNotice.textContent = wrongMsg;
        riddleFeedbackNotice.style.opacity = '1';
      }
      showToast(wrongMsg);

      setTimeout(() => {
        btn.classList.remove('is-wrong');
      }, 600);
    }
  }

  function revealMysteryGiftBox() {
    if (riddleActiveContainer) riddleActiveContainer.style.display = 'none';
    if (mysteryGiftContainer) {
      mysteryGiftContainer.style.display = 'flex';
    }

    fireCelebrationFireworks();
    playSparkleSound();
    triggerHaptic([30, 50, 40]);
    showToast('🎁 All 3 Riddles Solved! Mystery Gift Unlocked!');
  }

  function openMysteryGiftBox() {
    if (mysteryGiftContainer) mysteryGiftContainer.style.display = 'none';
    if (goldenVoucherContainer) {
      goldenVoucherContainer.style.display = 'block';
    }

    // Keep gift photo hidden initially until user clicks "Claim My Surprise"
    if (revealedGiftWrap) {
      revealedGiftWrap.style.display = 'none';
    }

    fireCelebrationFireworks();
    fireConfettiBurst(0.5, 0.45, 80);
    playSparkleSound();
    triggerHaptic([40, 80, 50, 100]);
    showToast('✨ Secret Birthday Gift Voucher Unlocked! ✨');
  }

  function revealGiftPhoto() {
    if (revealedGiftWrap) {
      revealedGiftWrap.style.display = 'flex';
      setTimeout(() => {
        try {
          revealedGiftWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (e) { /* ignore */ }
      }, 100);
    }

    if (voucherCelebrateBtn) {
      voucherCelebrateBtn.innerHTML = '<span>🎁 Gift Unveiled! 🎉</span>';
      voucherCelebrateBtn.classList.add('is-unveiled');
    }

    fireCelebrationFireworks();
    fireConfettiBurst(0.5, 0.5, 75);
    playSparkleSound();
    triggerHaptic([35, 50, 40]);
    showToast('🎁 Happy 18th Birthday Shreya! Here is your surprise gift! ✨');
  }

  function resetRiddleQuest() {
    currentRiddleIndex = 0;
    isRiddleAnsweringLocked = false;
    if (revealedGiftWrap) revealedGiftWrap.style.display = 'none';
    if (voucherCelebrateBtn) {
      voucherCelebrateBtn.innerHTML = '<span>🎊 Claim My Surprise!</span>';
      voucherCelebrateBtn.classList.remove('is-unveiled');
    }
    if (goldenVoucherContainer) goldenVoucherContainer.style.display = 'none';
    if (mysteryGiftContainer) mysteryGiftContainer.style.display = 'none';
    if (riddleActiveContainer) riddleActiveContainer.style.display = 'block';
    renderCurrentRiddle();
    showToast('🔄 Riddle Quest Reset - Have fun!');
  }

  function setupRiddleQuest() {
    if (!riddleQuestCard) return;

    renderCurrentRiddle();

    // Auto-fallback for gift image extension (tries .jpeg, .png, .webp if .jpg is not found)
    if (revealedGiftImg) {
      revealedGiftImg.addEventListener('error', () => {
        const src = revealedGiftImg.getAttribute('src') || '';
        if (src.endsWith('.jpg')) {
          revealedGiftImg.src = 'gift.jpeg';
        } else if (src.endsWith('.jpeg')) {
          revealedGiftImg.src = 'gift.png';
        } else if (src.endsWith('.png')) {
          revealedGiftImg.src = 'gift.webp';
        }
      });
    }

    if (mysteryGiftBoxWrapper) {
      mysteryGiftBoxWrapper.addEventListener('click', (e) => {
        if (touchMovedDuringGesture) return;
        e.stopPropagation();
        openMysteryGiftBox();
      });
      mysteryGiftBoxWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openMysteryGiftBox();
        }
      });
    }

    if (openGiftBoxBtn) {
      openGiftBoxBtn.addEventListener('click', (e) => {
        if (touchMovedDuringGesture) return;
        e.stopPropagation();
        openMysteryGiftBox();
      });
    }

    if (voucherCelebrateBtn) {
      voucherCelebrateBtn.addEventListener('click', (e) => {
        if (touchMovedDuringGesture) return;
        e.stopPropagation();
        revealGiftPhoto();
      });
    }

    if (resetRiddlesBtn) {
      resetRiddlesBtn.addEventListener('click', (e) => {
        if (touchMovedDuringGesture) return;
        e.stopPropagation();
        resetRiddleQuest();
      });
    }
  }

  // ==========================================================================
  // 17. INITIALIZATION ENTRYPOINT
  // ==========================================================================
  function init() {
    // Initialize mobile scroll & ghost-click protection first
    setupGlobalTouchScrollGuard();

    // Pre-Unlock Countdown Lock Screen (default entry until Nov 27, 2026 00:00:00)
    setupLockScreen();

    // Envelope trigger strictly on wax seal button (prevents accidental unwrap while scrolling card)
    if (waxSealBtn) waxSealBtn.addEventListener('click', unwrapEnvelope);

    // Music toggle
    if (musicToggleBtn) musicToggleBtn.addEventListener('click', toggleMusic);

    // Cake & Candles
    if (blowCandlesBtn) blowCandlesBtn.addEventListener('click', blowOutCandles);
    if (micBlowToggleBtn) micBlowToggleBtn.addEventListener('click', toggleMicListening);
    setupCandleTouchGestures();

    // Log clear guidance on startup if opened over non-secure HTTP (e.g., local IP on mobile)
    if (!window.isSecureContext || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      logMicSecurityWarning('Non-secure HTTP origin or unavailable mediaDevices detected on load.');
    }

    // Timers & Counters
    updateLiveSeconds();
    setInterval(updateLiveSeconds, 1000);
    setupStatsObserver();

    // 10-slot Photo Carousel
    setupCarouselGestures();

    // Balloons & Accordion
    setupBalloonInteractions();
    setupAccordion();

    // Love Shower
    if (sendLoveBtn) sendLoveBtn.addEventListener('click', spawnFloatingHeart);

    // Floating party confetti button
    if (floatingPartyBtn) {
      floatingPartyBtn.addEventListener('click', () => {
        triggerHaptic([30, 40]);
        fireCelebrationFireworks();
      });
    }

    setupShareActions();
    setupAmbientStars();
    setupModals();
    setupRiddleQuest();

    if (isSiteUnlocked) {
      setTimeout(() => {
        fireConfettiBurst(0.5, 0.4, 40);
      }, 800);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
