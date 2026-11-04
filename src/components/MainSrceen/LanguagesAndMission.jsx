import React, { useMemo } from "react";
import Marquee from "react-fast-marquee";
import Flag from "react-world-flags";
import ISO6391 from "iso-639-1";

const LanguagesAndMission = () => {
  const allowedLanguages = [
    "ar", "bn", "de", "en", "es", "fa", "fi", "fr", "hi", "id", 
    "it", "ja", "kk", "ko", "ms", "ne", "no", "or", "pa", "pt", 
    "ru", "sv", "sw", "ta", "te", "tl", "ur", "uz", "tr", "vi", "zh"
  ];

  const countryCodeMap = {
    ar: "SA", bn: "BD", de: "DE", en: "US", es: "ES", fa: "IR", fi: "FI", fr: "FR",
    hi: "IN", id: "ID", it: "IT", ja: "JP", kk: "KZ", ko: "KR", ms: "MY", ne: "NP",
    no: "NO", or: "IN", pa: "IN", pt: "PT", ru: "RU", sv: "SE", sw: "KE", ta: "LK",
    te: "IN", tl: "PH", ur: "PK", uz: "UZ", tr: "TR", vi: "VN", zh: "CN"
  };

  const languages = useMemo(() => {
    return allowedLanguages.map((code) => {
      const name = ISO6391.getName(code); 
      return { langCode: code, name: name || code, countryCode: countryCodeMap[code] || "UN" };
    });
  }, []);

  // 🔥 BROWSER-FRIENDLY AUTOMATIC TRANSLATE FUNCTION 🔥
  const autoTranslateWebsite = async (targetLanguage) => {
    if (targetLanguage === 'en') {
      window.location.reload(); 
      return;
    }

    const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, button, label, a');

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.getAttribute('data-translated') === 'true') continue;

      const text = el.innerText;
      if (!text || text.trim() === '') continue;

      el.setAttribute('data-translated', 'true');
      el.setAttribute('data-original-text', text);

      try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          el.innerText = data[0][0][0];
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    }
  };

  const handleLanguageSelect = async (languageCode) => {
    setTimeout(async () => {
      await autoTranslateWebsite(languageCode);
    }, 100);
  };

  return (
    <section className="bg-[#FFFAF5] text-black py-16 px-4 md:px-8 flex flex-col items-center overflow-hidden">
      
      {/* 🔥 HEADING SECTION 🔥 */}
      <div className="w-full max-w-2xl mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-green-800">
          Select Your Country
        </h2>
        <p className="text-black text-sm md:text-base">
          Choose your preferred language to explore our website
        </p>
      </div>

      {/* 🔥 FLAGS SECTION (Fixed UI) 🔥 */}
      <div className="w-full max-w-7xl mb-16">
        <Marquee gradient={true} gradientColor="#ffffff" gradientWidth={80} speed={40} pauseOnHover={true}>
          {languages.map((lang, index) => (
            <div
              key={index}
              onClick={() => handleLanguageSelect(lang.langCode)}
              title={`Select ${lang.name}`}
              className="mx-3 sm:mx-5 flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 group"
            >
              {/* 🔥 Flag Box (Bada aur Rounded) */}
              <div className="w-20 h-14 sm:w-24 sm:h-16 overflow-hidden rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                <Flag code={lang.countryCode} className="w-full h-full object-cover" />
              </div>
              
              {/* 🔥 Language Name (Ab hamesha dikhega) */}
              <p className="text-sm text-gray-700 mt-2 font-medium group-hover:text-[#5A1F1F] transition-colors duration-300">
                {lang.name}
              </p>
            </div>
          ))}
        </Marquee>
      </div>

    </section>
  );
};

export default LanguagesAndMission;

