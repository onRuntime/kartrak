const installNotice = () => {
  console.log("kartrak - extension installed");

  chrome.tabs.create({
    url: chrome.runtime.getURL("installed.html"),
  });
};

export default installNotice;
