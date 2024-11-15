import analyzeDomSize from "./analyze/domSize";

const main = async () => {
  console.log("[kartrak][content] initialize content script");
  analyzeDomSize();
};

main();
