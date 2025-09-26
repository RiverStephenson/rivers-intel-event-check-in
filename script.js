// Necessary DOM elements
const form = document.getElementById('checkInForm');
const nameInput = document.getElementById('attendeeName');
const teamSelect = document.getElementById('teamSelect');

// Track attendance
let count = 0;
const maxCount = 50;


// Load saved state from localStorage
function loadState() {
    const saved = JSON.parse(localStorage.getItem('checkInState'));
    if (!saved) return;

    count = saved.count || 0;

    // Restore attendee count
    const attendeeCount = document.getElementById('attendeeCount');
    if (attendeeCount) attendeeCount.textContent = count;

    // Restore progress bar and percent
    const percentage = Math.round((count / maxCount) * 100);
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = percentage + '%';
    let percentLabel = document.getElementById('progressPercentLabel');
    if (!percentLabel) {
        percentLabel = document.createElement('span');
        percentLabel.id = 'progressPercentLabel';
        percentLabel.style.position = 'absolute';
        percentLabel.style.left = '8px';
        percentLabel.style.top = '50%';
        percentLabel.style.transform = 'translateY(-50%)';
        percentLabel.style.fontSize = '0.95em';
        percentLabel.style.color = '#555';
        percentLabel.style.opacity = '0.7';
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.position = 'relative';
            progressContainer.insertBefore(percentLabel, progressContainer.firstChild);
        }
    }
    percentLabel.textContent = percentage + '%';

    // Restore team counters
    ['water', 'zero', 'power'].forEach(team => {
        const teamCounter = document.getElementById(team + 'Count');
        if (teamCounter && saved.teamCounts && typeof saved.teamCounts[team] === 'number') {
            teamCounter.textContent = saved.teamCounts[team];
        }
        // Restore attendee lists
        const teamList = document.getElementById(team + 'List');
        if (teamList && saved.teamLists && Array.isArray(saved.teamLists[team])) {
            teamList.innerHTML = '';
            saved.teamLists[team].forEach(name => {
                const li = document.createElement('li');
                li.textContent = name;
                teamList.appendChild(li);
            });
        }
    });

    // Restore celebration state and disable inputs if needed
    if (count >= maxCount) {
        let celebrationDiv = document.getElementById('celebrationMessage');
        if (!celebrationDiv) {
            // Get all team counts
            const waterCount = parseInt(document.getElementById('waterCount').textContent) || 0;
            const zeroCount = parseInt(document.getElementById('zeroCount').textContent) || 0;
            const powerCount = parseInt(document.getElementById('powerCount').textContent) || 0;
            const maxScore = Math.max(waterCount, zeroCount, powerCount);
            const winners = [];
            if (waterCount === maxScore) winners.push({ name: "Water 💧", color: "#e8f7fc" });
            if (zeroCount === maxScore) winners.push({ name: "Zero 🌱", color: "#ecfdf3" });
            if (powerCount === maxScore) winners.push({ name: "Power ⚡", color: "#fff7ed" });
            let celebrationMsg = "";
            if (winners.length === 1) {
                celebrationMsg = `🎉 Team <strong style="color:#0071c5;">${winners[0].name}</strong> wins with <strong>${maxScore}</strong> check-ins! 🎉`;
            } else {
                celebrationMsg = `🎉 It's a tie! Winning teams: `;
                celebrationMsg += winners.map(w => `<strong style="color:#0071c5;">${w.name}</strong>`).join(", ");
                celebrationMsg += ` with <strong>${maxScore}</strong> check-ins each! 🎉`;
            }
            celebrationDiv = document.createElement('div');
            celebrationDiv.id = 'celebrationMessage';
            celebrationDiv.innerHTML = celebrationMsg;
            celebrationDiv.style.background = "#fffbe6";
            celebrationDiv.style.padding = "16px";
            celebrationDiv.style.borderRadius = "10px";
            celebrationDiv.style.marginTop = "18px";
            celebrationDiv.style.textAlign = "center";
            celebrationDiv.style.fontSize = "1.3em";
            celebrationDiv.style.fontWeight = "bold";
            celebrationDiv.style.border = "2px solid #ffe066";
            form.parentNode.insertBefore(celebrationDiv, form.nextSibling);
        }
        nameInput.disabled = true;
        teamSelect.disabled = true;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        nameInput.value = "";
        teamSelect.selectedIndex = 0;
    }

    // Show attendees section if there are any attendees
    if (saved.count > 0) {
        const attendeesSection = document.getElementById('attendeesSection');
        if (attendeesSection) attendeesSection.style.display = "block";
    }
}

// Save state to localStorage
function saveState() {
    const teamCounts = {
        water: parseInt(document.getElementById('waterCount').textContent) || 0,
        zero: parseInt(document.getElementById('zeroCount').textContent) || 0,
        power: parseInt(document.getElementById('powerCount').textContent) || 0
    };
    const teamLists = {
        water: Array.from(document.querySelectorAll('#waterList li')).map(li => li.textContent),
        zero: Array.from(document.querySelectorAll('#zeroList li')).map(li => li.textContent),
        power: Array.from(document.querySelectorAll('#powerList li')).map(li => li.textContent)
    };
    localStorage.setItem('checkInState', JSON.stringify({
        count,
        teamCounts,
        teamLists
    }));
}

// Reset welcome message on load
window.addEventListener('DOMContentLoaded', function() {
    // Remove welcome message if present
    const welcomeDiv = document.getElementById('welcomeMessage');
    if (welcomeDiv) welcomeDiv.remove();
    loadState();
});

// Handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Count increment
    count++;
    console.log("Total Check-Ins: " + count);

    // Update attendee count display
    const attendeeCount = document.getElementById('attendeeCount');
    if (attendeeCount) {
        attendeeCount.textContent = count;
    }

    // Update Progress Bar and percentage display
    const percentage = Math.round((count / maxCount) * 100);
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    // Show percentage at the start of the progress bar
    let percentLabel = document.getElementById('progressPercentLabel');
    if (!percentLabel) {
        percentLabel = document.createElement('span');
        percentLabel.id = 'progressPercentLabel';
        percentLabel.style.position = 'absolute';
        percentLabel.style.left = '8px';
        percentLabel.style.top = '50%';
        percentLabel.style.transform = 'translateY(-50%)';
        percentLabel.style.fontSize = '0.95em';
        percentLabel.style.color = '#555';
        percentLabel.style.opacity = '0.7';
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.style.position = 'relative';
            progressContainer.insertBefore(percentLabel, progressContainer.firstChild);
        }
    }
    percentLabel.textContent = percentage + '%';

    // Update team counter
    const team = teamSelect.value;
    const teamCounter = document.getElementById(team + 'Count');
    teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

    // Add attendee name under the corresponding team in the Attendees section
    let attendeeName = nameInput.value;
    attendeeName = attendeeName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    const teamList = document.getElementById(team + 'List');
    if (teamList) {
        // Show attendees section if hidden
        const attendeesSection = document.getElementById('attendeesSection');
        if (attendeesSection && attendeesSection.style.display === "none") {
            attendeesSection.style.display = "block";
        }
        const li = document.createElement('li');
        li.textContent = attendeeName;
        teamList.appendChild(li);
    }

    // Save state after updating lists and counters
    saveState();

    // Check for celebration after incrementing count
    if (count >= maxCount) {
        // Show celebration if not already shown
        let celebrationDiv = document.getElementById('celebrationMessage');
        if (!celebrationDiv) {
            // Get all team counts
            const waterCount = parseInt(document.getElementById('waterCount').textContent) || 0;
            const zeroCount = parseInt(document.getElementById('zeroCount').textContent) || 0;
            const powerCount = parseInt(document.getElementById('powerCount').textContent) || 0;

            // Find max score
            const maxScore = Math.max(waterCount, zeroCount, powerCount);

            // Find all teams with max score (for ties)
            const winners = [];
            if (waterCount === maxScore) winners.push({ name: "Water 💧", color: "#e8f7fc" });
            if (zeroCount === maxScore) winners.push({ name: "Zero 🌱", color: "#ecfdf3" });
            if (powerCount === maxScore) winners.push({ name: "Power ⚡", color: "#fff7ed" });

            // Build celebration message
            let celebrationMsg = "";
            if (winners.length === 1) {
                celebrationMsg = `🎉 Team <strong style="color:#0071c5;">${winners[0].name}</strong> wins with <strong>${maxScore}</strong> check-ins! 🎉`;
            } else {
                celebrationMsg = `🎉 It's a tie! Winning teams: `;
                celebrationMsg += winners.map(w => `<strong style="color:#0071c5;">${w.name}</strong>`).join(", ");
                celebrationMsg += ` with <strong>${maxScore}</strong> check-ins each! 🎉`;
            }

            // Show celebration message
            celebrationDiv = document.createElement('div');
            celebrationDiv.id = 'celebrationMessage';
            celebrationDiv.innerHTML = celebrationMsg;
            celebrationDiv.style.background = "#fffbe6";
            celebrationDiv.style.padding = "16px";
            celebrationDiv.style.borderRadius = "10px";
            celebrationDiv.style.marginTop = "18px";
            celebrationDiv.style.textAlign = "center";
            celebrationDiv.style.fontSize = "1.3em";
            celebrationDiv.style.fontWeight = "bold";
            celebrationDiv.style.border = "2px solid #ffe066";
            form.parentNode.insertBefore(celebrationDiv, form.nextSibling);
        }
        // Disable inputs and button
        nameInput.disabled = true;
        teamSelect.disabled = true;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // Clear inputs
        nameInput.value = "";
        teamSelect.selectedIndex = 0;

        // Save state after disabling
        saveState();

        return; // Prevent further check-ins
    }

    // Get input form values
    let name = nameInput.value;
    // Capitalize first letter of each word
    name = name.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    const teamName = teamSelect.selectedOptions[0].text;
    console.log(name, team);

    // Show welcome message
    const message = `Welcome, ${name}, to ${teamName}!`;

    // Choose icon for team
    let teamIcon = "";
    if (team === "water") teamIcon = "💧";
    else if (team === "zero") teamIcon = "🌱";
    else if (team === "power") teamIcon = "⚡";

    let welcomeDiv = document.getElementById('welcomeMessage');
    if (!welcomeDiv) {
        welcomeDiv = document.createElement('div');
        welcomeDiv.id = 'welcomeMessage';
        form.parentNode.insertBefore(welcomeDiv, form.nextSibling);
    }
    welcomeDiv.textContent = ""; // Clear previous content

    // Add message and icon
    welcomeDiv.append(
        document.createTextNode(message + " "),
        document.createTextNode(teamIcon)
    );

    // Set background color of message based on team
    let bgColor = "#e0ffe0"; 
    if (team === "water") bgColor = "#e8f7fc";
    else if (team === "zero") bgColor = "#ecfdf3";
    else if (team === "power") bgColor = "#fff7ed";
    welcomeDiv.style.background = bgColor;

    welcomeDiv.style.padding = "10px";
    welcomeDiv.style.borderRadius = "8px";
    welcomeDiv.style.marginTop = "10px";
    welcomeDiv.style.textAlign = "center";
    welcomeDiv.style.fontSize = "1.2em";

    // Reset form
    form.reset();

    // Remove celebration message if attendee count drops below cap (optional, for robustness)
    const celebrationDiv = document.getElementById('celebrationMessage');
    if (celebrationDiv && count < maxCount) celebrationDiv.remove();
});