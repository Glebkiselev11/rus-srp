export const isMobile = () => {
  const minWidth = 768;
  return window.innerWidth < minWidth || screen.width < minWidth;
};
