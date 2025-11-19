import React from "react";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import "./App.css";

function App() {
  return (
    <div className="container">
      <div className="container-card">
        {/* <h2 className="mb-3">Purchase Order Form</h2> */}
        <PurchaseOrderForm />
      </div>
    </div>
  );
}

export default App;
