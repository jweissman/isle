// restrain a value between a min and a max
const clamp = (min: number, max: number) => (val: number) => {
  let clamped = Math.min(val, max);
  clamped = Math.max(clamped, min);
  return clamped;
}

export { clamp };
