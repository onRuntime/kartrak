import analyzes from "./analyzes";
import tabtimes from "./tabtimes";

const main = async () => {
  console.log("kartrak - background script started");
  tabtimes();
  analyzes();
};

main();
