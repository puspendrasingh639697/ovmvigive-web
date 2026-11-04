import translate from '@vitalets/google-translate-api';

export const autoTranslateWebsite = async (targetLanguage) => {
  // Agar English select kiya hai toh kuch mat karo
  if (targetLanguage === 'en') {
    window.location.reload();
    return;
  }

  // Poori website ka text nikal lo
  const allTextNodes = document.querySelectorAll('h1, h2, h3, h4, p, span, button, label, a');

  for (let i = 0; i < allTextNodes.length; i++) {
    const element = allTextNodes[i];
    
    // Agar pehle se translate ho chuka hai toh skip karo
    if (element.getAttribute('data-original-text')) continue;

    const originalText = element.innerText;
    if (!originalText || originalText.trim() === '') continue;

    // Original text ko save kar lo taaki wapas English par laa sakein
    element.setAttribute('data-original-text', originalText);

    try {
      // Google Translate package se text translate karo
      const res = await translate(originalText, { to: targetLanguage });
      element.innerText = res.text;
    } catch (error) {
      console.log("Translation error for text:", originalText);
    }
  }
};