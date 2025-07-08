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
    
    let detailsHTML = '';
    let hasOffenseIcons = false;
    let hasDefenseIcons = false;
    
    // Helper function to get the correct icon filename
    function getIconFileName(element, isDefense = false) {
        const iconName = element === 'dark' ? 'darkness' : element;
        return isDefense ? `blocked-${iconName}-icon.png` : `${iconName}-icon.png`;
    }
    
    // Helper function to generate icon HTML
    function generateIconsHTML(count, iconPath) {
        let iconsHTML = '';
        for (let i = 0; i < count; i++) {
            iconsHTML += `<img src="images/${iconPath}" alt="" style="width: 20px; height: 20px; margin-right: 2px;">`;
        }
        return iconsHTML;
    }
    
    // Check for offense icons first
    elements.forEach(element => {
        const offenseMin = item[`offense${element.charAt(0).toUpperCase() + element.slice(1)}Min`] || 0;
        const offenseMax = item[`offense${element.charAt(0).toUpperCase() + element.slice(1)}Max`] || 0;
        
        if (offenseMin > 0 || offenseMax > 0) {
            if (!hasOffenseIcons) {
                detailsHTML += `<p><strong>Offense Icons:</strong></p>`;
                hasOffenseIcons = true;
            }
            
            const iconPath = getIconFileName(element, false);
            const iconsHTML = generateIconsHTML(offenseMin, iconPath);
            detailsHTML += `<p>${iconsHTML} ${offenseMin}-${offenseMax}</p>`;
        }
    });
    
    // Check for defense icons
    elements.forEach(element => {
        const defenseMin = item[`defense${element.charAt(0).toUpperCase() + element.slice(1)}Min`] || 0;
        const defenseMax = item[`defense${element.charAt(0).toUpperCase() + element.slice(1)}Max`] || 0;
        
        if (defenseMin > 0 || defenseMax > 0) {
            if (!hasDefenseIcons) {
                detailsHTML += `<p><strong>Defense Icons:</strong></p>`;
                hasDefenseIcons = true;
            }
            
            const iconPath = getIconFileName(element, true);
            const iconsHTML = generateIconsHTML(defenseMin, iconPath);
            detailsHTML += `<p>${iconsHTML} ${defenseMin}-${defenseMax}</p>`;
        }
    });
    
    // Add effects
    if (item.effects && item.effects.length > 0) {
        detailsHTML += `<p><strong>Effects:</strong></p>`;
        for (const effect of item.effects) {
            detailsHTML += `<p>• ${effect}</p>`;
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
