const installNotice = () => {
  console.log("kartrak - extension installed");

  chrome.tabs.create({
    url: chrome.runtime.getURL("welcome.html"),
  });
};

export default installNotice;
