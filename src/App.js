import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
//import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import Mypage from "./pages/Mypage/Mypage";

function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>

          <Route path="/" element={
            <Layout>
              <Home/>
            </Layout>
          }/>

          <Route path="/Mypage" element={
            <Layout>
              <Mypage/>
            </Layout>
          }/>          

          {/* <Route path="/mypage" element={
            <ProtectedRoute>
              <Layout>
                <MyPage/>
              </Layout>
            </ProtectedRoute>
          }/> */}

        </Routes>

      </BrowserRouter>

    </AuthProvider>

  );
}

export default App;