let currentTurn = 1; // Initialize the turn counter
let playerData = null;
let allEnemiesData = null; // Store all enemies here
let currentEnemy = null; // Store the currently selected enemy here

// Function to assign a specific enemy by name
function assignEnemyByName(name) {
    if (!Array.isArray(allEnemiesData)) {
        console.error('Enemy data is not an array!');
        return;
    }

    const enemy = allEnemiesData.find(e => e.name === name);
    if (!enemy) {
        console.error(`Enemy with name "${name}" not found!`);
        return;
    }

    currentEnemy = enemy; // Assign the specific enemy to currentEnemy
    console.log(`Assigned Enemy:`, currentEnemy);

    // Update the UI with the assigned enemy's data
    updateEnemyUI();
}

// Function to update the player data in the UI
function updatePlayerUI() {
    if (!playerData) {
        console.error('No player data to display!');
        return;
    }

    // Update the player box with the player's name and stats
    document.getElementById("player-box").innerHTML = 
        `${playerData.name}, ` + 
        `${playerData.type}, ` + `<br>` +
        `Health: ${playerData.health || 'N/A'}, ` +
        `Armor: ${playerData.defense.armor}, ` +
        `Dodge: ${playerData.defense.dodge_chance * 100}%`;
}

// Function to update the enemy data in the UI
function updateEnemyUI() {
    if (!currentEnemy) {
        console.error('No enemy data to display!');
        return;
    }

    // Update the enemy box with the assigned enemy's name and stats
    document.getElementById("enemy-box").innerHTML = 
        `${currentEnemy.name}, ` + 
        `${currentEnemy.type}, ` + `<br>` +
        `Health: ${currentEnemy.health || 'N/A'}, ` +
        `Armor: ${currentEnemy.defense.armor}, ` +
        `Dodge: ${currentEnemy.defense.dodge_chance * 100}%`;
}

// Load JSON data for player and enemy
async function loadCharacterData() {
    try {
        const playerResponse = await fetch('./assets/json/activePlayer.json'); // Updated path
        playerData = await playerResponse.json();

        const enemyResponse = await fetch('./assets/json/enemies.json'); // Updated path
        allEnemiesData = await enemyResponse.json(); // Load all enemies into allEnemiesData

        console.log('Player Data:', playerData);
        console.log('Enemy Data:', allEnemiesData);

        // Update the player UI after loading the data
        updatePlayerUI();

        // Assign the enemy to "Wolf" after data is loaded
        assignEnemyByName("Wolf");
    } catch (error) {
        console.error('Error loading character data:', error);
    }
}

// Roll dice and display results
document.getElementById("roll-button").addEventListener("click", () => {
    if (!playerData || !currentEnemy || !currentEnemy.d6_actions) {
        console.error('Character data not loaded yet or enemy not assigned!');
        return;
    }

    // Increment the turn counter
    currentTurn++;
    document.getElementById("turnConuter").textContent = currentTurn;

    // Generate random numbers for player and enemy dice
    const playerDiceRoll = Math.floor(Math.random() * 6) + 1;
    const enemyDiceRoll = Math.floor(Math.random() * 6) + 1;

    // Get the abilities based on the dice rolls
    const playerAbility = playerData.d6_actions[playerDiceRoll];
    console.log(`Player rolled ${playerDiceRoll} and got ability:`, playerAbility);
    const enemyAbility = currentEnemy.d6_actions[enemyDiceRoll];
    console.log(`Enemy rolled ${enemyDiceRoll} and got ability:`, enemyAbility);

    // Format the ability effects
    const formatEffect = (effect) => {
        if (!effect) return "No effect";
        if (effect.includes("_chance_")) {
            const [effectName, chance] = effect.split("_chance_");
            return `${effectName.replace("_", " ")} (${chance * 100}% chance)`;
        }
        return effect.replace("_", " ");
    };

    // Update the dice text and abilities for player and enemy
    document.getElementById("player-dice").innerHTML = 
        `${playerAbility.name} ` + `<br>` +
        `${playerAbility.damage} ${playerAbility.damage_type} damage` + `<br>` +
        `${formatEffect(playerAbility.effect_name)}`;

    document.getElementById("enemy-dice").innerHTML = 
        `${enemyAbility.name}` + `<br>` +
        `${enemyAbility.damage} ${enemyAbility.damage_type} damage` + `<br>` +
        `${formatEffect(enemyAbility.effect_name)}`;
});

// Load character data on page load
loadCharacterData();