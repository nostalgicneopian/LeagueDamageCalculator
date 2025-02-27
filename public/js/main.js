// DOM elements
const mainhandSelect = document.getElementById('mainhand-select');
const offhandSelect = document.getElementById('offhand-select');
const accessorySelect = document.getElementById('accessory-select');
const abilitySelect = document.getElementById('ability-select');
const calculateBtn = document.getElementById('calculate-btn');
const effectsList = document.getElementById('effects-list');

// Detail display elements
const mainhandDetails = document.getElementById('mainhand-details');
const offhandDetails = document.getElementById('offhand-details');
const accessoryDetails = document.getElementById('accessory-details');
const abilityDetails = document.getElementById('ability-details');

// Result elements for each element
const elements = ['fire', 'water', 'light', 'dark', 'air', 'earth', 'physical'];
const minElements = {};
const maxElements = {};

elements.forEach(element => {
    minElements[element] = document.getElementById(`min-${element}`);
    maxElements[element] = document.getElementById(`max-${element}`);
});

// Initialize when page loads - using the global itemsData from data.js
document.addEventListener('DOMContentLoaded', () => {
    // Populate dropdowns
    populateDropdowns();
    
    // Add event listeners
    mainhandSelect.addEventListener('change', () => updateItemDetails('mainhand'));
    offhandSelect.addEventListener('change', () => updateItemDetails('offhand'));
    accessorySelect.addEventListener('change', () => updateItemDetails('accessory'));
    abilitySelect.addEventListener('change', () => updateItemDetails('ability'));
    calculateBtn.addEventListener('click', calculateDamage);
});

// Populate dropdown menus with items
function populateDropdowns() {
    // Filter weapons by slot
    const mainHandWeapons = itemsData.weapons.filter(weapon => weapon.slot === 'main');
    const offHandWeapons = itemsData.weapons.filter(weapon => weapon.slot === 'offhand');
    const accessories = itemsData.weapons.filter(weapon => weapon.slot === 'accessory');
    
    // Populate main hand dropdown
    mainHandWeapons.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon.id;
        option.textContent = weapon.name;
        mainhandSelect.appendChild(option);
    });
    
    // Populate off hand dropdown
    offHandWeapons.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon.id;
        option.textContent = weapon.name;
        offhandSelect.appendChild(option);
    });
    
    // Populate accessory dropdown
    accessories.forEach(accessory => {
        const option = document.createElement('option');
        option.value = accessory.id;
        option.textContent = accessory.name;
        accessorySelect.appendChild(option);
    });
    
    // Populate abilities dropdown
    itemsData.abilities.forEach(ability => {
        const option = document.createElement('option');
        option.value = ability.id;
        option.textContent = ability.name;
        abilitySelect.appendChild(option);
    });
}

// Update item details when selection changes
function updateItemDetails(slotType) {
    let selectedId, detailsElement, item;
    
    if (slotType === 'mainhand') {
        selectedId = mainhandSelect.value;
        detailsElement = mainhandDetails;
        item = itemsData.weapons.find(weapon => weapon.id === selectedId);
    } else if (slotType === 'offhand') {
        selectedId = offhandSelect.value;
        detailsElement = offhandDetails;
        item = itemsData.weapons.find(weapon => weapon.id === selectedId);
    } else if (slotType === 'accessory') {
        selectedId = accessorySelect.value;
        detailsElement = accessoryDetails;
        item = itemsData.weapons.find(weapon => weapon.id === selectedId);
    } else if (slotType === 'ability') {
        selectedId = abilitySelect.value;
        detailsElement = abilityDetails;
        item = itemsData.abilities.find(ability => ability.id === selectedId);
    }
    
    // Clear previous details
    detailsElement.innerHTML = '';
    
    if (!item) return;
    
    if (slotType === 'ability') {
        // Display ability details
        detailsElement.innerHTML = `
            <p><strong>Type:</strong> ${item.damageType.charAt(0).toUpperCase() + item.damageType.slice(1)}</p>
            <p><strong>Damage:</strong> ${item.minimumIcons} - ${item.maximumIcons} icons</p>
            <p><strong>Effect:</strong> ${item.effect}</p>
        `;
    } else {
        // Display weapon details
        let detailsHTML = '<p><strong>Element Icons:</strong></p>';
        
        elements.forEach(element => {
            const min = item[`minimum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`];
            const max = item[`maximum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`];
            
            if (min > 0 || max > 0) {
                detailsHTML += `<p>${element.charAt(0).toUpperCase() + element.slice(1)}: ${min} - ${max}</p>`;
            }
        });
        
        if (item.specialEffect) {
            detailsHTML += `<p><strong>Special Effect:</strong> ${item.specialEffect}</p>`;
        }
        
        detailsElement.innerHTML = detailsHTML;
    }
}

// Calculate total damage based on selected items
function calculateDamage() {
    const mainhandId = mainhandSelect.value;
    const offhandId = offhandSelect.value;
    const accessoryId = accessorySelect.value;
    const abilityId = abilitySelect.value;
    
    // Get the selected items
    const mainhand = itemsData.weapons.find(weapon => weapon.id === mainhandId);
    const offhand = itemsData.weapons.find(weapon => weapon.id === offhandId);
    const accessory = itemsData.weapons.find(weapon => weapon.id === accessoryId);
    const ability = itemsData.abilities.find(ability => ability.id === abilityId);
    
    // Clear the effects list
    effectsList.innerHTML = '';
    
    // Initialize results
    const results = {};
    elements.forEach(element => {
        results[element] = {
            min: 0,
            max: 0
        };
    });
    
    // Calculate damage for each element from weapons
    [mainhand, offhand, accessory].forEach(item => {
        if (item) {
            elements.forEach(element => {
                const minKey = `minimum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`;
                const maxKey = `maximum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`;
                
                results[element].min += item[minKey] || 0;
                results[element].max += item[maxKey] || 0;
            });
            
            // Add special effects to the list
            if (item.specialEffect) {
                const effectItem = document.createElement('li');
                effectItem.textContent = `${item.name}: ${item.specialEffect}`;
                effectsList.appendChild(effectItem);
            }
        }
    });
    
    // Add ability damage if selected
    if (ability) {
        // For abilities that deal damage
        if (ability.damageType !== 'heal') {
            results[ability.damageType].min += ability.minimumIcons || 0;
            results[ability.damageType].max += ability.maximumIcons || 0;
        } else {
            // For healing abilities, add to light damage
            results['light'].min += ability.minimumIcons || 0;
            results['light'].max += ability.maximumIcons || 0;
        }
        
        // Add ability effect to the list
        const abilityEffectItem = document.createElement('li');
        abilityEffectItem.textContent = `${ability.name}: ${ability.effect}`;
        effectsList.appendChild(abilityEffectItem);
    }
    
    // Update the UI with calculated results
    elements.forEach(element => {
        minElements[element].textContent = results[element].min;
        maxElements[element].textContent = results[element].max;
    });
}