import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./login";
import Chatbot from "./chatbot";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}
