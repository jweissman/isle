import * as ex from 'excalibur';

// tiny probability handler...
const coinflip = () => Math.random() > 0.5

// restrain a value between a min and a max
const clamp = (min: number, max: number) => (val: number) => {
  let clamped = Math.min(val, max);
  clamped = Math.max(clamped, min);
  return clamped;
}

type Direction = 'left' | 'right' | 'up' | 'down';

const keyToDirection = (key: number): Direction => {
  let direction : Direction;
  if (key === ex.Input.Keys.A || key === ex.Input.Keys.Left) {
    direction = 'left';
  }
  if (key === ex.Input.Keys.D || key === ex.Input.Keys.Right) {
    direction = 'right';
  }
  if (key === ex.Input.Keys.S || key === ex.Input.Keys.Down) {
    direction = 'down';
  }
  if (key === ex.Input.Keys.W || key === ex.Input.Keys.Up) {
    direction = 'up';
  }
  return direction;
}

const oppositeWay = (dir: Direction): Direction => {
  let opp: Direction;
  switch(dir) {
    case 'left': opp = 'right'; break;
    case 'right': opp = 'left'; break;
    case 'up': opp = 'down'; break;
    case 'down': opp = 'up'; break;
  }
  return opp;
}

// suggested impl from https://codereview.stackexchange.com/a/169667
const mode = (array) => {
  const map = new Map(); // new Map();

  let maxFreq = 0;
  let mode;

  for(const item of array) {
    let freq = map.has(item) ? map.get(item) : 0;
    freq++;

    if(freq > maxFreq) {
      maxFreq = freq;
      mode = item;
    }
    
    map.set(item, freq);
  }

  return mode;
};

const addScalarToVec = (vec: ex.Vector, direction: Direction, step: number) => {
  switch (direction) {
    case 'up':
      vec.y -= step;
      break;
    case 'down':
      vec.y += step;
      break;
    case 'left':
      vec.x -= step;
      break;
    case 'right':
      vec.x += step;
      break;
  }
}

const dirFromVec = (vec: ex.Vector): Direction => {
  let {x,y} = vec;
  if (Math.abs(x) > Math.abs(y)) {
    return x > 0 ? 'right' : 'left';
  } else {
    return y > 0 ? 'down' : 'up';
  }
}

export {
  clamp,
  Direction,
  keyToDirection,
  addScalarToVec,
  dirFromVec,
  oppositeWay,
  mode,
  coinflip
};
