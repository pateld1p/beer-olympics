import { db } from './firebase.js'; // Import the Firestore database
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Function to add player to Firestore
async function addPlayer(team) {
    const playerName = prompt(`Enter player name for ${team === 'teamA' ? 'Team A' : 'Team B'}:`);

    if (playerName && playerName.trim() !== "") {
        try {
            await addDoc(collection(db, "players"), {
                name: playerName,
                team: team
            });
            // Add player to the DOM
            const teamPlayersList = document.getElementById(`${team}Players`);
            const newPlayerItem = document.createElement('li');
            newPlayerItem.textContent = playerName;
            teamPlayersList.appendChild(newPlayerItem);
        } catch (error) {
            console.error("Error adding player: ", error);
        }
    } else {
        alert("Please enter a valid player name.");
    }
}

// Expose addPlayer function globally
window.addPlayer = addPlayer;

// Function to load players from Firestore on page load
async function loadPlayers() {
    try {
        const querySnapshot = await getDocs(collection(db, "players"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const teamPlayersList = document.getElementById(`${data.team}Players`);
            if (teamPlayersList) {  // Check if the element exists
                const playerItem = document.createElement('li');
                playerItem.textContent = data.name;
                teamPlayersList.appendChild(playerItem);
            } else {
                console.error(`No list found for team: ${data.team}`);
            }
        });
    } catch (error) {
        console.error("Error loading players: ", error);
    }
}

// Call loadPlayers when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadPlayers);
