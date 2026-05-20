const button = document.getElementById('fill-btn');
const saveButton = document.getElementById('save-id-btn');
const userIdField = document.getElementById('user-id');

const loadUserId = () => {
  chrome.storage.local.get(['quickapplyUserId'], (result) => {
    console.log('[QuickApply] loaded popup userId:', result.quickapplyUserId);
    if (userIdField && result.quickapplyUserId) {
      userIdField.value = result.quickapplyUserId;
    }
  });
};

saveButton?.addEventListener('click', () => {
  const value = userIdField?.value?.trim();
  if (!value) {
    alert('Ingresa un userId válido.');
    return;
  }
  chrome.storage.local.set({ quickapplyUserId: value }, () => {
    console.log('[QuickApply] saved userId:', value);
    alert('UserId guardado.');
  });
});

loadUserId();

button?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  const sendFillMessage = () => {
    chrome.tabs.sendMessage(tab.id, { type: 'fill-form' }, (response) => {
      if (chrome.runtime.lastError) {
        const error = chrome.runtime.lastError.message || '';
        if (error.includes('Receiving end does not exist')) {
          injectContentScript();
          return;
        }

        alert('Error al comunicarse con la página: ' + error);
        return;
      }

      if (response?.success) {
        window.close();
      }
    });
  };

  const injectContentScript = () => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ['contentScript.js'],
      },
      () => {
        if (chrome.runtime.lastError) {
          alert('No se pudo inyectar el contenido del script. Puede que la página no permita extensiones en este contexto.');
          return;
        }
        sendFillMessage();
      }
    );
  };

  sendFillMessage();
});
