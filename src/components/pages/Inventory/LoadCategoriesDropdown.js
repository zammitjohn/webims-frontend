import React, { useState, useEffect } from 'react';

function LoadCategoriesDropdown() {
// Local variables will get reset every render upon mutation whereas state will update
let elements = [];
let key = 0;
const [categories, setCategories] = useState([]);
const [states, setStates] = useState({ // form values
    error: null,
    isLoaded: false,
});

useEffect(() => {
    // fetch categories
    fetch('http://site.test/WebIMS/api/inventory/categories/read', {
        method: 'GET',
        credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (categories) => {
                setCategories(categories);
                setStates({
                    isLoaded: true
                });
            },
            (error) => {
                setStates({
                    isLoaded: true,
                    error
                })
            }
        )
  }, []);


  elements.push(<option value={null} key={key++}>Select Category</option>);
  if (states.error) {
      console.log(states.error.message);
      return null;
  } else if (!(states.isLoaded)) {
      console.log("Loading...");
      return null;
  } else {
    categories.forEach((category) => {
        elements.push(<option value={category.id} key={key++}>{category.name}</option>);
    });
    }

    return (
        <>
            {elements}
        </>
    );
}

export default LoadCategoriesDropdown