// This file reads the data from the items.json file and converts it into a JavaScript object

const itemsData = fetch('data/items.json')
  .then(response => response.json())
  .then(data => {
    // Convert the data to a JavaScript object
    const items = {};
    data.forEach(item => {
      items[item.id] = item;
    });
    return items;
  })
  .catch(error => {
    console.error('Error loading items data:', error);
    return {};
  });