import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./context/ProtectedRoute";

// Home pages
import Home from "./pages/Home/Home";
import UserLogin from "./pages/Home/UserLogin";
import UserSignUp from "./pages/Home/UserSignUp";

import Calender from "./pages/Calendar/Calendar";
import MVideo from "./pages/Video/MVideo";

// Audition pages
import AuditionVote from "./pages/Audition/Vote";
import IdolList from "./pages/Audition/IdolList";
import LeaderBoard from "./pages/Audition/LeaderBoard";
import Contest from "./pages/Audition/Contest";

// My pages
import Bookmark from "./pages/Mypage/Bookmark";

//게시판
import BoardList from "./pages/Board/BoardList";
import BoardWrite from "./pages/Board/BoardWrite";
import BoardView from "./pages/Board/BoardView";

function App() {

  return (

    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home/></Layout>}/>
          <Route path="/UserLogin" element={<Layout><UserLogin/></Layout>}/>
          <Route path="/UserSignUp" element={<Layout><UserSignUp/></Layout>}/>

          <Route path="/Audition/vote" element={<Layout><AuditionVote/></Layout>}/>
          <Route path="/Audition/idols" element={<Layout><IdolList/></Layout>}/>
          <Route path="/Audition/ranking" element={<Layout><LeaderBoard/></Layout>}/>
          <Route path="/Audition/contest" element={<Layout><Contest/></Layout>}/>

          <Route path="/Calendar" element={<ProtectedRoute><Layout><Calender/></Layout></ProtectedRoute>}/>          

          <Route path="/MVideo" element={<Layout><MVideo/></Layout>}/>

          <Route path="/Bookmark" element={<ProtectedRoute><Layout><Bookmark/></Layout></ProtectedRoute>}/>          
          
          <Route path="/BoardWrite" element={<ProtectedRoute><Layout><BoardWrite/></Layout></ProtectedRoute>}/>
          <Route path="/BoardList" element={<Layout><BoardList/></Layout>}/>
          <Route path="/BoardView/:bno" element={<Layout><BoardView/></Layout>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;