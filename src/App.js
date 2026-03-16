import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./context/ProtectedRoute";

// pages
import Home from "./pages/Home/Home";
import UserLogin from "./pages/Home/UserLogin";
import Mypage from "./pages/Mypage/Mypage";
import Vote from "./pages/Mypage/Vote";
import Calender from "./pages/Calendar/Calendar";
import MVideo from "./pages/Video/MVideo";

function App() {

  return (

    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home/></Layout>}/>
          <Route path="/UserLogin" element={<Layout><UserLogin/></Layout>}/>

          <Route path="/Calendar" element={<ProtectedRoute><Layout><Calender/></Layout></ProtectedRoute>}/>          

          <Route path="/MVideo" element={<Layout><MVideo/></Layout>}/>

          <Route path="/Mypage" element={<ProtectedRoute><Layout><Mypage/></Layout></ProtectedRoute>}/>          
          <Route path="/Vote" element={<ProtectedRoute><Layout><Vote/></Layout></ProtectedRoute>}/>          

        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;