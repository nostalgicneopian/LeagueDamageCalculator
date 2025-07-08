const mainhandSelect = document.getElementById('mainhand-select');
const offhandSelect = document.getElementById('offhand-select');
const abilitySelect = document.getElementById('ability-select');
const effectsList = document.getElementById('effects-list');
const formStatus = document.getElementById('form-status');

const mainhandDetails = document.getElementById('mainhand-details');
const offhandDetails = document.getElementById('offhand-details');
const abilityDetails = document.getElementById('ability-details');

const elements = ['fire', 'water', 'light', 'dark', 'air', 'earth', 'physical'];
const minElements = {};
const maxElements = {};
const defenseMinElements = {};
const defenseMaxElements = {};

elements.forEach(element => {
    minElements[element] = document.getElementById(`min-${element}`);
    maxElements[element] = document.getElementById(`max-${element}`);
    defenseMinElements[element] = document.getElementById(`defense-min-${element}`);
    defenseMaxElements[element] = document.getElementById(`defense-max-${element}`);
});

document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    mainhandSelect.addEventListener('change', () => {
        updateItemDetails('mainhand');
        calculateDamage();
    });
    offhandSelect.addEventListener('change', () => {
        updateItemDetails('offhand');
        calculateDamage();
    });
    abilitySelect.addEventListener('change', () => {
        updateItemDetails('ability');
        calculateDamage();
    });
    
    // Initial calculation to show default state
    calculateDamage();
});

function populateDropdowns() {
    const mainHandWeapons = itemsData.weapons;
    const offHandWeapons = itemsData.weapons;
    
    mainHandWeapons.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon.id;
        option.textContent = weapon.name;
        mainhandSelect.appendChild(option);
    });
    
    offHandWeapons.forEach(weapon => {
        const option = document.createElement('option');
        option.value = weapon.id;
        option.textContent = weapon.name;
        offhandSelect.appendChild(option);
    });
    
    itemsData.abilities.forEach(ability => {
        const option = document.createElement('option');
        option.value = ability.id;
        option.textContent = ability.name;
        abilitySelect.appendChild(option);
    });
}

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
    } else if (slotType === 'ability') {
        selectedId = abilitySelect.value;
        detailsElement = abilityDetails;
        item = itemsData.abilities.find(ability => ability.id === selectedId);
    }

    detailsElement.innerHTML = '';
    
    if (!item) return;
    
    let detailsHTML = '<p><strong>Element Icons:</strong></p>';
    
    elements.forEach(element => {
        const min = item[`minimum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`];
        const max = item[`maximum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`];
        
        if (min > 0 || max > 0) {
            detailsHTML += `<p>${element.charAt(0).toUpperCase() + element.slice(1)}: ${min} - ${max}</p>`;
        }
    });
    
    if (item.effects) {
        for( const effect of item.effects) {
            detailsHTML += `<p><strong>Effect:</strong> ${effect}</p>`;
        }
    }
    
    detailsElement.innerHTML = detailsHTML;
}

function calculateDamage() {
    const mainhandId = mainhandSelect.value;
    const offhandId = offhandSelect.value;
    const abilityId = abilitySelect.value;
    
    const mainhand = itemsData.weapons.find(weapon => weapon.id === mainhandId);
    const offhand = itemsData.weapons.find(weapon => weapon.id === offhandId);
    const ability = itemsData.abilities.find(ability => ability.id === abilityId);
    
    effectsList.innerHTML = '';
    
    const results = {};
    elements.forEach(element => {
        results[`offense${element.charAt(0).toUpperCase() + element.slice(1)}`] = {
            min: 0,
            max: 0
        };
        results[`defense${element.charAt(0).toUpperCase() + element.slice(1)}`] = {
            min: 0,
            max: 0
        };
    });
    
    [mainhand, offhand, ability].forEach(item => {
        if (item) {
            elements.forEach(element => {
                const offenseKeyMin = `offense${element.charAt(0).toUpperCase() + element.slice(1)}Min`;
                const offenseKeyMax = `offense${element.charAt(0).toUpperCase() + element.slice(1)}Max`;
                const defenseKeyMin = `defense${element.charAt(0).toUpperCase() + element.slice(1)}Min`;
                const defenseKeyMax = `defense${element.charAt(0).toUpperCase() + element.slice(1)}Max`;
                const offenseKeyResult = `offense${element.charAt(0).toUpperCase() + element.slice(1)}`;
                const defenseKeyResult = `defense${element.charAt(0).toUpperCase() + element.slice(1)}`;
                
                results[offenseKeyResult].min += item[offenseKeyMin] || 0;
                results[offenseKeyResult].max += item[offenseKeyMax] || 0;
                results[defenseKeyResult].min += item[defenseKeyMin] || 0;
                results[defenseKeyResult].max += item[defenseKeyMax] || 0;
            });
            
            if (item.effects) {
                for( const effect of item.effects) {
                    const effectItem = document.createElement('li');
                    effectItem.textContent = `${item.name}: ${effect}`;
                    effectsList.appendChild(effectItem);
                }
            }
        }
    });
    
    elements.forEach(element => {
        const offenseKeyResult = `offense${element.charAt(0).toUpperCase() + element.slice(1)}`;
        const defenseKeyResult = `defense${element.charAt(0).toUpperCase() + element.slice(1)}`;
        minElements[element].textContent = results[offenseKeyResult].min;
        maxElements[element].textContent = results[offenseKeyResult].max;
        defenseMinElements[element].textContent = results[defenseKeyResult].min;
        defenseMaxElements[element].textContent = results[defenseKeyResult].max;
    });
}
