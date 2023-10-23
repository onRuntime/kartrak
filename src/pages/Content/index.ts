import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

window.addEventListener('popstate', function (event) {
  // React to route changes
  console.log("popstate")
});

// Or for hash-based routing
window.addEventListener('hashchange', function (event) {
  // React to route changes
  console.log("hashchange")
});
