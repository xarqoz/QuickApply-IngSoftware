console.log('[QuickApply] content script injected on', location.href);

const getFieldKey = (element) => {
  const name = (element.name || element.id || '').toLowerCase();
  const placeholder = (element.placeholder || '').toLowerCase();
  return `${name} ${placeholder}`;
};

const fillField = (element, value) => {
  if (!value) return;
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

const matchValue = (fieldKey, profile) => {
  if (fieldKey.includes('name')) return profile.personalInfo.fullName || profile.personalInfo.email;
  if (fieldKey.includes('email')) return profile.personalInfo.email;
  if (fieldKey.includes('phone') || fieldKey.includes('tel') || fieldKey.includes('telefono')) return profile.personalInfo.phone;
  if (fieldKey.includes('address') || fieldKey.includes('location') || fieldKey.includes('direccion')) return profile.personalInfo.location;
  if (fieldKey.includes('linkedin')) return profile.personalInfo.linkedIn;
  if (fieldKey.includes('portfolio') || fieldKey.includes('web') || fieldKey.includes('site')) return profile.personalInfo.portfolio;
  return '';
};

const gatherFields = () => {
  const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
  return inputs
    .filter((element) => !element.disabled && element.type !== 'hidden')
    .map((element) => ({
      name: element.name || element.id || element.placeholder || '',
      tag: element.tagName,
      path: element.name || element.id || element.placeholder || '',
    }));
};

const getProfileFromStorage = () =>
  new Promise((resolve) => {
    chrome.storage.local.get(['quickapplyUserId'], (result) => {
      const browserUserId = window.localStorage.getItem('quickapplyUserId');
      const userId = result.quickapplyUserId || browserUserId || null;
      console.log('[QuickApply] extension storage userId:', result.quickapplyUserId, 'page storage userId:', browserUserId);
      resolve(userId);
    });
  });

const fetchProfileFromBackground = (userId) =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'fetch-profile', userId }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[QuickApply] runtime sendMessage error', chrome.runtime.lastError);
        return resolve(null);
      }
      if (response?.error) {
        console.error('[QuickApply] background profile error', response.error);
        return resolve(null);
      }
      resolve(response?.profile || null);
    });
  });

const fillFormWithProfile = async () => {
  const userId = await getProfileFromStorage();
  if (!userId) {
    alert('Debes configurar tu ID de usuario en la extensión antes de autocompletar.');
    return;
  }

  const profile = await fetchProfileFromBackground(userId);

  if (!profile) {
    alert('No se pudo cargar el perfil. Asegúrate de que el backend esté activo y que hayas iniciado sesión.');
    return;
  }

  const elements = Array.from(document.querySelectorAll('input, textarea, select'));
  elements.forEach((element) => {
    const key = getFieldKey(element);
    const value = matchValue(key, profile);
    fillField(element, value);
  });

  alert('Formulario autocompletado con tu perfil. Revisa los campos antes de enviar.');
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'fill-form') {
    fillFormWithProfile();
    sendResponse({ success: true });
  }
});
