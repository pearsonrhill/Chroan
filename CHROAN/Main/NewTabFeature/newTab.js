// Elements
const ayahText = document.querySelector(".arabic");
const ayahTranslation = document.querySelector(".translation");
const surahName = document.querySelector(".surah");
const recitationAudio = document.querySelector(".recitation-audio");
const audioSource = document.querySelector(".audio-source");
let srcOfAudio = ""; // Mutable variable for audio source

// Debugging: Check if elements exist
// console.log("ayahText:", ayahText);
// console.log("ayahTranslation:", ayahTranslation);
// console.log("surahName:", surahName);
// console.log("recitationAudio:", recitationAudio);
// console.log("audioSource:", audioSource);

// Fetch Random Ayah
async function fetchRandomAyah() {
  const randomNumber = Math.floor(Math.random() * 114) + 1; // Random Surah number (1-12)
  const randomNumber2 = Math.floor(Math.random() * 2) + 1; // Random Ayah number (1-12)


  console.log(`Fetching Ayah: Surah ${randomNumber}, Ayah ${randomNumber2}`);
  const response = await fetch(
    `https://quranapi.pages.dev/api/${randomNumber}/${randomNumber2}.json`
  );
  const data = await response.json();
  // console.log("Fetched data:", data);
  // console.log("ayahText:", data.arabic1);

  ayahText.textContent = data.arabic1;
  ayahTranslation.textContent = data.english || "No translation available";
  surahName.textContent =`${data.surahNameTranslation} - ${data.surahNameArabic}` ||"No Surah name available";
  srcOfAudio = data.audio[1].url;
  // recitationAudio.load();

}

// Audio playback logic
const audioButton = document.querySelector(".audio-btn");
audioButton?.addEventListener("click", () => {
  if (!srcOfAudio) {
    console.error("Audio source is empty");
    return;
  }

  const audio = new Audio(srcOfAudio); // Dynamically create a new audio object
  if (audio.paused) {
    audio.play();
    audioButton.textContent = "⏸️"; // Change icon to pause
  } else {
    audio.pause();
    audioButton.textContent = "🔊"; // Change back to play
  }
});

// Settings button logic (mock)
const settingsButton = document.querySelector(".settings-btn");
settingsButton?.addEventListener("click", () => {
  alert("Open settings menu (mock)."); // Replace with actual settings menu functionality
});

// Event Listener for changing Ayah
const changeAyatButton = document.querySelector(".change-ayat-button");
changeAyatButton?.addEventListener("click", () => {
  // console.log("Change Ayah button clicked");
  fetchRandomAyah(); // Fetch new random Ayah
});

// Initial fetch
fetchRandomAyah();
