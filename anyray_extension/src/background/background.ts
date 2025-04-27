// Создание кнопки 
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "save-to-anyray",
      title: "Save to AnyRay",
      contexts: ["selection"], 
    });
  });
  
  // Обработчик клика 
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "save-to-anyray" && info.selectionText) {
      const selectedText = info.selectionText.trim();
      console.log("Selected text to save:", selectedText);
      sendToPlatform(selectedText);
    }
  });

//   const HUB_ID = "f9b7401c-25d9-4561-9a6c-6347cb068adc";

  
//   function sendToPlatform(text: string) {
//     console.log(`Sending to platform: ${text}`);
  
//     fetch('http://localhost:3000/lexeme', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         lexeme: text,
//         hubId: HUB_ID,
//       }),
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`Server responded with ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         console.log('Successfully saved lexeme:', data);
  
//         chrome.notifications.create({
//           type: 'basic',
//           iconUrl: 'icon.png',
//           title: 'AnyRay',
//           message: 'Word saved successfully to your hub!'
//         });
//       })
//       .catch(error => {
//         console.error('Error sending to platform:', error);
//       });
//   }
  
function sendToPlatform(text: string) {
    chrome.storage.local.get(['hubId'], (result) => {
      const hubId = result.hubId;
  
      if (!hubId) {
        console.error('Hub ID is not set!');
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'AnyRay',
          message: 'Hub ID is not set. Please set it in options.'
        });
        return;
      }
  
      fetch('http://localhost:3000/lexeme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lexeme: text,
          hubId: hubId,
        }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Successfully saved lexeme:', data);
  
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'AnyRay',
            message: 'Word saved successfully to your hub!'
          });
        })
        .catch(error => {
          console.error('Error sending to platform:', error);
        });
    });
  }
  
  