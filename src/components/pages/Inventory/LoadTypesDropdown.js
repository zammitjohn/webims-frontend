import React, { Component } from 'react';

class LoadTypesDropdown extends Component {

	constructor(props) {
		super(props);
		this.types = [];
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
    
        // fetch types
        fetch('http://site.test/WebIMS/api/inventory/types/read', {
          method: 'GET',
          credentials: 'include'
          })
          .then(res => res.json())
          .then(
            (types) => {
              this.types = types;
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
    elements.push(<option value={null} key={this.getKey()}>Select Type</option>);
		const {error, isLoaded} = this.state;
		if (error) {
			console.log(error.message);
			return null;
		} else if (!(isLoaded)) {
			console.log("Loading...");
			return null;
		} else {

        this.types.forEach((type) => {
          if ((type.type_category == this.props.category)){
            elements.push(<option value={type.id} key={this.getKey()}>{type.name}</option>);
          }
				  
        });

            return (
                <>
                    {elements}
                </>
            );

        }
    }
}

export default LoadTypesDropdown;
