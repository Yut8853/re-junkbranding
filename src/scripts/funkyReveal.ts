import gsap from 'gsap';

type DissolveCell = {
  row: number;
  col: number;
  normalizedX: number;
};

export const initFunkyReveal = (reduced: boolean): void => {
  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-funky-version]'
  );
  const root = document.querySelector<HTMLElement>('[data-funky-reveal]');
  const stage = document.querySelector<HTMLElement>(
    '[data-funky-reveal-stage]'
  );
  const dissolveGrid = document.querySelector<HTMLElement>(
    '[data-funky-dissolve-grid]'
  );
  const revealImage = document.querySelector<HTMLElement>(
    '[data-funky-reveal-image]'
  );
  if (!trigger || !root || !stage || !dissolveGrid || !revealImage) return;

  const dissolveCellSize = 32;
  const dissolveSpreadLeft = 0.25;
  const dissolveSpreadRight = 0.25;
  const dissolveScatterIntensity = 0.15;
  const dissolveSolidCoreRadius = 0.025;
  const dissolveMinScatterAtCenter = 0.3;
  const dissolveVisibilityThreshold = 0.65;
  const dissolveCoreFillThreshold = 0.18;
  const squareShapeRatio = 0.75;
  const totalTravelRange = 1 + dissolveSpreadLeft + dissolveSpreadRight;
  const funkyDestinationUrl = 'https://funky.junkbranding.com';

  let dissolveColumns = 0;
  let dissolveRows = 0;
  let dissolveCells: DissolveCell[] = [];
  let dissolveCellElements: HTMLDivElement[] = [];
  let cellVisibilityRandom: number[] = [];
  let cellScatterOffset: number[] = [];
  let cellVisibilityState: boolean[] = [];
  let cellCoreState: boolean[] = [];
  let isPlaying = false;

  const hashFromPosition = (row: number, col: number, seed: number) => {
    const raw = Math.sin(row * seed + col * (seed * 2.45)) * 43758.5453;
    return raw - Math.floor(raw);
  };

  const rebuildDissolveGrid = () => {
    dissolveGrid.textContent = '';
    dissolveColumns = Math.ceil(window.innerWidth / dissolveCellSize);
    dissolveRows = Math.ceil(window.innerHeight / dissolveCellSize);
    dissolveCells = [];
    dissolveCellElements = [];
    cellVisibilityState = [];
    cellCoreState = [];
    const gridFragment = document.createDocumentFragment();

    for (let row = 0; row < dissolveRows; row += 1) {
      for (let col = 0; col < dissolveColumns; col += 1) {
        const cell = document.createElement('div');
        cell.className = 'funky-reveal__dissolve-cell';
        if (col / dissolveColumns < squareShapeRatio) {
          cell.classList.add('is-square');
        }
        cell.style.left = `${col * dissolveCellSize}px`;
        cell.style.top = `${row * dissolveCellSize}px`;
        cell.style.width = `${dissolveCellSize}px`;
        cell.style.height = `${dissolveCellSize}px`;
        cell.style.backgroundPosition = `-${col * dissolveCellSize}px -${row * dissolveCellSize}px`;
        gridFragment.appendChild(cell);

        dissolveCellElements.push(cell);
        cellVisibilityState.push(false);
        cellCoreState.push(false);
        dissolveCells.push({
          row,
          col,
          normalizedX: (col + 0.5) / dissolveColumns,
        });
      }
    }

    dissolveGrid.appendChild(gridFragment);

    cellVisibilityRandom = dissolveCells.map(cell =>
      hashFromPosition(cell.row, cell.col, 127.1)
    );
    cellScatterOffset = dissolveCells.map(
      cell =>
        (hashFromPosition(cell.row, cell.col, 269.3) - 0.5) *
        dissolveScatterIntensity
    );
  };

  const setDissolveCellVisible = (index: number, isVisible: boolean) => {
    if (cellVisibilityState[index] === isVisible) return;
    cellVisibilityState[index] = isVisible;
    dissolveCellElements[index].style.visibility = isVisible
      ? 'visible'
      : 'hidden';
  };

  const setDissolveCellCore = (index: number, isCore: boolean) => {
    if (cellCoreState[index] === isCore) return;
    cellCoreState[index] = isCore;
    dissolveCellElements[index].classList.toggle('is-core', isCore);
  };

  const hideAllDissolveCells = () => {
    for (let index = 0; index < dissolveCellElements.length; index += 1) {
      setDissolveCellVisible(index, false);
      setDissolveCellCore(index, false);
    }
  };

  const updateDissolveBand = (bandCenterX: number) => {
    for (let index = 0; index < dissolveCells.length; index += 1) {
      const cell = dissolveCells[index];
      const rawDistance = Math.abs(cell.normalizedX - bandCenterX);
      const scatterStrength = gsap.utils.clamp(
        dissolveMinScatterAtCenter,
        1,
        rawDistance / dissolveSolidCoreRadius
      );
      const scatteredDistance =
        cell.normalizedX -
        bandCenterX +
        cellScatterOffset[index] * scatterStrength;
      const normalizedDistance =
        scatteredDistance >= 0
          ? scatteredDistance / dissolveSpreadRight
          : Math.abs(scatteredDistance) / dissolveSpreadLeft;

      if (normalizedDistance >= 1) {
        setDissolveCellVisible(index, false);
        setDissolveCellCore(index, false);
        continue;
      }

      const density = (1 - normalizedDistance) * (1 - normalizedDistance);
      const isVisible =
        density > cellVisibilityRandom[index] * dissolveVisibilityThreshold;
      setDissolveCellVisible(index, isVisible);
      setDissolveCellCore(
        index,
        isVisible && normalizedDistance < dissolveCoreFillThreshold
      );
    }
  };

  const updateRevealProgress = (progress: number) => {
    const transitionProgress = gsap.utils.clamp(0, 1, progress);
    const bandCenterX =
      1 + dissolveSpreadRight - transitionProgress * totalTravelRange;
    const maskBoundaryX = gsap.utils.clamp(0, 1, bandCenterX);

    revealImage.style.setProperty(
      '--funky-image-mask-left',
      `${maskBoundaryX * 100}%`
    );

    if (transitionProgress <= 0 || transitionProgress >= 1) {
      hideAllDissolveCells();
      return;
    }

    updateDissolveBand(bandCenterX);
  };

  const resetReveal = () => {
    gsap.killTweensOf([root, stage, revealImage]);
    root.classList.add('is-active');
    root.setAttribute('aria-hidden', 'false');
    hideAllDissolveCells();
    gsap.set(root, { autoAlpha: 1 });
    revealImage.style.setProperty('--funky-image-mask-left', '100%');
    gsap.set(revealImage, { autoAlpha: 1 });
    gsap.set(stage, { x: '110vw', y: 0 });
  };

  const completeReveal = () => {
    hideAllDissolveCells();
    root.classList.add('is-active');
    root.setAttribute('aria-hidden', 'false');
    gsap.set(root, { autoAlpha: 1 });
    gsap.set(stage, { x: 0, y: 0 });
    revealImage.style.setProperty('--funky-image-mask-left', '0%');
    gsap.set(revealImage, { autoAlpha: 1 });
    isPlaying = false;
    window.location.assign(funkyDestinationUrl);
  };

  const playReveal = () => {
    if (isPlaying) return;
    isPlaying = true;
    rebuildDissolveGrid();
    resetReveal();

    const state = { progress: 0 };

    if (reduced) {
      gsap.set(stage, { x: 0, y: 0 });
      updateRevealProgress(1);
      gsap.to(root, {
        duration: 0.01,
        delay: 1.2,
        onComplete: completeReveal,
      });
      return;
    }

    gsap
      .timeline({ defaults: { ease: 'none' } })
      .to(stage, { x: 0, duration: 0.8, ease: 'power3.out' })
      .to(
        state,
        {
          progress: 1,
          duration: 2.7,
          onUpdate: () => updateRevealProgress(state.progress),
        },
        '-=0.05'
      )
      .to(
        {},
        {
          duration: 0.35,
          onComplete: completeReveal,
        }
      );
  };

  trigger.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    playReveal();
  });
};
