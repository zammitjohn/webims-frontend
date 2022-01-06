// App.js

import React, {Component} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Layout from './components/Layout';
import Content from "./components/pages/Content";
import Error404 from "./components/pages/Error404";

class App extends Component {

  render() {
    return (
		<div>
			<BrowserRouter>
			  <Routes>
				<Route path="/" element={<Layout />}>
				  <Route index element={<Content/>} />

				  <Route path="dashboard" element={<Content/>} />
				  
				  <Route path="inventory">
				  	<Route path='' element={<Content/>} />
				  	<Route path='category/:id' element={<Content/>} />
					<Route path='type/:id' element={<Content/>} />
					<Route path='create' element={<Content/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="reports">
				  	<Route path='' element={<Content/>} />
					<Route path='create' element={<Content/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="projects">
				  	<Route path='edit/:id' element={<Content/>} />
					<Route path='create' element={<Content/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="registry">
					<Route path='create' element={<Content/>} />
        			<Route path=':id' element={<Content/>} />
      			  </Route>

				  <Route path="*" element={<Error404 />} />
				</Route>
			  </Routes>
			</BrowserRouter>
		</div>
    );
  }
}

export default App;