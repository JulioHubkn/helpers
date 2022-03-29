const inBetween = (max, min, value) => {
    return +max >= +value && +min <= +value;
};
export { inBetween };
