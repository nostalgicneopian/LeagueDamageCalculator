const fs = require('fs');

// Read the current data.js file
const dataContent = fs.readFileSync('js/data.js', 'utf8');

// Extract the JSON data (remove the JavaScript wrapper)
const jsonStart = dataContent.indexOf('{');
const jsonEnd = dataContent.lastIndexOf('}') + 1;
const jsonString = dataContent.substring(jsonStart, jsonEnd);
const data = JSON.parse(jsonString);

const elements = ['Fire', 'Water', 'Light', 'Dark', 'Air', 'Earth', 'Physical'];

function processItems(items) {
    items.forEach(item => {
        elements.forEach(element => {
            const defenseMinKey = `defense${element}Min`;
            const defenseMaxKey = `defense${element}Max`;
            const percentageBlockedKey = `percentage${element}Blocked`;
            
            // Check if either min or max is 9999
            const hasMinBlock = item[defenseMinKey] === 9999;
            const hasMaxBlock = item[defenseMaxKey] === 9999;
            
            if (hasMinBlock || hasMaxBlock) {
                // Add percentage blocked property
                item[percentageBlockedKey] = 100;
                
                // Set defense values to 0
                if (hasMinBlock) item[defenseMinKey] = 0;
                if (hasMaxBlock) item[defenseMaxKey] = 0;
                
                // Add to effects if not already present
                if (!item.effects) item.effects = [];
                const blockEffect = `Blocks 100% of ${element.toLowerCase()}`;
                if (!item.effects.includes(blockEffect)) {
                    item.effects.push(blockEffect);
                }
                
                console.log(`Updated ${item.name}: Added ${percentageBlockedKey} = 100, effect: "${blockEffect}"`);
            }
        });
    });
}

// Process weapons and abilities
processItems(data.weapons);
processItems(data.abilities);

// Write the updated data back to the file
const updatedContent = `// This file reads the data from the items.json file and converts it into a JavaScript object

const itemsData = ${JSON.stringify(data, null, 4)};`;

fs.writeFileSync('js/data.js', updatedContent);

console.log('Data update completed!');
