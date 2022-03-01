import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Layout from "./Pages/Layout";
import "antd/dist/antd.css";
import TxnDetailsPage from "./Pages/TxnDeatilsPage";
import DummyFile from "./Pages/DummyFile";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dummy" element={<DummyFile />} />

          <Route path="/txnDetails" element={<TxnDetailsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
