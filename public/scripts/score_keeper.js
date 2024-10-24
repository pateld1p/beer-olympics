import { db } from '/scripts/firebase.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Function to fetch scores for Team A and Team B from the database
async function fetchScores() {
    let teamAScore = 0;
    let teamBScore = 0;

    try {
        // Fetch points for Team A
        const teamADoc = await getDoc(doc(db, "teams", "Team A")); // Adjust to your document IDs
        if (teamADoc.exists()) {
            teamAScore = teamADoc.data().points || 0; // Fetch points for Team A
        } else {
            console.log("No such document for Team A!");
        }

        // Fetch points for Team B
        const teamBDoc = await getDoc(doc(db, "teams", "Team B")); // Adjust to your document IDs
        if (teamBDoc.exists()) {
            teamBScore = teamBDoc.data().points || 0; // Fetch points for Team B
        } else {
            console.log("No such document for Team B!");
        }

        // Update the score displays
        document.getElementById('teamAScore').textContent = teamAScore;
        document.getElementById('teamBScore').textContent = teamBScore;

        console.log("Scores fetched: Team A -", teamAScore, ", Team B -", teamBScore);
    } catch (error) {
        console.error("Error fetching scores: ", error);
    }
}

// Attach event listeners to buttons when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners
    document.getElementById('fetchScoresButton').onclick = fetchScores;

    // Optional: Reset scores when starting a new game
    document.getElementById('startGameButton').onclick = function() {
        document.getElementById('teamAScore').textContent = '0';
        document.getElementById('teamBScore').textContent = '0';
        console.log("Scores reset for a new game.");
    };
});
