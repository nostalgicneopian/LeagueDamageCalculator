const effectsList = document.getElementById('effects-list');
const formStatus = document.getElementById('form-status');

const mainhandDetails = document.getElementById('mainhand-details');
const offhandDetails = document.getElementById('offhand-details');
const abilityDetails = document.getElementById('ability-details');

// Custom dropdown elements
const mainhandDropdown = document.getElementById('mainhand-dropdown');
const offhandDropdown = document.getElementById('offhand-dropdown');
const abilityDropdown = document.getElementById('ability-dropdown');

const elements = ['fire', 'water', 'light', 'dark', 'air', 'earth', 'physical'];
const minElements = {};
const maxElements = {};
const defenseMinElements = {};
const defenseMaxElements = {};

// Store all items and current selections
let allWeapons = [];
let allAbilities = [];
let currentSelections = {
    mainhand: null,
    offhand: null,
    ability: null
};

elements.forEach(element => {
    minElements[element] = document.getElementById(`min-${element}`);
    maxElements[element] = document.getElementById(`max-${element}`);
    defenseMinElements[element] = document.getElementById(`defense-min-${element}`);
    defenseMaxElements[element] = document.getElementById(`defense-max-${element}`);
});

document.addEventListener('DOMContentLoaded', () => {
    // Sort weapons and abilities alphabetically by name
    allWeapons = [...itemsData.weapons].sort((a, b) => a.name.localeCompare(b.name));
    allAbilities = [...itemsData.abilities].sort((a, b) => a.name.localeCompare(b.name));
    
    // Initialize custom dropdowns
    initCustomDropdown('mainhand', allWeapons, 'Select a weapon');
    initCustomDropdown('offhand', allWeapons, 'Select a weapon');
    initCustomDropdown('ability', allAbilities, 'Select an ability');
    
    // Initialize dark mode
    initDarkMode();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // Initial calculation to show default state
    calculateDamage();
});

function initCustomDropdown(type, items, placeholder) {
    const dropdown = document.getElementById(`${type}-dropdown`);
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    
    selected.textContent = placeholder;
    
    // Handle clicking on the selected area
    selected.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDropdowns();
        toggleDropdown(type, items);
    });
}

function toggleDropdown(type, items) {
    const dropdown = document.getElementById(`${type}-dropdown`);
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    
    if (options.classList.contains('show')) {
        closeDropdown(type);
        return;
    }
    
    // Show dropdown and replace selected area with search input
    selected.classList.add('active');
    options.classList.add('show');
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'dropdown-search';
    searchInput.placeholder = `Search ${type === 'ability' ? 'abilities' : 'weapons'}...`;
    searchInput.value = '';
    
    // Replace selected content with search input
    const originalContent = selected.textContent;
    selected.innerHTML = '';
    selected.appendChild(searchInput);
    
    // Focus the search input
    searchInput.focus();
    
    // Populate options
    populateDropdownOptions(type, items);
    
    // Handle search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredItems = items.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        populateDropdownOptions(type, filteredItems);
    });
    
    // Handle search input blur/escape
    searchInput.addEventListener('blur', () => {
        setTimeout(() => closeDropdown(type), 150);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDropdown(type);
        }
    });
}

function populateDropdownOptions(type, items) {
    const options = document.getElementById(`${type}-options`);
    options.innerHTML = '';
    
    items.forEach(item => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.textContent = item.name;
        option.dataset.value = item.id;
        
        if (currentSelections[type] && currentSelections[type].id === item.id) {
            option.classList.add('selected');
        }
        
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption(type, item);
        });
        
        options.appendChild(option);
    });
}

function selectOption(type, item) {
    currentSelections[type] = item;
    
    const dropdown = document.getElementById(`${type}-dropdown`);
    const selected = dropdown.querySelector('.dropdown-selected');
    
    // Update display
    selected.textContent = item.name;
    selected.classList.remove('active');
    
    // Close dropdown
    closeDropdown(type);
    
    // Update item details and recalculate
    updateItemDetails(type);
    calculateDamage();
}

function closeDropdown(type) {
    const dropdown = document.getElementById(`${type}-dropdown`);
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    
    selected.classList.remove('active');
    options.classList.remove('show');
    
    // Restore selected display
    if (currentSelections[type]) {
        selected.textContent = currentSelections[type].name;
    } else {
        selected.textContent = selected.dataset.placeholder;
    }
}

function closeAllDropdowns() {
    ['mainhand', 'offhand', 'ability'].forEach(type => {
        closeDropdown(type);
    });
}

function updateItemDetails(slotType) {
    let detailsElement, item;
    
    if (slotType === 'mainhand') {
        detailsElement = mainhandDetails;
        item = currentSelections.mainhand;
    } else if (slotType === 'offhand') {
        detailsElement = offhandDetails;
        item = currentSelections.offhand;
    } else if (slotType === 'ability') {
        detailsElement = abilityDetails;
        item = currentSelections.ability;
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
    
    // Helper function to generate icon HTML with min + additional format
    function generateIconsHTML(minValue, maxValue, iconPath) {
        let iconsHTML = '';
        
        // Handle fractional values by rounding up for display
        const minIcons = Math.ceil(minValue);
        const maxIcons = Math.ceil(maxValue);
        
        // Generate minimum icons
        for (let i = 0; i < minIcons; i++) {
            iconsHTML += `<img src="images/${iconPath}" alt="" style="width: 20px; height: 20px; margin-right: 2px;">`;
        }
        
        // If there are additional icons beyond minimum, add plus sign and additional icons
        const additionalIcons = maxIcons - minIcons;
        if (additionalIcons > 0) {
            iconsHTML += `<span style="margin: 0 4px; font-weight: bold;">+</span>`;
            for (let i = 0; i < additionalIcons; i++) {
                iconsHTML += `<img src="images/${iconPath}" alt="" style="width: 20px; height: 20px; margin-right: 2px; opacity: 0.6;">`;
            }
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
            const iconsHTML = generateIconsHTML(offenseMin, offenseMax, iconPath);
            detailsHTML += `<p>${iconsHTML} ${offenseMin}-${offenseMax}</p>`;
        }
    });
    
    // Check for defense icons
    elements.forEach(element => {
        const defenseMin = item[`defense${element.charAt(0).toUpperCase() + element.slice(1)}Min`] || 0;
        const defenseMax = item[`defense${element.charAt(0).toUpperCase() + element.slice(1)}Max`] || 0;
        const percentageBlocked = item[`percentage${element.charAt(0).toUpperCase() + element.slice(1)}Blocked`] || 0;
        const percentageReflected = item[`percentage${element.charAt(0).toUpperCase() + element.slice(1)}Reflected`] || 0;
        
        if (defenseMin > 0 || defenseMax > 0 || percentageBlocked > 0 || percentageReflected > 0) {
            if (!hasDefenseIcons) {
                detailsHTML += `<p><strong>Defense Icons:</strong></p>`;
                hasDefenseIcons = true;
            }
            
            const iconPath = getIconFileName(element, true);
            const blockIcon = `<img src="images/${iconPath}" alt="" style="width: 20px; height: 20px; margin-right: 2px;">`;
            
            let defenseDisplay = '';
            
            // Handle blocking
            if (percentageBlocked > 0) {
                defenseDisplay += `${blockIcon} 🛡️${percentageBlocked}%`;
            }
            
            // Handle reflection
            if (percentageReflected > 0) {
                if (defenseDisplay) defenseDisplay += ' ';
                // Reflection - show icon with reflection symbol and percentage
                defenseDisplay += `${blockIcon} ↩️${percentageReflected}%`;
            }
            
            // Handle normal defense ranges
            if (defenseMin > 0 || defenseMax > 0) {
                if (defenseDisplay) defenseDisplay += ' ';
                const iconsHTML = generateIconsHTML(defenseMin, defenseMax, iconPath);
                defenseDisplay += `${iconsHTML} ${defenseMin}-${defenseMax}`;
            }
            
            if (defenseDisplay) {
                detailsHTML += `<p>${defenseDisplay}</p>`;
            }
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
    const mainhand = currentSelections.mainhand;
    const offhand = currentSelections.offhand;
    const ability = currentSelections.ability;
    
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

function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const toggleIcon = darkModeToggle.querySelector('.toggle-icon');
    
    // Check for saved dark mode preference or default to light mode
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        toggleIcon.textContent = '☀️';
    }
    
    // Add click event listener to toggle button
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isNowDarkMode = document.body.classList.contains('dark-mode');
        
        // Update icon
        toggleIcon.textContent = isNowDarkMode ? '☀️' : '🌙';
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', isNowDarkMode.toString());
    });
}
