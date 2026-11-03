// Recovery is independent of the animation libraries.
window.finishPortfolioBoot = () => {
  document.querySelector('#pre')?.remove();
  document.querySelector('#pn')?.remove();
  document.documentElement.dataset.boot = 'complete';
};
setTimeout(() => {
  if (document.querySelector('#pre')) window.finishPortfolioBoot();
}, 8000);
