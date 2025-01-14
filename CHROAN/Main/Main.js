const qiblaCoordinates = { lat: 21.4225, lon: 39.8262 }; // Coordinates of the Kaaba (Mecca)

let userLat, userLon;
let deviceOrientation = 0; // In degrees, relative to North
let timings;


// Start tracking the location and orientation
function startTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      userLat = position.coords.latitude;
      userLon = position.coords.longitude;
      showPosition();
      getPrayerTimes(userLat, userLon); // Get prayer times when the location updates
      console.log("getPrayerTimes called");
    
    }, showError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  } else {
    document.getElementById("direction").textContent = "Geolocation is not supported by this browser.";
  }

  // Track the device's orientation
  window.addEventListener("deviceorientation", function(event) {
    deviceOrientation = event.alpha || 0; // alpha is the direction the device is facing (in degrees)
    showPosition();
  });
}

// Function to display location and update the Qibla direction
function showPosition() {
  if (userLat && userLon) {
    document.getElementById("location").textContent = `Location: ${userLat.toFixed(4)}, ${userLon.toFixed(4)}`;

    const qiblaDirection = calculateQibla(userLat, userLon, qiblaCoordinates.lat, qiblaCoordinates.lon);

    const finalRotation = (qiblaDirection - deviceOrientation + 360) % 360;
    document.getElementById("arrow").style.transform = `rotate(${finalRotation}deg)`;

    document.getElementById("direction").textContent = `Qibla is ${Math.round(qiblaDirection)}° from North`;
  }
}

// Calculate Qibla direction using Haversine formula
function calculateQibla(lat1, lon1, lat2, lon2) {
  const radian = Math.PI / 180;
  
  lat1 = lat1 * radian;
  lon1 = lon1 * radian;
  lat2 = lat2 * radian;
  lon2 = lon2 * radian;

  const deltaLon = lon2 - lon1;
  
  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  const qiblaDirection = Math.atan2(y, x) * (180 / Math.PI);
  return (qiblaDirection + 360) % 360; // Normalize the angle to [0, 360]
}

function alertToScreen(message, targetPage) {
  // Display the message (optional, for debugging purposes)
  console.log(message);

  // Redirect the user to the target HTML page
  if (targetPage) {
    window.location.href = targetPage;
  } else {
    console.error("Target page URL is not provided.");
  }
}


function prayerAlert(timings) {
  if (!timings) {
    console.error("Timings data is not available yet.");
    return;
  }

  const adhanAudio = new Audio("path-to-adhan.mp3");

  setInterval(() => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 8); // Format: HH:mm:ss (e.g., 13:37:00)

    // Compare current time with prayer times
    // if (currentTime === `${timings.Fajr}:00`) {
    if (currentTime === `14:25:00`) {
      alert(`It's time for Fajr prayer!`);
      adhanAudio.play();
    }
    if (currentTime === `${timings.Dhuhr}:00`) {
      alert(`It's time for Dhuhr prayer!`);
    }
    if (currentTime === `${timings.Asr}:00`) {
      alert(`It's time for Asr prayer!`);
    }
    if (currentTime === `${timings.Maghrib}:00`) {
      alert(`It's time for Maghrib prayer!`);
    }
    if (currentTime === `${timings.Isha}:00`) {
      alert(`It's time for Isha prayer!`);
    }
  }, 1000); // Check every second
}


// Fetch prayer times using the Aladhan API based on user's location
function getPrayerTimes(lat, lon) {
  const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`; // Method 2 is for ISNA (standard calculation method)

  fetch(url)
    .then(response => response.json())
    .then(data => {
      timings = data.data.timings;
      displayPrayerTimes(timings);
      prayerAlert(timings);
      console.log("prayerAlert called");
    })
    .catch(error => {
      console.error("Error fetching prayer times:", error);
      document.getElementById("prayer-times-list").innerHTML = "<li>Error fetching prayer times.</li>";
    });
}
// Display prayer times in the popup
function displayPrayerTimes(timings) {
  const prayerTimesList = document.getElementById("prayer-times-list");

  if (timings) {
    prayerTimesList.innerHTML = `
      <li>Fajr: ${timings.Fajr}</li>
      <li>Dhuhr: ${timings.Dhuhr}</li>
      <li>Asr: ${timings.Asr}</li>
      <li>Maghrib: ${timings.Maghrib}</li>
      <li>Isha: ${timings.Isha}</li>
    `;
  } else {
    prayerTimesList.innerHTML = "<li>No prayer times available.</li>";
  }
}




// Handle errors in getting location
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("direction").textContent = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("direction").textContent = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.getElementById("direction").textContent = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("direction").textContent = "An unknown error occurred.";
      break;
  }
}


function displayPrayerTimes(timings) {
  const prayerTimesList = document.getElementById("prayer-times-list");

  if (timings) {
    prayerTimesList.innerHTML = `
      <li class="prayer-time-card">
        <i class="fas fa-moon"></i>
        <span>Fajr</span>
        <span class="prayer-time">${timings.Fajr}</span>
      </li>
      <li class="prayer-time-card">
        <i class="fas fa-sun"></i>
        <span>Dhuhr</span>
        <span class="prayer-time">${timings.Dhuhr}</span>
      </li>
      <li class="prayer-time-card">
        <i class="fas fa-sun"></i>
        <span>Asr</span>
        <span class="prayer-time">${timings.Asr}</span>
      </li>
      <li class="prayer-time-card">
        <i class="fas fa-sun"></i>
        <span>Maghrib</span>
        <span class="prayer-time">${timings.Maghrib}</span>
      </li>
      <li class="prayer-time-card">
        <i class="fas fa-moon"></i>
        <span>Isha</span>
        <span class="prayer-time">${timings.Isha}</span>
      </li>
    `;
  } else {
    prayerTimesList.innerHTML = "<li>No prayer times available.</li>";
  }
}





// Example navigation functionality
function navigateTo(section) {
  alert(`Navigating to ${section}`);
}

// Create the hamburger menu button dynamically
window.onload = function() {
  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown');
  
  const button = document.createElement('button');
  button.classList.add('dropbtn');
  button.onclick = toggleDropdown;

  // Create the hamburger lines
  const line1 = document.createElement('div');
  line1.classList.add('line');
  
  const line2 = document.createElement('div');
  line2.classList.add('line');
  
  const line3 = document.createElement('div');
  line3.classList.add('line');
  
  // Append the lines to the button
  button.appendChild(line1);
  button.appendChild(line2);
  button.appendChild(line3);
  
  // Append the button to the dropdown div
  dropdown.appendChild(button);
  
  // Append the dropdown to the body or the specific container
  document.body.appendChild(dropdown);

  // Create and add the dropdown content
  const dropdownContent = document.createElement('div');
  dropdownContent.classList.add('dropdown-content');
  dropdownContent.id = 'dropdown-menu';



  const buttons = ['Home', 'Quran', 'Prayer Times', 'Settings', 'Help', 'Contact'];
buttons.forEach(buttonText => {
  const menuLink = document.createElement('a');
  menuLink.textContent = buttonText;
  
  // Set the href attribute for each button
  switch (buttonText.toLowerCase()) {
    case 'home':
      menuLink.href = '#home'; // Update with the correct path or anchor
      break;
    case 'quran':
      menuLink.href = 'https://quran.com/';
      break;
    case 'prayer times':
      menuLink.href = '#prayer-times'; // Update with the correct path or anchor
      break;
    case 'settings':
      menuLink.href = '#'; // Prevent default link behavior
      menuLink.addEventListener('click', () => {
        loadSettingsPage();
      });
      break;
    case 'help':
      menuLink.href = '#help'; // Update with the correct path or anchor
      break;
    case 'contact':
      menuLink.href = '#contact'; // Update with the correct path or anchor
      break;
    default:
      menuLink.href = '#';
  }
  
  menuLink.classList.add('dropdown-item'); // You can add your styling class here
  dropdownContent.appendChild(menuLink);
});

  // Append dropdown content to dropdown div
  dropdown.appendChild(dropdownContent);
};


function loadSettingsPage() {
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '<p>Loading...</p>'; // Show loading message

  fetch('settings.html')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load settings page');
      }
      return response.text();
    })
    .then((html) => {
      contentContainer.innerHTML = html; // Replace loading message with settings content
    })
    .catch((error) => {
      console.error('Error loading settings page:', error);
      contentContainer.innerHTML = '<p>Failed to load settings page.</p>';
    });
}



// Toggle the dropdown menu visibility
function toggleDropdown() {
  const menu = document.getElementById('dropdown-menu');
  menu.classList.toggle('show');
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.line')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// Example navigation functionality
function navigateTo(section) {
  alert(`Navigating to ${section}`);
}
function toggleDropdown() {
  document.getElementById("dropdown-menu").classList.toggle("show");
}

function navigateTo(page) {
  alert(`Navigating to ${page}`);
  // You can replace this with actual navigation logic, such as window.location.href
}

// Function to dynamically create the dropdown
function createDropdown() {
  // Create the dropdown container
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";

  // Create the dropdown button
  const button = document.createElement("button");
  button.className = "dropbtn";
  button.setAttribute("onclick", "toggleDropdown()");

  // Create the hamburger lines
  const line1 = document.createElement("div");
  line1.className = "line";
  const line2 = document.createElement("div");
  line2.className = "line";
  const line3 = document.createElement("div");
  line3.className = "line";

  // Append the lines to the button
  button.appendChild(line1);
  button.appendChild(line2);
  button.appendChild(line3);

  // Append the button to the dropdown container
  dropdown.appendChild(button);

  // Create the dropdown content
  const dropdownContent = document.createElement("div");
  dropdownContent.className = "dropdown-content";
  dropdownContent.id = "dropdown-menu";

  // Example menu items
  const menuItems = [
    { label: "Home", action: "#home" },
    { label: "Quran", action: "https://quran.com/" },
    { label: "Prayer Times", action: "#prayer-times" },
    { label: "Settings", action: "#settings" },
    { label: "Help", action: "#help" },
    { label: "Contact", action: "#contact" },
  ];

  menuItems.forEach((item) => {
    const menuLink = document.createElement("a");
    menuLink.textContent = item.label;
    menuLink.href = item.action;
    menuLink.className = "dropdown-item";
    dropdownContent.appendChild(menuLink);
  });

  // Append dropdown content to the dropdown container
  dropdown.appendChild(dropdownContent);

  // Append the dropdown to the body (or another container)
  document.body.appendChild(dropdown);
}

// Function to toggle the dropdown visibility
function toggleDropdown() {
  const menu = document.getElementById("dropdown-menu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

// Close the dropdown when clicking outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn") && !event.target.matches(".line")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

// Initialize the dropdown after the DOM has loaded
document.addEventListener("DOMContentLoaded", createDropdown);




startTracking();
