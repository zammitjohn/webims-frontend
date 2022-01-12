async function getInventoryCategories() {
  const response = await fetch('http://site.test/WebIMS/api/inventory/categories/read', {
      method: 'GET',
      credentials: 'include'
      })
  const categories = await response.json();
  return categories;
}

async function getInventoryTypes(categoryid) {
  let url = '';
  if (categoryid === undefined){
    url = `http://site.test/WebIMS/api/inventory/types/read`;
  } else {
    url = `http://site.test/WebIMS/api/inventory/types/read?category=${categoryid}`;
  }
  const response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
      })
  const types = await response.json();
  return types;
}

// Export it to make it available outside
const _getInventoryTypes = getInventoryTypes;
export { _getInventoryTypes as getInventoryTypes };
const _getInventoryCategories = getInventoryCategories;
export { _getInventoryCategories as getInventoryCategories };