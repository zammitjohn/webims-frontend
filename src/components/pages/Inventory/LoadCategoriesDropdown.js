import React, { Component } from 'react';

class LoadCategoriesDropdown extends Component {

	constructor(props) {
		super(props);
		this.categories = [];
		this.keyCount = 0;
		this.getKey = this.getKey.bind(this);
		
		this.state = {
		  error: null,
		  isLoaded: false,
		};
	  }

	getKey() {
		return this.keyCount++;
	}


    componentDidMount() {
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.		
    
        // fetch categories
        fetch('http://site.test/WebIMS/api/inventory/categories/read', {
          method: 'GET',
          credentials: 'include'
          })
          .then(res => res.json())
          .then(
            (categories) => {
              this.categories = categories;
              this.setState({
                isLoaded: true,
                });
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error
                });
            }
          )
      }

    render() {
		let elements = [];
        elements.push(<option value={null} key={this.getKey()}>Select Category</option>);
		const {error, isLoaded} = this.state;
		if (error) {
			console.log(error.message);
			return null;
		} else if (!(isLoaded)) {
			console.log("Loading...");
			return null;
		} else {

            this.categories.forEach((category) => {
				elements.push(
                    <option value={category.id} key={this.getKey()}>{category.name}</option>
				);
            });

            return (
                <>
                    {elements}
                </>
            );

        }
    }
}

export default LoadCategoriesDropdown;
