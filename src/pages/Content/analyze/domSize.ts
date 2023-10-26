import { Analyze } from "../../../types";
import {
  getChromeLocalStorage,
  setChromeLocalStorage,
} from "../../../utils/asyncChromeStorage";
import { cleanUrl } from "../../../utils/url";

const getDomSizeWithoutSvg = (): number => {
  let dom_size = document.getElementsByTagName("*").length;
  const svgElements = document.getElementsByTagName("svg");
  for (let i = 0; i < svgElements.length; i++) {
    dom_size -= getNbChildsExcludingNestedSvg(svgElements[i]) - 1;
  }
  return dom_size;
};

const getNbChildsExcludingNestedSvg = (element: Element): number => {
  if (element.nodeType === Node.TEXT_NODE) return 0;
  let nb_elements = 1;

  for (let i = 0; i < element.childNodes.length; i++) {
    const childNode = element.childNodes[i];

    // Check if it's an element node
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const childElement = childNode as Element; // Cast to Element
      // Deal with the 'svg' nested case
      if (childElement.tagName !== "svg") {
        nb_elements += getNbChildsExcludingNestedSvg(childElement);
      } else {
        nb_elements += 1;
      }
    }
  }

  return nb_elements;
};

const updateAnalyzeDomSize = async () => {
  const analyzes = (await getChromeLocalStorage<Analyze[]>("analyzes")) || [];

  const currentUrl = cleanUrl(window.location.href);
  const analyze = analyzes.find(
    (analyze) => cleanUrl(analyze.url) === currentUrl,
  );
  const domSize = getDomSizeWithoutSvg();
  if (analyze) {
    analyze.domSize = domSize;
    analyze.updatedAt = new Date().toISOString();
    console.log("kartrak - update analyze DS", analyze);
  } else {
    console.log("kartrak - create analyze DS");
    analyzes.push({
      url: cleanUrl(currentUrl),
      domSize,
      updatedAt: new Date().toISOString(),
    });
  }

  // save the analyzes
  await setChromeLocalStorage("analyzes", analyzes);
};

const analyzeDomSize = async () => {
  await updateAnalyzeDomSize();

  const observer = new MutationObserver(async (_mutations) => {
    console.log("kartrak - mutation observer");
    await updateAnalyzeDomSize();
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
  });
};

export default analyzeDomSize;
