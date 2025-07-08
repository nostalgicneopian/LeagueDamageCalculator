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
    const mainHandWeapons = itemsData.weapons;
    const offHandWeapons = itemsData.weapons;
    const accessories = itemsData.accessories || [];
    
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
        minimumOffensiveFireIcons: parseInt(document.getElementById('item-min-offensive-fire').value),
        maximumOffensiveFireIcons: parseInt(document.getElementById('item-max-offensive-fire').value),
        minimumOffensiveWaterIcons: parseInt(document.getElementById('item-min-offensive-water').value),
        maximumOffensiveWaterIcons: parseInt(document.getElementById('item-max-offensive-water').value),
        minimumOffensiveLightIcons: parseInt(document.getElementById('item-min-offensive-light').value),
        maximumOffensiveLightIcons: parseInt(document.getElementById('item-max-offensive-light').value),
        minimumOffensiveDarkIcons: parseInt(document.getElementById('item-min-offensive-dark').value),
        maximumOffensiveDarkIcons: parseInt(document.getElementById('item-max-offensive-dark').value),
        minimumOffensiveAirIcons: parseInt(document.getElementById('item-min-offensive-air').value),
        maximumOffensiveAirIcons: parseInt(document.getElementById('item-max-offensive-air').value),
        minimumOffensiveEarthIcons: parseInt(document.getElementById('item-min-offensive-earth').value),
        maximumOffensiveEarthIcons: parseInt(document.getElementById('item-max-offensive-earth').value),
        minimumOffensivePhysicalIcons: parseInt(document.getElementById('item-min-offensive-physical').value),
        maximumOffensivePhysicalIcons: parseInt(document.getElementById('item-max-offensive-physical').value),
        minimumDefensiveFireIcons: parseInt(document.getElementById('item-min-defensive-fire').value),
        maximumDefensiveFireIcons: parseInt(document.getElementById('item-max-defensive-fire').value),
        minimumDefensiveWaterIcons: parseInt(document.getElementById('item-min-defensive-water').value),
        maximumDefensiveWaterIcons: parseInt(document.getElementById('item-max-defensive-water').value),
        minimumDefensiveLightIcons: parseInt(document.getElementById('item-min-defensive-light').value),
        maximumDefensiveLightIcons: parseInt(document.getElementById('item-max-defensive-light').value),
        minimumDefensiveDarkIcons: parseInt(document.getElementById('item-min-defensive-dark').value),
        maximumDefensiveDarkIcons: parseInt(document.getElementById('item-max-defensive-dark').value),
        minimumDefensiveAirIcons: parseInt(document.getElementById('item-min-defensive-air').value),
        maximumDefensiveAirIcons: parseInt(document.getElementById('item-max-defensive-air').value),
        minimumDefensiveEarthIcons: parseInt(document.getElementById('item-min-defensive-earth').value),
        maximumDefensiveEarthIcons: parseInt(document.getElementById('item-max-defensive-earth').value),
        minimumDefensivePhysicalIcons: parseInt(document.getElementById('item-min-defensive-physical').value),
        maximumDefensivePhysicalIcons: parseInt(document.getElementById('item-max-defensive-physical').value),
        minimumReflectFirePercentage: parseFloat(document.getElementById('item-min-reflect-fire').value),
        maximumReflectFirePercentage: parseFloat(document.getElementById('item-max-reflect-fire').value),
        minimumReflectWaterPercentage: parseFloat(document.getElementById('item-min-reflect-water').value),
        maximumReflectWaterPercentage: parseFloat(document.getElementById('item-max-reflect-water').value),
        minimumReflectAirPercentage: parseFloat(document.getElementById('item-min-reflect-air').value),
        maximumReflectAirPercentage: parseFloat(document.getElementById('item-max-reflect-air').value),
        minimumReflectEarthPercentage: parseFloat(document.getElementById('item-min-reflect-earth').value),
        maximumReflectEarthPercentage: parseFloat(document.getElementById('item-max-reflect-earth').value),
        minimumReflectDarkPercentage: parseFloat(document.getElementById('item-min-reflect-dark').value),
        maximumReflectDarkPercentage: parseFloat(document.getElementById('item-max-reflect-dark').value),
        minimumReflectLightPercentage: parseFloat(document.getElementById('item-min-reflect-light').value),
        maximumReflectLightPercentage: parseFloat(document.getElementById('item-max-reflect-light').value),
        minimumReflectPhysicalPercentage: parseFloat(document.getElementById('item-min-reflect-physical').value),
        maximumReflectPhysicalPercentage: parseFloat(document.getElementById('item-max-reflect-physical').value),
        minimumPercentageBlockFire: parseFloat(document.getElementById('item-min-block-fire').value),
        maximumPercentageBlockFire: parseFloat(document.getElementById('item-max-block-fire').value),
        minimumPercentageBlockWater: parseFloat(document.getElementById('item-min-block-water').value),
        maximumPercentageBlockWater: parseFloat(document.getElementById('item-max-block-water').value),
        minimumPercentageBlockAir: parseFloat(document.getElementById('item-min-block-air').value),
        maximumPercentageBlockAir: parseFloat(document.getElementById('item-max-block-air').value),
        minimumPercentageBlockEarth: parseFloat(document.getElementById('item-min-block-earth').value),
        maximumPercentageBlockEarth: parseFloat(document.getElementById('item-max-block-earth').value),
        minimumPercentageBlockDark: parseFloat(document.getElementById('item-min-block-dark').value),
        maximumPercentageBlockDark: parseFloat(document.getElementById('item-max-block-dark').value),
        minimumPercentageBlockLight: parseFloat(document.getElementById('item-min-block-light').value),
        maximumPercentageBlockLight: parseFloat(document.getElementById('item-max-block-light').value),
        minimumPercentageBlockPhysical: parseFloat(document.getElementById('item-min-block-physical').value),
        maximumPercentageBlockPhysical: parseFloat(document.getElementById('item-max-block-physical').value),
        specialEffects: document.getElementById('item-special-effects').value.split(',').map(effect => effect.trim())
    };
    
    itemsData.weapons.push(newItem);
    formStatus.textContent = 'Item added successfully!';
    formStatus.style.color = 'green';
    addItemForm.reset();
    populateDropdowns();
}
