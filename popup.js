const ids = ['hideFeed', 'blockVideo', 'rickRoll', 'apiKey', 'autoClear'];

// Load settings
chrome.storage.sync.get(ids, (data) => {
  ids.forEach(id => {
    if (id === 'apiKey') {
      document.getElementById(id).value = data[id] || '';
    } else {
      document.getElementById(id).checked = !!data[id];
    }
  });
});

// Add listeners for checkboxes
['hideFeed', 'blockVideo', 'rickRoll', 'autoClear'].forEach(id => {
  document.getElementById(id).addEventListener('change', (e) => {
    chrome.storage.sync.set({ [id]: e.target.checked });
  });
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const key = document.getElementById('apiKey').value;
  chrome.storage.sync.set({ apiKey: key }, () => {
    alert("API Key saved!");
  });
});

// Load settings
chrome.storage.sync.get(ids, (data) => {
  ids.forEach(id => {
    if (id === 'apiKey') {
      document.getElementById(id).value = data[id] || '';
    } else {
      document.getElementById(id).checked = !!data[id];
    }
  });
});


// Add this to your existing popup.js
document.getElementById('clearCacheBtn').addEventListener('click', () => {
  chrome.storage.local.clear(() => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      alert("Error clearing cache.");
    } else {
      alert("Cache cleared successfully!");
    }
  });
});