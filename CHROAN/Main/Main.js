const qiblaCoordinates = { lat: 21.4225, lon: 39.8262 }; // Coordinates of the Kaaba (Mecca)

let userLat, userLon;
let deviceOrientation = 0; // In degrees, relative to North

// Start tracking the location and orientation
function startTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
      userLat = position.coords.latitude;
      userLon = position.coords.longitude;
      showPosition();
      getPrayerTimes(userLat, userLon); // Get prayer times when the location updates
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

// Fetch prayer times using the Aladhan API based on user's location
function getPrayerTimes(lat, lon) {
  const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`; // Method 2 is for ISNA (standard calculation method)

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const timings = data.data.timings;
      displayPrayerTimes(timings);
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

// Initialize the tracking
startTracking();
// (Existing JavaScript code here...)

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
      menuLink.href = '#settings'; // Update with the correct path or anchor
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

function createDropdown() {
  // Select the dropdown element using its class
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown) {
    console.error("Dropdown container not found!");
    return;
  }

  // Create the dropdown button with lines
  const button = document.createElement("button");
  button.className = "dropbtn";
  button.setAttribute("onclick", "toggleDropdown()");

  const line1 = document.createElement("div");
  line1.className = "line";
  const line2 = document.createElement("div");
  line2.className = "line";
  const line3 = document.createElement("div");
  line3.className = "line";

  button.appendChild(line1);
  button.appendChild(line2);
  button.appendChild(line3);

  
  menuItems.forEach((item) => {
    const menuButton = document.createElement("button");
    menuButton.innerText = item.label;

    if (item.action.startsWith("http")) {
      menuButton.onclick = () => {
        window.location.href = item.action;
      };
    } else {
      menuButton.onclick = () => navigateTo(item.action);
    }

    dropdownContent.appendChild(menuButton);
  });

  // Append button and dropdown content to the dropdown container
  dropdown.appendChild(button);
  dropdown.appendChild(dropdownContent);
}

function toggleDropdown() {
  const menu = document.getElementById("dropdown-menu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

function navigateTo(section) {
  alert(`Navigating to ${section}`);
}

// Ensure the dropdown is created after the DOM is loaded
document.addEventListener("DOMContentLoaded", createDropdown);

