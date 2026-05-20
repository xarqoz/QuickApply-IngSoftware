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
      resolve(result.quickapplyUserId || null);
    });
  });

const fillFormWithProfile = async () => {
  const userId = await getProfileFromStorage();
  if (!userId) {
    alert('Debes configurar tu ID de usuario en la extensión antes de autocompletar.');
    return;
  }

  const profile = await fetch(`http://localhost:3000/api/profile/${userId}`)
    .then((resp) => resp.json())
    .then((json) => json.profile)
    .catch(() => null);

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
