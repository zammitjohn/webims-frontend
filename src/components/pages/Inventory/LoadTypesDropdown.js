import React, { useState, useEffect } from 'react';

function LoadTypesDropdown(props) {
// Local variables will get reset every render upon mutation whereas state will update
let elements = [];
let key = 0;
const [types, setTypes] = useState([]);
const [states, setStates] = useState({ // form values
    error: null,
    isLoaded: false,
});

useEffect(() => {
    // fetch types
    fetch('http://site.test/WebIMS/api/inventory/types/read', {
        method: 'GET',
        credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (types) => {
                setTypes(types);
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


  elements.push(<option value={null} key={key++}>Select Type</option>);
  if (states.error) {
      console.log(states.error.message);
      return null;
  } else if (!(states.isLoaded)) {
      console.log("Loading...");
      return null;
  } else {
    types.forEach((type) => {
      if ((type.type_category === props.category)){
        elements.push(<option value={type.id} key={key++}>{type.name}</option>);
      }	  
    });
  }

    return (
        <>
            {elements}
        </>
    );
}

export default LoadTypesDropdown