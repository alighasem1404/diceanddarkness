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

    // Apply damage and handle end-of-turn logic
    endTurnDamageApplication(playerAbility, enemyAbility);
});

// Function to apply damage considering resistances
function applyDamage(attacker, defender, damage, damageType) {
    if (!defender || !damage || !damageType) {
        console.error('Invalid parameters for applying damage!');
        return;
    }

    // Calculate resistance based on damage type
    const resistance = defender.resistances?.[damageType] || 0;
    const effectiveDamage = Math.max(damage * (1 - resistance), 0); // Adjust damage based on resistance

    // Apply the damage to the defender's health
    defender.health = Math.max(defender.health - effectiveDamage, 0); // Ensure health is not negative

    console.log(`${attacker.name} dealt ${effectiveDamage.toFixed(2)} ${damageType} damage to ${defender.name}.`);
    console.log(`${defender.name}'s remaining health: ${defender.health}`);
}

// Function to handle end-of-turn damage application
function endTurnDamageApplication(playerAbility, enemyAbility) {
    if (!playerAbility || !enemyAbility) {
        console.error('Abilities are missing for damage application!');
        return;
    }

    // Apply damage from player to enemy
    applyDamage(playerData, currentEnemy, playerAbility.damage, playerAbility.damage_type);

    // Apply damage from enemy to player
    applyDamage(currentEnemy, playerData, enemyAbility.damage, enemyAbility.damage_type);

    // Update the UI after applying damage
    updatePlayerUI();
    updateEnemyUI();

    // Check for end of combat
    if (playerData.health <= 0) {
        console.log('Player has been defeated!');
        alert('Game Over! The player has been defeated.');
    } else if (currentEnemy.health <= 0) {
        console.log(`${currentEnemy.name} has been defeated!`);
        alert(`${currentEnemy.name} has been defeated!`);
    }
}

// Load character data on page load
loadCharacterData();

// Function to reset the battle
function resetBattle() {
    // Reset turn counter
    currentTurn = 1;
    document.getElementById("turnConuter").textContent = currentTurn;

    // Reload player and enemy data
    loadCharacterData();

    // Clear UI elements for dice and abilities
    document.getElementById("player-dice").innerHTML = "";
    document.getElementById("enemy-dice").innerHTML = "";

    console.log("Battle has been reset.");
}

// Add event listener to reset button
document.getElementById("reset-button").addEventListener("click", resetBattle);




