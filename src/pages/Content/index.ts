import analyzeDomSize from "./analyze/domSize"

const main = async () => {
  console.log('kartrak - initialize content script');
  analyzeDomSize();
}

main();