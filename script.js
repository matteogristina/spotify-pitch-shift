// Spotify Pitch Shift 1.0 || matteogristina, foundation by 2025 Github-@rnikko
(() => {
  const base = document.createElement;
  let spotifyPlaybackEls = [];

  let ppCheckbox;
  let ppButton;
  let ppOffPath;
  let ppOnPath;

  let sliderInput;
  let sliderMin;
  let sliderMax;
  let speedResetBtn;

  let settingsBtn;
  let settingsCloseBtn;

  let oldMin;
  let oldMax;
  let minInput;
  let maxInput;
  let resetMinmaxBtn;
  let saveMinmaxBtn;

  let spsMain;
  let spsControls;
  let spsSettings;

  let icon;
  let iconSpan;

  const semitoneToPlaybackRate = (semitones) => 2 ** (semitones / 12);
  const playbackRateToSemitone = (rate) => Math.round(12 * Math.log2(rate));
  const formatSemitone = (value) => `${value > 0 ? '+' : ''}${value}st`;

  const playbackRateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
  Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
    set(value) {
      if (this.parentElement?.className.toLowerCase().includes('canvas')) {
        playbackRateDescriptor.set.call(this, 1);
        return;
      }

      if (value.source !== 'sps') {
        console.info('sps⚠️ prevented unintended playback speed change');
        playbackRateDescriptor.set.call(this, semitoneToPlaybackRate(Number(sliderInput.value)));
      } else {
        playbackRateDescriptor.set.call(this, value.value);
      }
    },
  });

  document.createElement = function (tagName) {
    const element = base.apply(this, arguments);
    if (tagName === 'video' || tagName === 'audio') {
      spotifyPlaybackEls.push(element);
    }
    return element;
  };

  const setValues = () => {
    const val = Number(sliderInput.value);
    const min = minInput.value;
    const max = maxInput.value;
    const pp = ppCheckbox.checked;

    iconSpan.textContent = formatSemitone(val);
    sliderInput.style.backgroundSize = `${((val - min) * 100) / (max - min)}% 100%`;

    if (pp) {
      ppButton.classList.add('sps-icon-active');
      ppButton.classList.remove('sps-hover-white');
      ppOffPath.style.display = 'none';
      ppOnPath.style.display = 'block';
    } else {
      ppButton.classList.remove('sps-icon-active');
      ppButton.classList.add('sps-hover-white');
      ppOffPath.style.display = 'block';
      ppOnPath.style.display = 'none';
    }

    localStorage.setItem('sps-semitones', val);
    localStorage.setItem('sps-pp', pp);
    localStorage.setItem('sps-semitones-min', min);
    localStorage.setItem('sps-semitones-max', max);

    spotifyPlaybackEls.forEach((el) => {
      el.playbackRate = { source: 'sps', value: semitoneToPlaybackRate(val) };
      el.preservesPitch = pp;
    });
  };

  let showSettings = false;
  let showMain = false;
  const toggleShowSettings = () => {
    showSettings = !showSettings;
    if (showSettings) {
      spsControls.style.display = 'none';
      spsSettings.style.display = 'block';
    } else {
      spsControls.style.display = 'block';
      spsSettings.style.display = 'none';
    }
  };

  const toggleShowMain = () => {
    showMain = !showMain;
    if (showMain) {
      spsMain.style.display = 'block';
    } else {
      spsMain.style.display = 'none';
    }
    document.querySelector('#sps-icon').classList.toggle('sps-icon-active');
    if (showSettings) {
      toggleShowSettings();
    }
  };

  const resetMinMax = () => {
    minInput.value = -12;
    maxInput.value = 12;
  };

  const saveMinMax = () => {
    const min = minInput.value ? Math.round(Number(minInput.value)) : -12;
    const max = maxInput.value ? Math.round(Number(maxInput.value)) : 12;
    sliderInput.min = min;
    sliderInput.max = max;
    minInput.value = min;
    maxInput.value = max;
    localStorage.setItem('sps-semitones-min', min);
    localStorage.setItem('sps-semitones-max', max);
    sliderMin.textContent = formatSemitone(min);
    sliderMax.textContent = formatSemitone(max);
    setValues();
    toggleShowSettings();
  };

  const cleanStorage = () => {
    const oldSpeed = localStorage.getItem('pb-settings-speed');
    const oldPp = localStorage.getItem('pb-settings-prepitch');
    const speed = oldSpeed ? Number(oldSpeed) / 100 : Number(localStorage.getItem('sps-speed'));

    if (!localStorage.getItem('sps-semitones') && speed) {
      localStorage.setItem('sps-semitones', playbackRateToSemitone(speed));
    }

    if (!localStorage.getItem('sps-semitones-min') && localStorage.getItem('sps-speed-min')) {
      localStorage.setItem('sps-semitones-min', playbackRateToSemitone(Number(localStorage.getItem('sps-speed-min'))));
    }

    if (!localStorage.getItem('sps-semitones-max') && localStorage.getItem('sps-speed-max')) {
      localStorage.setItem('sps-semitones-max', playbackRateToSemitone(Number(localStorage.getItem('sps-speed-max'))));
    }

    if (oldSpeed) {
      localStorage.removeItem('pb-settings-speed');
    }

    if (oldPp) {
      localStorage.setItem('sps-pp', oldPp);
      localStorage.removeItem('pb-settings-prepitch');
    }
  };

  const checkForMainEl = () => {
    const mainEl = document.querySelector('#main');
    if (mainEl === null) {
      throw 'Main container element not found';
    }
  };

  const addHTML = () => {
    const sps = document.querySelector('#sps');
    if (sps) {
      sps.remove();
    }

    spsControls = document.createElement('div');
    spsControls.id = 'sps-controls';
    spsControls.style.display = 'block';
    spsControls.innerHTML = '<div class="sps-common"><span class="sps-header">Semitone Shift</span><div style="flex-grow: 1;"></div><button id="sps-settings-btn" class="sps-text-button">SETTINGS</button></div><div class="sps-common"><span id="sps-speed-min" style="line-height: 32px;">-12st</span><input id="sps-input-slider" name="sps-slider" type="range" min="-12" max="12" step="1" style="margin: 0px 0.75rem; background-size: 50% 100%;"><span id="sps-speed-max" style="line-height: 32px;">+12st</span></div><div class="sps-common"><button id="sps-pp" class="sps-icon-active" style="font-size: 16px; background-color: transparent; display: flex; flex-wrap: nowrap; align-items: center; user-select: none;"><input name="sps-pp" type="checkbox" style="display: none"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.27rem" height="1.125rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 576 512"><path class="pp-off" fill="currentColor" d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128c70.741 0 128 57.249 128 128c0 70.741-57.249 128-128 128c-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128c0 70.74-57.249 128-128 128z" style="display: none" /><path class="pp-on" fill="currentColor" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128c0-70.8 57.3-128 128-128c70.8 0 128 57.3 128 128c0 70.8-57.3 128-128 128z" style="display: none" /></svg><span style="margin-left: 0.5rem; line-height: 1;">Preserve Pitch</span></button><div style="flex-grow: 1;"></div><button id="sps-reset-btn" class="sps-text-button">0st</button></div>';
    
    spsSettings = document.createElement('div');
    spsSettings.id = 'sps-settings';
    spsSettings.style.display = 'none';
    spsSettings.innerHTML = '<div class="sps-common"><span class="sps-header">Settings</span><div style="flex-grow: 1;"></div><button id="sps-settings-close-btn" class="sps-text-button">CLOSE</button></div><div style="display: flex; flex-wrap: wrap; width: 98px;"><label class="sps-common" style="width: 100%">Min:<div style="flex-grow: 1;"></div><input type="number" name="sps-min" min="-48" max="47" step="1"></label><label class="sps-common" style="width: 100%">Max:<div style="flex-grow: 1;"></div><input type="number" name="sps-max" min="-47" max="48" step="1"></label></div><div class="sps-common"><div style="flex-grow: 1;"></div><button id="sps-minmax-reset" class="sps-text-button">RESET</button><button id="sps-minmax-save" class="sps-text-button" style="margin-left: 0.5rem;">SAVE</button></div>';

    spsMain = document.createElement('div');
    spsMain.id = 'sps-main';
    spsMain.style.display = 'none';

    spsMain.appendChild(spsControls);
    spsMain.appendChild(spsSettings);

    const spsIcon = document.createElement('div');
    spsIcon.id = 'sps-icon';
    spsIcon.setAttribute('class', 'sps-hover-white');
    spsIcon.innerHTML = '<svg preserveAspectRatio="xMidYMid meet" width="2rem" height="2rem" viewBox="0 -960 960 960" fill="currentColor" style="padding: 0.375rem;"><path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" fill="currentColor"></path></svg><span id="sps-icon-text" style="margin-top: -0.125rem; font-size: 0.6875rem;">0st</span>';

    const appEl = document.createElement('div');
    appEl.id = 'sps';
    appEl.appendChild(spsMain);
    appEl.appendChild(spsIcon);

    const muteButton = document.querySelector('button[aria-describedby="volume-icon"]');
    const volumeBarContainer = muteButton.parentNode.parentNode;

    volumeBarContainer.insertBefore(
      appEl,
      volumeBarContainer.firstChild,
    );
  };
  const addStyle = () => {
    const style = document.createElement('style');
    style.textContent = '#sps{user-select:none;border-width:0 !important;border-style:solid !important;border-color:#e5e7eb}.sps-common{display:flex;flex-wrap:nowrap;align-items:center;height:32px}.sps-header{color:#f0f0f0;font-weight:600;line-height:1}#sps-main{border:1px solid #282828;border-right:0;bottom:88px;right:0;position:absolute}#sps-icon{display:flex;flex-wrap:wrap;justify-content:center;width:2rem;height:2rem}#sps-controls{padding:.5rem .75rem;background-color:#171717;width:320px}#sps-settings{width:240px;padding:.5rem .75rem;background-color:#171717}#sps-settings input{margin-left:.5rem;width:56px;border-radius:.125rem;padding-left:.125rem;padding-right:.125rem;text-align:center;font-size:.875rem}.sps-text-button:hover{background-color:#9B9B9B;cursor:pointer}#sps button:hover{cursor:pointer}#sps button,#sps input{border-width:0 !important;border-style:solid !important;border-color:#e5e7eb}#sps button:disabled{cursor:not-allowed}#sps input[type=number]::-webkit-outer-spin-button,#sps input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}#sps input[type=number]:focus{outline:0}#sps input[type=range]{-webkit-appearance:none;width:100%;height:6px;background:#494949;border-radius:.375rem;background-image:linear-gradient(#fff,#fff);background-size:70% 100%;background-repeat:no-repeat}#sps input[type=range]:hover{background-image:linear-gradient(#2edb64,#2edb64)}#sps input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}#sps input[type=range]::-webkit-slider-runnable-track{width:calc(100% + 16px);height:6px;padding:8px 0;background:transparent}#sps input[type=range]:hover::-webkit-slider-runnable-track{cursor:ew-resize}#sps input[type=range]:hover::-webkit-slider-thumb{display:block;cursor:ew-resize}#sps input[type=range]::-webkit-slider-thumb{display:none;-webkit-appearance:none;border-radius:50%;height:14px;width:14px;background:white;box-shadow:0 4px 6px -1px rgb(0 0 0 / .1),0 2px 4px -2px rgb(0 0 0 / .1);margin-top:-7px}.sps-icon-active,.sps-icon-active:hover{color:#2edb64!important}.sps-hover-white:hover{color:#FFF}.sps-text-button{background-color:#535353;color:white;font-weight:600;font-size:.625rem;padding:.125rem .25rem;border-radius:.125rem}';
    document.head.append(style);
  };

  const addJS = () => {
    // set vars
    ppCheckbox = document.querySelector('input[name="sps-pp"]');
    ppButton = document.querySelector('button#sps-pp');
    ppOffPath = document.querySelector('path.pp-off');
    ppOnPath = document.querySelector('path.pp-on');

    sliderInput = document.querySelector('input[name="sps-slider"]');
    sliderMin = document.querySelector('span#sps-speed-min');
    sliderMax = document.querySelector('span#sps-speed-max');
    speedResetBtn = document.querySelector('button#sps-reset-btn');

    settingsBtn = document.querySelector('#sps-settings-btn');
    settingsCloseBtn = document.querySelector('#sps-settings-close-btn');

    minInput = document.querySelector('input[name="sps-min"]');
    maxInput = document.querySelector('input[name="sps-max"]');
    resetMinmaxBtn = document.querySelector('button#sps-minmax-reset');
    saveMinmaxBtn = document.querySelector('button#sps-minmax-save');

    spsMain = document.querySelector('#sps-main');
    spsControls = document.querySelector('#sps-controls');
    spsSettings = document.querySelector('#sps-settings');

    icon = document.querySelector('#sps-icon');
    iconSpan = document.querySelector('#sps-icon-text');

    let lastSemitones = 0;
    let lastPp = true;
    let lastMin = -12;
    let lastMax = 12;

    // init from storage
    lastPp = localStorage.getItem('sps-pp') ? JSON.parse(localStorage.getItem('sps-pp')) : lastPp;

    if (localStorage.getItem('sps-semitones')) {
      lastSemitones = Math.round(Number(localStorage.getItem('sps-semitones') ?? lastSemitones));

      const storedMin = localStorage.getItem('sps-semitones-min');
      lastMin = storedMin === null ? lastMin : Math.round(Number(storedMin));

      const storedMax = localStorage.getItem('sps-semitones-max');
      lastMax = storedMax === null ? lastMax : Math.round(Number(storedMax));
    }

    oldMin = lastMin;
    oldMax = lastMax;
    ppCheckbox.checked = lastPp;
    sliderInput.value = lastSemitones;
    sliderInput.min = lastMin;
    sliderInput.max = lastMax;
    minInput.value = lastMin;
    maxInput.value = lastMax;

    sliderMin.textContent = formatSemitone(lastMin);
    sliderMax.textContent = formatSemitone(lastMax);

    // add event listeners
    sliderInput.oninput = setValues;
    ppCheckbox.oninput = setValues;
    minInput.onchange = (e) => {
      let newVal = Math.round(Number(e.target.value));
      if (newVal >= oldMax) {
        newVal = oldMax - 1;
      }
      e.target.value = newVal;
      oldMin = newVal;
    };
    maxInput.onchange = (e) => {
      let newVal = Math.round(Number(e.target.value));
      if (newVal <= oldMin) {
        newVal = oldMin + 1;
      }
      e.target.value = newVal;
      oldMax = newVal;
    };
    resetMinmaxBtn.onclick = resetMinMax;
    saveMinmaxBtn.onclick = saveMinMax;
    speedResetBtn.onclick = () => {
      if (sliderInput.max < 0) {
        sliderInput.max = 0;
        maxInput.value = 0;
        localStorage.setItem('sps-semitones-max', maxInput.value);
        sliderMax.textContent = formatSemitone(Number(maxInput.value));
      }
      if (sliderInput.min > 0) {
        sliderInput.min = 0;
        minInput.value = 0;
        localStorage.setItem('sps-semitones-min', minInput.value);
        sliderMin.textContent = formatSemitone(Number(minInput.value));
      }
      sliderInput.value = 0;
      setValues();
    };
    icon.onclick = toggleShowMain;
    settingsBtn.onclick = toggleShowSettings;
    settingsCloseBtn.onclick = (() => {
      minInput.value = sliderInput.min;
      maxInput.value = sliderInput.max;
      toggleShowSettings();
    });
    ppButton.onclick = () => {
      ppCheckbox.checked = !ppCheckbox.checked;
      setValues();
    };

    setValues();

    // nowPlaying+QueueSidebarFix
    const updateMainRightPadding = () => {
      const nowPlayingElement = document.getElementById('Desktop_PanelContainer_Id');
      const mainElement = document.getElementById('sps-main');
      
      if (!mainElement) return;
      
      if (nowPlayingElement) {
        const width = nowPlayingElement.offsetWidth;
        mainElement.style.right = `${width + 16}px`;
      } else {
        mainElement.style.right = '';
      }
    };

    updateMainRightPadding();
    const observer = new MutationObserver(() => {
      updateMainRightPadding();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  let tries = 0;
  const init = () => {
    cleanStorage();
    addStyle();

    try {
      tries += 1;
      console.log('sps➕');
      checkForMainEl();
      addHTML();
      addJS();
      console.log('sps✅');
    } catch (error) {
      console.log(`sps🔄 ${error}`);
      if (tries <= 20) {
        setTimeout(init, 500);
        return;
      }
      console.log('sps❌');
    }
  };

  init();
})();
