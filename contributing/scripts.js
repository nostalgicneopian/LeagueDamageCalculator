// Special Effects functionality
document.addEventListener('DOMContentLoaded', function() {
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