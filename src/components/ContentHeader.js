// ContentHeader.js: Content Header (Page header)
import React, { Component } from 'react';
import {Link} from "react-router-dom";

class ContentHeader extends Component {
    render() {
        return (
            <section className="content-header">
                <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                    <h1>{this.props.pageName}</h1>
                    </div>
                    <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active">{this.props.pageName}</li>
                    </ol>
                    </div>
                </div>
                </div>{/*/.container-fluid */}
            </section>
        );
    }
}

export default ContentHeader;
