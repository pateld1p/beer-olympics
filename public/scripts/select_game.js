import { db } from '/scripts/firebase.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

let selectedGame; // Declare selectedGame at a higher scope

document.getElementById('confirmGameButton').onclick = async function() {
    selectedGame = document.querySelector('.game-item.selected')?.getAttribute('data-game');

    if (!selectedGame) {
        alert("Please select a game.");
        return;
    }

    // Show modal for player selection
    const playerSelectionModal = document.getElementById('playerSelectionModal');
    const teamAPlayersList = document.getElementById('teamAPlayersList');
    const teamBPlayersList = document.getElementById('teamBPlayersList');

    // Clear previous selections
    teamAPlayersList.innerHTML = '';
    teamBPlayersList.innerHTML = '';

    // Fetch players from Firestore
    try {
        const playersSnapshot = await getDocs(collection(db, "players"));
        
        console.log("Fetched Players from Firestore:");
        playersSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(data); // Log each player document

            const playerItem = document.createElement('div');
            playerItem.classList.add('player-item');

            // Create a checkbox for each player
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = data.name; // Using player name as the checkbox id
            checkbox.setAttribute('data-team', data.team); // Store team info

            // Add label for checkbox
            const label = document.createElement('label');
            label.htmlFor = data.name;
            label.textContent = data.name;

            // Append checkbox and label to player item
            playerItem.appendChild(checkbox);
            playerItem.appendChild(label);

            // Append player to respective team list based on team field
            if (data.team === "teamA") {
                teamAPlayersList.appendChild(playerItem); // Ensure team matches case
                console.log(`Added ${data.name} to Team A`); // Log for verification
            } else if (data.team === "teamB") {
                teamBPlayersList.appendChild(playerItem); // Ensure team matches case
                console.log(`Added ${data.name} to Team B`); // Log for verification
            }
        });

        // Show the modal
        playerSelectionModal.style.display = 'block';
        console.log("Modal is now displayed with players loaded.");

    } catch (error) {
        console.error("Error fetching players: ", error);
    }
};

// Handle starting the game
document.getElementById('startGameButton').onclick = async function() {
    // Gather selected players
    const selectedPlayersA = Array.from(document.querySelectorAll('#teamAPlayersList input[type="checkbox"]:checked')).map(checkbox => checkbox.nextSibling.textContent);
    const selectedPlayersB = Array.from(document.querySelectorAll('#teamBPlayersList input[type="checkbox"]:checked')).map(checkbox => checkbox.nextSibling.textContent);

    console.log("Selected Players A:", selectedPlayersA);
    console.log("Selected Players B:", selectedPlayersB);

    // Validate selections
    if (selectedPlayersA.length === 0 || selectedPlayersB.length === 0) {
        alert("Please select at least one player from each team.");
        return;
    }

    try {
        // Save game details in Firestore
        const docRef = await addDoc(collection(db, "games"), {
            game: selectedGame,
            playersA: selectedPlayersA,
            playersB: selectedPlayersB,
            winner: "", // Placeholder for winner
            timestamp: new Date()
        });
        console.log("Game saved with ID:", docRef.id);
        
        // Redirect to the winner selection page
        window.location.href = `/select_winner?gameId=${docRef.id}`;
    } catch (error) {
        console.error("Error saving game: ", error);
    }
    playerSelectionModal.style.display = 'none'; // Hide the modal after starting the game
};

// Add click event listeners for game items
document.querySelectorAll('.game-item').forEach(item => {
    item.onclick = function() {
        // Deselect any previously selected item
        const previousSelected = document.querySelector('.game-item.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // Select the clicked item
        this.classList.add('selected');

        // Enable the confirm button
        document.getElementById('confirmGameButton').disabled = false;
    };
});

// Hide modal when clicking anywhere outside of it
window.onclick = function(event) {
    const modal = document.getElementById('playerSelectionModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
