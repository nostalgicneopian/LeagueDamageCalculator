const mainhandSelect = document.getElementById('mainhand-select');
const offhandSelect = document.getElementById('offhand-select');
const accessorySelect = document.getElementById('accessory-select');
const abilitySelect = document.getElementById('ability-select');
const calculateBtn = document.getElementById('calculate-btn');
const effectsList = document.getElementById('effects-list');
const addItemForm = document.getElementById('add-item-form');
const formStatus = document.getElementById('form-status');

const mainhandDetails = document.getElementById('mainhand-details');
const offhandDetails = document.getElementById('offhand-details');
const accessoryDetails = document.getElementById('accessory-details');
const abilityDetails = document.getElementById('ability-details');

const elements = ['fire', 'water', 'light', 'dark', 'air', 'earth', 'physical'];
const minElements = {};
const maxElements = {};

elements.forEach(element => {
    minElements[element] = document.getElementById(`min-${element}`);
    maxElements[element] = document.getElementById(`max-${element}`);
});

document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    mainhandSelect.addEventListener('change', () => updateItemDetails('mainhand'));
    offhandSelect.addEventListener('change', () => updateItemDetails('offhand'));
    accessorySelect.addEventListener('change', () => updateItemDetails('accessory'));
    abilitySelect.addEventListener('change', () => updateItemDetails('ability'));
    calculateBtn.addEventListener('click', calculateDamage);
    addItemForm.addEventListener('submit', handleFormSubmit);
});

function populateDropdowns() {
    const mainHandWeapons = itemsData.weapons.filter(weapon => weapon.slot === 'main');
    const offHandWeapons = itemsData.weapons.filter(weapon => weapon.slot === 'offhand');
    const accessories = itemsData.weapons.filter(weapon => weapon.slot === 'accessory');
    
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
    
    accessories.forEach(accessory => {
        const option = document.createElement('option');
        option.value = accessory.id;
        option.textContent = accessory.name;
        accessorySelect.appendChild(option);
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
    } else if (slotType === 'accessory') {
        selectedId = accessorySelect.value;
        detailsElement = accessoryDetails;
        item = itemsData.weapons.find(weapon => weapon.id === selectedId);
    } else if (slotType === 'ability') {
        selectedId = abilitySelect.value;
        detailsElement = abilityDetails;
        item = itemsData.abilities.find(ability => ability.id === selectedId);
    }
    
    detailsElement.innerHTML = '';
    
    if (!item) return;
    
    if (slotType === 'ability') {
        detailsElement.innerHTML = `
            <p><strong>Type:</strong> ${item.damageType.charAt(0).toUpperCase() + item.damageType.slice(1)}</p>
            <p><strong>Damage:</strong> ${item.minimumIcons} - ${item.maximumIcons} icons</p>
            <p><strong>Effect:</strong> ${item.effect}</p>
        `;
    } else {
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

function calculateDamage() {
    const mainhandId = mainhandSelect.value;
    const offhandId = offhandSelect.value;
    const accessoryId = accessorySelect.value;
    const abilityId = abilitySelect.value;
    
    const mainhand = itemsData.weapons.find(weapon => weapon.id === mainhandId);
    const offhand = itemsData.weapons.find(weapon => weapon.id === offhandId);
    const accessory = itemsData.weapons.find(weapon => weapon.id === accessoryId);
    const ability = itemsData.abilities.find(ability => ability.id === abilityId);
    
    effectsList.innerHTML = '';
    
    const results = {};
    elements.forEach(element => {
        results[element] = {
            min: 0,
            max: 0
        };
    });
    
    [mainhand, offhand, accessory].forEach(item => {
        if (item) {
            elements.forEach(element => {
                const minKey = `minimum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`;
                const maxKey = `maximum${element.charAt(0).toUpperCase() + element.slice(1)}Icons`;
                
                results[element].min += item[minKey] || 0;
                results[element].max += item[maxKey] || 0;
            });
            
            if (item.specialEffect) {
                const effectItem = document.createElement('li');
                effectItem.textContent = `${item.name}: ${item.specialEffect}`;
                effectsList.appendChild(effectItem);
            }
        }
    });
    
    if (ability) {
        if (ability.damageType !== 'heal') {
            results[ability.damageType].min += ability.minimumIcons || 0;
            results[ability.damageType].max += ability.maximumIcons || 0;
        } else {
            results['light'].min += ability.minimumIcons || 0;
            results['light'].max += ability.maximumIcons || 0;
        }
        
        const abilityEffectItem = document.createElement('li');
        abilityEffectItem.textContent = `${ability.name}: ${ability.effect}`;
        effectsList.appendChild(abilityEffectItem);
    }
    
    elements.forEach(element => {
        minElements[element].textContent = results[element].min;
        maxElements[element].textContent = results[element].max;
    });
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const newItem = {
        id: document.getElementById('item-id').value,
        name: document.getElementById('item-name').value,
        type: document.getElementById('item-type').value,
        tags: document.getElementById('item-tags').value.split(',').map(tag => tag.trim()),
        description: document.getElementById('item-description').value,
        minimumFireIcons: parseInt(document.getElementById('item-min-fire').value),
        maximumFireIcons: parseInt(document.getElementById('item-max-fire').value),
        minimumWaterIcons: parseInt(document.getElementById('item-min-water').value),
        maximumWaterIcons: parseInt(document.getElementById('item-max-water').value),
        minimumLightIcons: parseInt(document.getElementById('item-min-light').value),
        maximumLightIcons: parseInt(document.getElementById('item-max-light').value),
        minimumDarkIcons: parseInt(document.getElementById('item-min-dark').value),
        maximumDarkIcons: parseInt(document.getElementById('item-max-dark').value),
        minimumAirIcons: parseInt(document.getElementById('item-min-air').value),
        maximumAirIcons: parseInt(document.getElementById('item-max-air').value),
        minimumEarthIcons: parseInt(document.getElementById('item-min-earth').value),
        maximumEarthIcons: parseInt(document.getElementById('item-max-earth').value),
        minimumPhysicalIcons: parseInt(document.getElementById('item-min-physical').value),
        maximumPhysicalIcons: parseInt(document.getElementById('item-max-physical').value),
        specialEffects: document.getElementById('item-special-effects').value.split(',').map(effect => effect.trim())
    };
    
    itemsData.weapons.push(newItem);
    formStatus.textContent = 'Item added successfully!';
    formStatus.style.color = 'green';
    addItemForm.reset();
    populateDropdowns();
}