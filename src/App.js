import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home/Home";
import Mypage from "./pages/Mypage/Mypage";
import UserLogin from "./pages/login/UserLogin";
import NotFound from "./pages/errorPage/NotFound";
import ServerError from "./pages/errorPage/NotFound";

import TestLogin from "./pages/test/TestLogin";

function App() {

  return (

    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 메뉴나 푸터 적용 페이지 start */}
          <Route element={<Layout/>}>
            <Route path="/" element={<Home/>}/>
            {/* 로그인한 유저만 접근가능한 페이지 start */}
            <Route element={<ProtectedRoute/>}>
              <Route path="/Mypage" element={<Mypage/>}/>
            </Route>
            {/* 로그인한 유저만 접근가능한 페이지 end */}
          </Route>
          {/* 메뉴나 푸터 적용 페이지 end */}

          {/* 메뉴나 푸터 적용하지 않을 페이지 start */}
            {/* 로그인한 유저만 접근가능한 페이지 start */}
            <Route element={<ProtectedRoute/>}>
              {/* 여기에 메뉴나 푸터 적용하지 않으며 로그인한 유저만 접근가능한 페이지 채우기 */}
            </Route>
            {/* 로그인한 유저만 접근가능한 페이지 end */}
          <Route path="/TestLogin" element={<TestLogin/>}/>
          <Route path="/UserLogin" element={<UserLogin/>}/>
          <Route path="/500" element={<ServerError/>}/>
          <Route path="*" element={<NotFound/>}/>{/* 404는 항상 뒤에 */}
          {/* 메뉴나 푸터 적용하지 않을 페이지 end */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;