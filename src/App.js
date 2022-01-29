// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from './components/ProtectedRoute';
import Layout from "./components/Layout";
import Error404 from "./components/Error404";
import CreateInventoryItem from './components/Inventory/CreateInventoryItem';
import EditInventoryItem from './components/Inventory/EditInventoryItem';
import AllInventoryItems from './components/Inventory/AllInventoryItems';
import CategoryInventoryItems from "./components/Inventory/CategoryInventoryItems";
import TypeInventoryItems from "./components/Inventory/TypeInventoryItems";
import ProjectItems from "./components/Projects/ProjectItems";
import CreateProjectItem from "./components/Projects/CreateProjectItem";
import EditProjectItem from "./components/Projects/EditProjectItem";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateReport from "./components/Reports/CreateReport";
import EditReport from "./components/Reports/EditReport";
import AllReports from "./components/Reports/AllReports";

function App() {
	return (
		<>
			<BrowserRouter>
			<Routes>
				<Route path="login" element={<Login/>} />
				<Route element={<ProtectedRoute/>}>

					<Route path="/" element={<Layout/>}>

						<Route index element={<Dashboard/>} />
						
						<Route path="inventory">
							<Route path='' element={<AllInventoryItems/>} />
							<Route path='category/:id' element={<CategoryInventoryItems/>} />
							<Route path='type/:id' element={<TypeInventoryItems/>} />
							<Route path='create' element={<CreateInventoryItem/>} />
							<Route path='edit/:id' element={<EditInventoryItem/>} />
						</Route>

						<Route path="reports">
							<Route path='' element={<AllReports/>} />
							<Route path='create' element={<CreateReport/>} />
							<Route path='create/:id' element={<CreateReport/>} />
							<Route path='edit/:id' element={<EditReport/>} />
						</Route>

						<Route path="projects">
							<Route path='' element={<Error404/>} />
							<Route path='edit/:id' element={<EditProjectItem/>} />
							<Route path='create' element={<CreateProjectItem/>} />
							<Route path='create/:id' element={<CreateProjectItem/>} />
							<Route path=':id' element={<ProjectItems/>} />
						</Route>

						<Route path="*" element={<Error404 />} />
					</Route>

				</Route>
				

			</Routes>
			</BrowserRouter>
		</>
	);
  }
  
  export default App;