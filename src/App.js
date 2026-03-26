import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./context/ProtectedRoute";

// Home pages
import Home from "./pages/Home/Home";
import UserLogin from "./pages/Home/UserLogin";
import UserSignUp from "./pages/Home/UserSignUp";


import Schedule from "./pages/Schedule/Schedule";
import MVideo from "./pages/Video/MVideo";

// Audition pages
import AuditionVote from "./pages/Audition/Vote";
import IdolList from "./pages/Audition/IdolList";
import Contest from "./pages/Audition/Contest";

// My pages
import MngVote from "./pages/MyPage/MyVote";
import Bookmark from "./pages/MyPage/MyBookmark";
import MyMain from "./pages/MyPage/MyMain";

//커뮤니티
import Community from "./pages/Community/Community";
//게시판
import BoardList from "./pages/Board/BoardList";
import BoardWrite from "./pages/Board/BoardWrite";
import BoardUpdate from "./pages/Board/BoardUpdate";
import BoardView from "./pages/Board/BoardView";
import BoardPreview from "./pages/Board/BoardPreview";
//아이디어 제안
import Idea from "./pages/Idea/Idea";
//신고
import Report from "./pages/Report/Report";
//Qna
import QnaList from "./pages/Qna/QnaList";

//굿즈
import GoodsView from "./pages/Goods/GoodsView";
import GoodsWrite from "./pages/Goods/GoodsWrite";
import GoodsUpdate from "./pages/Goods/GoodsUpdate";
import GoodsList from "./pages/Goods/GoodsList";
import GoodsPreview from "./pages/Goods/GoodsPreview";
import PaymentResult from "./components/kakaoPay/PaymentResult";

import Process from "./pages/Process/Process";

import ServerError from "./pages/ErrorPage/ServerError";
import NotFound from "./pages/ErrorPage/NotFound";

// 관리자
import AdminMain from "./pages/Admin/AdminMain";

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
          <Route path="/Audition/contest" element={<Layout><Contest/></Layout>}/>

          <Route path="/Process" element={<Layout><Process/></Layout>}/>

          <Route path="/MVideo" element={<ProtectedRoute><Layout><MVideo/></Layout></ProtectedRoute>}/>
          <Route path="/MVideo/:pageId" element={<ProtectedRoute><Layout><MVideo/></Layout></ProtectedRoute>}/>

          <Route path="/Schedule" element={<ProtectedRoute><Layout><Schedule/></Layout></ProtectedRoute>}/>          

          <Route path="/Bookmark" element={<ProtectedRoute><Layout><Bookmark/></Layout></ProtectedRoute>}/>
          <Route path="/MngVote" element={<ProtectedRoute><Layout><MngVote/></Layout></ProtectedRoute>}/>
          <Route path="/MyMain" element={<ProtectedRoute><Layout><MyMain/></Layout></ProtectedRoute>}/>
          
          <Route path="/Community" element={<Layout><Community/></Layout>}>
            {/* index는 /Community 접속 시 기본으로 보여줄 페이지 */}
            <Route index element={<BoardList />} />
            {/* /Community/BoardList 로 접근 가능 */}
            <Route path="BoardList" element={<BoardList />} />
            <Route path="Idea" element={<Idea />} />
            <Route path="Report" element={<Report />} />
            <Route path="QnaList" element={<QnaList />} />
          </Route>

          <Route path="/BoardWrite" element={<ProtectedRoute><Layout><BoardWrite/></Layout></ProtectedRoute>}/>
          <Route path="/BoardUpdate/:bno" element={<ProtectedRoute><Layout><BoardUpdate/></Layout></ProtectedRoute>}/>
          {/* <Route path="/BoardList" element={<Layout><BoardList/></Layout>}/> */}
          <Route path="/BoardView/:bno" element={<Layout><BoardView/></Layout>}/>
          <Route path="/BoardPreview" element={<Layout><BoardPreview /></Layout>} />

          <Route path="/GoodsList" element={<Layout><GoodsList/></Layout>} />
          <Route path="/GoodsView/:gno" element={<Layout><GoodsView/></Layout>} />
          <Route path="/GoodsWrite" element={<Layout><GoodsWrite/></Layout>} />
          <Route path="/GoodsUpdate/:gno" element={<Layout><GoodsUpdate/></Layout>} />
          <Route path="/GoodsPreview" element={<Layout><GoodsPreview /></Layout>} />

          <Route path="/Payment/Success" element={<PaymentResult type="success" />} />
          <Route path="/Payment/Fail" element={<PaymentResult type="fail" />} />
          <Route path="/Payment/Cancel" element={<PaymentResult type="cancel" />} />

          <Route path="/AdminMain" element={<Layout><AdminMain /></Layout>} />

          <Route path="/500" element={<ServerError/>} />{/* 서버에러500페이지 */}
          <Route path="*" element={<NotFound />} />{/* 404페이지 못 찾음 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>

  );
}

export default App;