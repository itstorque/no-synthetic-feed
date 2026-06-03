console.log("CONTENT: Script loaded.");

// --- URL Change Listener ---
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log("CONTENT: URL changed to:", url);
    
    // Check if we are on a video page
    const videoId = new URLSearchParams(window.location.search).get('v');
    if (videoId) {
      processVideo(videoId);
    }
  }
}).observe(document.querySelector("title") || document.head, { subtree: true, characterData: true, childList: true });

// --- Feed Observer (Your existing logic) ---
function findAndCheckVideos() {
  // Target every watch link directly
  const allLinks = document.querySelectorAll('a[href*="/watch?v="]');
  
  allLinks.forEach(link => {
    // If we've already checked this specific link, skip it
    if (link.dataset.aiChecked === "true") return;

    const url = new URL(link.href, window.location.origin);
    const videoId = url.searchParams.get('v');

    if (videoId) {
      // Mark this link as checked
      link.dataset.aiChecked = "true";
      
      console.log("CONTENT: Checking link:", videoId);
      
      chrome.runtime.sendMessage({ type: "checkVideo", videoId }, (response) => {
        if (chrome.runtime.lastError) return;
        
        if (response === true) {
          // Hide the link directly
          link.style.display = 'none';
          console.log(`CONTENT: Blocked link: ${videoId}`);
        }
      });
    }
  });
}

// Initial triggers
findAndCheckVideos();
new MutationObserver(findAndCheckVideos).observe(document.body, { childList: true, subtree: true });

// --- Video Page Processor ---
async function processVideo(videoId) {
  console.log("CONTENT: Processing video page:", videoId);
  const settings = await chrome.storage.sync.get(['blockVideo', 'rickRoll']);
  
  // Use background check
  chrome.runtime.sendMessage({type: "checkVideo", videoId}, (synthetic) => {
    if (!synthetic) return;

    if (settings.blockVideo) {
      if (document.getElementById('ai-overlay')) return;
      const overlay = document.createElement('div');
      overlay.id = 'ai-overlay';
      overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:black; color:white; z-index:999999; display:flex; flex-direction:column; justify-content:center; align-items:center;";
      overlay.innerHTML = `<h1>AI Content Blocked</h1><button id="reloadBtn">Watch Anyway</button>`;
      document.body.appendChild(overlay);
      document.getElementById('reloadBtn').onclick = () => location.reload();
    } else if (settings.rickRoll) {
      window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
  });
}

// Run processVideo if loaded directly on a watch page
const initialVideoId = new URLSearchParams(window.location.search).get('v');
if (initialVideoId) processVideo(initialVideoId);