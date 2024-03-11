import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsComponent from "./ProductsComponent";
import ReviewComponent from "./ReviewComponent";
import Login from "./Login";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProductsComponent />} />
        <Route path="/reviews/:productId" element={<ReviewComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
