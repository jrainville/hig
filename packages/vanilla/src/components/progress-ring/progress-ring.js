import './progress-ring.scss';

const Interface = require('interface.json');
const Core = require('_core.js');

const Template = require('./progress-ring.html');
const ProgressRingIndeterminate = require('./progress-ring-indeterminate');
const ProgressRingDeterminate = require('./progress-ring-determinate');
const extraSmallSVG = require('./progress-ring-xs.svg');
const smallSVG = require('./progress-ring-s.svg');
const mediumsSVG = require('./progress-ring-m.svg');

const AvailableSizes = ['xs', 's', 'm', 'l', 'xl'];
const SIZE_CLASSES = AvailableSizes.map(size => (`hig__progress-ring--${size}`));

const sizes = {
  xs: {
    svg: extraSmallSVG,
    size: 20,
    scale: 1
  },
  s: {
    svg: smallSVG,
    size: 28,
    scale: 1
  },
  m: {
    svg: mediumsSVG,
    size: 72,
    scale: 1
  },
  l: {
    svg: mediumsSVG,
    size: 144,
    scale: 2
  },
  xl: {
    svg: mediumsSVG,
    size: 242,
    scale: 3.35
  },
};

class ProgressRing extends Core {
  static _partials = {};
  static _defaults = {
    size: AvailableSizes[2]
  }
  static AvailableSizes = AvailableSizes;

  constructor(options = {}) {
    super(options);

    this._render(Template, options);
    this.initialOptions = options;
  }

  _componentDidMount() {
    this.animation = new ProgressRingIndeterminate(this.el);
    this.animation.start();

    this.setSize(this.initialOptions.size);
  }

  setSize(size) {
    if (!AvailableSizes.includes(size)) {
      console.error(
        `ProgressRing size "${size}" not found, only these sizes are allowed: `,
        AvailableSizes,
      );
      return;
    }
    if (size === this.size) { return; }
    this.size = size;

    this.el.innerHTML = sizes[size].svg;
    this.el.style.width = sizes[size].size;
    this.el.style.height = sizes[size].size;
    this.el.children[0].style.transform = `scale(${sizes[size].scale})`;
    this.el.classList.remove(...SIZE_CLASSES);
    this.el.classList.add(`hig__progress-ring--${size}`);

    this.animation.forceReset();
  }

  setPercentComplete(percentComplete) {
    if (!(this.animation instanceof ProgressRingDeterminate)) {
      this.animation.stop();
      this.animation = new ProgressRingDeterminate(this.el);
      this.animation.start();
    }
    this.animation.setProgress(percentComplete);
  }
}

ProgressRing._interface = Interface.components.ProgressRing;

module.exports = ProgressRing;