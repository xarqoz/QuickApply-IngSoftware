chrome.runtime.onInstalled.addListener(() => {
  console.log('QuickApply extension installed');
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'fetch-profile') {
    const userId = message.userId;
    if (!userId) {
      sendResponse({ error: 'Missing userId' });
      return true;
    }

    fetch(`http://localhost:3000/api/profile/${userId}`)
      .then((resp) => resp.json())
      .then((json) => {
        sendResponse({ profile: json.profile });
      })
      .catch((error) => {
        console.error('[QuickApply] background profile fetch error', error);
        sendResponse({ error: error.message || 'Fetch failed' });
      });

    return true;
  }
});
