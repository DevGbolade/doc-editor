import "./App.css";
import { Toaster } from "react-hot-toast";
import { Router } from "lucide-react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";

function App() {
  return (
    <>
      <>
        <div>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              success: {},
            }}
          ></Toaster>
        </div>
      </>
    </>
  );
}

export default App;
