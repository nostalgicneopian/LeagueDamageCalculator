// Toggle functionality for sections
document.addEventListener('DOMContentLoaded', function() {
    // Define the sections to be toggled
    const sections = [
        { toggle: 'toggle-offensive-icons', section: 'offensive-icons-section', inputSelector: '#offensive-icons-section input[type="number"]' },
        { toggle: 'toggle-defensive-icons', section: 'defensive-icons-section', inputSelector: '#defensive-icons-section input[type="number"]' },
        { toggle: 'toggle-reflect-percentages', section: 'reflect-percentages-section', inputSelector: '#reflect-percentages-section input[type="number"]' },
        { toggle: 'toggle-block-percentages', section: 'block-percentages-section', inputSelector: '#block-percentages-section input[type="number"]' }
    ];
    
    // Add event listeners to all toggle checkboxes
    sections.forEach(item => {
        const toggleCheckbox = document.getElementById(item.toggle);
        const sectionElement = document.getElementById(item.section);
        
        if (toggleCheckbox && sectionElement) {
            toggleCheckbox.addEventListener('change', function() {
                // Toggle the visibility of the section
                sectionElement.style.display = this.checked ? 'block' : 'none';
                
                // Toggle the required attribute for all inputs in the section
                const inputs = document.querySelectorAll(item.inputSelector);
                inputs.forEach(input => {
                    if (this.checked) {
                        input.setAttribute('required', '');
                    } else {
                        input.removeAttribute('required');
                    }
                });
            });
        }
    });
    
    // Special Effects functionality
    const addEffectBtn = document.getElementById('add-effect-btn');
    const specialEffectsContainer = document.getElementById('special-effects-container');
    
    // Function to add new special effect field
    addEffectBtn.addEventListener('click', function() {
        // Show the remove button for the first row if it's hidden
        if (specialEffectsContainer.children.length === 1) {
            specialEffectsContainer.querySelector('.remove-effect-btn').style.display = 'block';
        }
        
        // Create new row
        const newRow = document.createElement('div');
        newRow.className = 'special-effect-row';
        
        // Create new text input
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.className = 'special-effect-input';
        newInput.name = 'item-special-effects[]';
        newInput.placeholder = 'Enter special effect';
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-effect-btn';
        removeBtn.textContent = 'Remove';
        
        // Add functionality to remove button
        removeBtn.addEventListener('click', function() {
            specialEffectsContainer.removeChild(newRow);
            
            // Hide the remove button on first row if it's the only row left
            if (specialEffectsContainer.children.length === 1) {
                specialEffectsContainer.querySelector('.remove-effect-btn').style.display = 'none';
            }
        });
        
        // Append elements to row and row to container
        newRow.appendChild(newInput);
        newRow.appendChild(removeBtn);
        specialEffectsContainer.appendChild(newRow);
    });
    
    // Add event listener to the initial remove button
    const initialRemoveBtn = specialEffectsContainer.querySelector('.remove-effect-btn');
    initialRemoveBtn.addEventListener('click', function() {
        const row = this.parentElement;
        if (specialEffectsContainer.children.length > 1) {
            specialEffectsContainer.removeChild(row);
            
            // Hide the remove button on first row if it's the only one left
            if (specialEffectsContainer.children.length === 1) {
                specialEffectsContainer.querySelector('.remove-effect-btn').style.display = 'none';
            }
        }
    });
});