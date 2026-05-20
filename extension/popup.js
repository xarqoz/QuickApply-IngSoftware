const button = document.getElementById('fill-btn');
const saveButton = document.getElementById('save-id-btn');
const userIdField = document.getElementById('user-id');

const loadUserId = () => {
  chrome.storage.local.get(['quickapplyUserId'], (result) => {
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
    alert('UserId guardado.');
  });
});

loadUserId();

button?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  chrome.tabs.sendMessage(tab.id, { type: 'fill-form' }, (response) => {
    if (chrome.runtime.lastError) {
      alert('No se encontró el contenido del script. Asegúrate de que la página permita scripts de contenido.');
      return;
    }

    if (response?.success) {
      window.close();
    }
  });
});
