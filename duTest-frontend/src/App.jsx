import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsPage from "./pages/ProjectsPage";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:projectId/testcases" element={<HomePage />} />
        <Route path="/projects/:projectId/testcases/create" element={<FormPage />} />
        <Route path="/projects/:projectId/testcases/edit/:id" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
