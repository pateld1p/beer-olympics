import { db } from './firebase.js'; // Import the Firestore database
import { doc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js'; // Import Firestore functions

// Get the game ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('gameId');

document.getElementById('teamAWinButton').onclick = async function() {
    await updateGameWinner("Team A");
};

document.getElementById('teamBWinButton').onclick = async function() {
    await updateGameWinner("Team B");
};

async function updateGameWinner(winningTeam) {
    const gameRef = doc(db, "games", gameId);
    try {
        // Update the winner in the game document
        await updateDoc(gameRef, {
            winner: winningTeam
        });
        
        // Now, update the points for the winning team
        await updateTeamPoints(winningTeam);

        alert(`${winningTeam} has been recorded as the winner.`);
        window.location.href = '/'; 
    } catch (error) {
        console.error("Error updating winner: ", error);
    }
}

// Function to update team points
async function updateTeamPoints(winningTeam) {
    const pointsRef = doc(db, "teams", winningTeam); // Ensure this matches your Firestore document IDs
    try {
        // Use Firestore FieldValue for incrementing points
        await updateDoc(pointsRef, {
            points: increment(1) // Use the increment function properly
        });
        console.log(`${winningTeam} points updated successfully.`);
    } catch (error) {
        console.error("Error updating team points: ", error); // Log the error for debugging
    }
}
