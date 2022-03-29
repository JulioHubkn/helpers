const inBetween = (max: number, min: number, value: number) => {
  return +max >= +value && +min <= +value;
};

export { inBetween };
