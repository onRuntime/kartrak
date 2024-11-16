import {
  computeEcoIndex,
  getCurrentEcoIndexBackgroundColor,
  getCurrentEcoIndexColor,
} from "./ecoindex";
import { Analyze } from "../types";

export const updateBadge = async (analyze: Analyze, tabId: number) => {
  const ecoIndex =
    analyze?.domSize !== undefined &&
    analyze?.pageWeight !== undefined &&
    analyze?.requestAmount !== undefined
      ? computeEcoIndex(
          analyze?.domSize,
          analyze?.requestAmount,
          analyze?.pageWeight,
        )
      : undefined;

  await chrome.action.setBadgeText({
    text: ecoIndex ? Math.round(ecoIndex).toString() : "-",
    tabId,
  });
  await chrome.action.setBadgeBackgroundColor({
    color: getCurrentEcoIndexBackgroundColor(ecoIndex, true),
    tabId,
  });
  await chrome.action.setBadgeTextColor({
    color: getCurrentEcoIndexColor(ecoIndex, true),
    tabId,
  });
};
