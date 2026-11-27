// Keep this preview's progress in its own area of the current tab.
(() => {
 const tab = window.sessionStorage;
 function scoped(area) {
  const prefix = 'demo-nota-v1/' + area + '/';
  return {
   getItem: key => tab.getItem(prefix + key),
   setItem: (key, value) => tab.setItem(prefix + key, value),
   removeItem: key => tab.removeItem(prefix + key)
  };
 }
 Object.defineProperty(window, 'localStorage', {value:scoped('partida')});
 Object.defineProperty(window, 'sessionStorage', {value:scoped('sesion')});
})();
