console.log("BACKGROUND: Service worker initialized.");

chrome.runtime.onInstalled.addListener(() => {
  console.log("BACKGROUND: Extension installed/updated.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("BACKGROUND: Received message:", request);
  
  if (request.type === "checkVideo") {
    // We execute the function and explicitly handle the promise
    isSynthetic(request.videoId)
      .then((result) => {
        sendResponse(result);
      })
      .catch((err) => {
        console.error("BACKGROUND: Error in isSynthetic:", err);
        sendResponse(false); // Always respond so the port closes cleanly
      });
      
    return true; // Keep the port open for the async call
  }
  return false; 
});

async function isSynthetic(videoId) {
  try {
    // 1. Storage check (Sync/Local)
    const [cache, data] = await Promise.all([
      chrome.storage.local.get(videoId),
      chrome.storage.sync.get(['apiKey'])
    ]);

    if (cache[videoId] !== undefined) return cache[videoId];
    if (!data.apiKey) throw new Error("No API Key");

    // 2. Fetch
    const url = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoId}&key=${data.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`API Status: ${response.status}`);
    
    const json = await response.json();
    const result = json.items?.[0]?.status?.containsSyntheticMedia === true;

    // 3. Save Cache
    await chrome.storage.local.set({ [videoId]: result });
    return result;

  } catch (error) {
    console.error("BACKGROUND: API call failed:", error);
    return false; // Return false to avoid breaking the UI, but log the error
  }
}

// background.js - Make sure this is outside any functions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "checkVideo") {
    isSynthetic(request.videoId).then(sendResponse);
    return true; // IMPORTANT: This keeps the port open for the async response
  }
});