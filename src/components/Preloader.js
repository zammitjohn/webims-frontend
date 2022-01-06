// Preloader.js

import React, {Component} from 'react';
export default class Preloader extends Component {
    render(){
        return (
			<div className="preloader flex-column justify-content-center align-items-center">
				<img className="animation__wobble" src="/images/logo.svg" alt="" height="60" width="60" />
			</div>
        )
    }
}