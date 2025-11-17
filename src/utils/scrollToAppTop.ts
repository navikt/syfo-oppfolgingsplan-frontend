export function scrollToAppTopForAG(behavior: ScrollBehavior = "smooth") {
  const HEIGHT_DECORATOR = 160;
  const HEIGHT_DINE_SYKMELDTE_HEADER = 128;

  window.scrollTo({
    top: HEIGHT_DECORATOR + HEIGHT_DINE_SYKMELDTE_HEADER,
    behavior,
  });
}
