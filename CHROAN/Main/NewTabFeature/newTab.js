// document.addEventListener("DOMContentLoaded", function() {
//     // Variables to store the elements
//     const arabicText = document.getElementById("arabic-text");
//     const surahName = document.getElementById("surah-name");
//     const transliteration = document.getElementById("transliteration");
//     const translationText = document.getElementById("translation-text");
//     const recitationAudio = document.getElementById("recitation-audio");
//     const audioSource = document.getElementById("audio-source");

//     // Content that will be toggled
//     const arabicContent = "وَجَعَلْنَا سِرَاجًا وَهَّاجًا"; // Arabic text (An-Naba 5685 example)
//     const transliterationContent = "(Waja'alna Sirajan Wahhajan)";
//     const translationContent = "And have placed therein the sun, a lamp full of blazing splendour. (An-Naba 5685)";

//     // Quran.com API URL (example verse, change to dynamic if needed)
//     const apiUrl = 'https://api.quran.com:443/api/v4/verses/78/13';  // An-Naba 78:13 as example

//     // Fetch the verse data from Quran.com API
//     fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//             const verse = data.data.verse;
//             const translation = verse.translations.find(t => t.language_name === "en");
//             const recitationUrl = `https://verses.quran.com/${verse.audio_url}`;  // Replace with actual audio URL

//             // Update the page content dynamically
//             arabicText.innerHTML = verse.text; // Arabic text
//             surahName.innerHTML = `An-Naba (${verse.surah_number}:${verse.verse_key})`; // Surah name and verse
//             transliteration.innerHTML = `(${verse.transliteration})`; // Transliteration
//             translationText.innerHTML = translation.text; // English translation
//             audioSource.setAttribute("src", recitationUrl);
//         })
//         .catch(error => console.error('Error fetching Quran data:', error));

//     // Play and pause button functionality
//     const playButton = document.getElementById("play-btn");
//     const pauseButton = document.getElementById("pause-btn");

//     playButton.addEventListener("click", () => {
//         recitationAudio.play();
//     });

//     pauseButton.addEventListener("click", () => {
//         recitationAudio.pause();
//     });

//     // Button to switch the content between Arabic, Transliteration, and Translation
//     const toggleButton = document.getElementById("toggle-btn");
//     let currentContent = "arabic"; // default content is Arabic

//     toggleButton.addEventListener("click", () => {
//         if (currentContent === "arabic") {
//             arabicText.innerHTML = transliterationContent; // Switch to transliteration
//             currentContent = "transliteration";
//         } else if (currentContent === "transliteration") {
//             arabicText.innerHTML = translationContent; // Switch to translation
//             currentContent = "translation";
//         } else {
//             arabicText.innerHTML = arabicContent; // Switch back to Arabic
//             currentContent = "arabic";
//         }
//     });
// });


// Display current time
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();



import {
    THEME_OPTIONS,
    KEYS,
    getFromLocalStorage,
    setToLocalStorage,
    incrementLocalStorage,
  } from "./shared.js";
  
  const ayahText = document.querySelector(".ayah-text");
  const ayahTranslation = document.querySelector(".ayah-translation");
  const recitationButton = document.querySelector(".recitation-button");
  const themeToggle = document.querySelector("#theme-switch");
  
  let currentAyahNumber = 0;
  const bitrate = 64;
  const edition = "quran-uthmani";
  const translationEdition = "en.asad";
  const TOTAL_NO_OF_AYAH = 6236;
  
  function getKhatmaMode() {
    return getFromLocalStorage(KEYS.KHATMA_MODE) === "true";
  }
  
  async function fetchAyahData(ayahNumber) {
    const response = await fetch(
      `https://api.alquran.cloud/v1/ayah/${ayahNumber}/editions/${edition},${translationEdition}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch Ayah data");
    }
    return response.json();
  }
  
  async function displayAyah(ayahNumber) {
    try {
      const data = await fetchAyahData(ayahNumber);
      const ayah = data.data[0].text;
      const surah = data.data[0].surah.name;
      const translation = data.data[1].text;
      const surahTranslation = data.data[1].surah.englishName;
  
      currentAyahNumber = data.data[0].number;
      ayahText.innerHTML = `${ayah} (${surah} ${ayahNumber})`;
      ayahTranslation.textContent = `${translation} (${surahTranslation} ${ayahNumber})`;
    } catch (error) {
      console.error(error);
      ayahText.innerHTML = "Error: Please try again later.";
    }
  }
  
  async function getRandomAyah() {
    const ayahNumber = Math.floor(Math.random() * TOTAL_NO_OF_AYAH) + 1;
    await displayAyah(ayahNumber);
  }
  
  async function getNextAyahInKhatma() {
    let ayahNumber = +getFromLocalStorage(KEYS.KHATMA_LAST_AYAH, 0) + 1;
  
    if (ayahNumber === TOTAL_NO_OF_AYAH)
      incrementLocalStorage(KEYS.NO_OF_COMPLETED_KHATMA);
    else if (ayahNumber > TOTAL_NO_OF_AYAH) ayahNumber = 1;
  
    await displayAyah(ayahNumber);
  
    setToLocalStorage(KEYS.KHATMA_LAST_AYAH, ayahNumber);
  }
  
  function getAyahToDisplay() {
    if (getKhatmaMode()) getNextAyahInKhatma();
    else getRandomAyah();
  }
  
  function storeThemeSelection(theme) {
    if (theme !== THEME_OPTIONS.Dark && theme !== THEME_OPTIONS.LIGHT) return;
    setToLocalStorage(KEYS.THEME, theme);
  }
  
  function getThemeSelection() {
    return getFromLocalStorage(KEYS.THEME, THEME_OPTIONS.Dark);
  }
  
  function applyTheme(theme) {
    const container = document.querySelector("#container");
    const ayahContainer = document.querySelector(".ayah-container");
  
    if (theme === THEME_OPTIONS.LIGHT) {
      container.classList.add("light-theme");
      ayahContainer.classList.add("light-theme");
    } else {
      container.classList.remove("light-theme");
      ayahContainer.classList.remove("light-theme");
    }
  }
  
  function setInitialTheme(theme) {
    if (theme !== THEME_OPTIONS.Dark && theme !== THEME_OPTIONS.LIGHT) return;
    themeToggle.checked = theme === THEME_OPTIONS.LIGHT;
    applyTheme(theme);
  }
  
  recitationButton.addEventListener("click", () => {
    let audioEdition = getFromLocalStorage(KEYS.RECITER);
    const audioURL = `https://cdn.islamic.network/quran/audio/${bitrate}/${audioEdition}/${currentAyahNumber}.mp3`;
    const audio = new Audio(audioURL);
    audio.play();
  });
  
  themeToggle.addEventListener("change", () => {
    const newTheme = themeToggle.checked
      ? THEME_OPTIONS.LIGHT
      : THEME_OPTIONS.Dark;
    applyTheme(newTheme);
    storeThemeSelection(newTheme);
  });
  
  getAyahToDisplay();
  
  const selectedTheme = getThemeSelection();
  setInitialTheme(selectedTheme);