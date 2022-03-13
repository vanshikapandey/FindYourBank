import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FetchBank from "./components/FetchBank";
import BankDetails from "./components/BankDetails";
import Favourite from "./components/Favourite";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route exact path="/" element={<FetchBank />} />
          <Route path="*" element={<FetchBank />} />
          <Route path="/all-banks" element={<FetchBank />} />
          <Route path="/bank-details/:ifsc" element={<BankDetails />} />
          <Route path="/favourite" element={<Favourite />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
