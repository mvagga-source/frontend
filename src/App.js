import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { setNavigate } from "./api/axiosInstance";
import Layout from "./components/Layout";
import ProtectedRoute from "./context/ProtectedRoute";
import Header from "./components/Header";

// Home pages
import Home from "./pages/Home/Home";
import UserLogin from "./pages/Home/UserLogin";
import UserSignUp from "./pages/Home/UserSignUp";

import Schedule from "./pages/Schedule/Schedule";
import Event from "./pages/Schedule/Event";
import MVideo from "./pages/Video/MVideo";

// Audition pages
import AuditionVote from "./pages/Audition/Vote";
import IdolList from "./pages/Audition/IdolList";
import IdolProfile from "./pages/Audition/IdolProfile.js";
import IdolRanking     from "./pages/Audition/contest/IdolRanking";
import TeamCompetition from "./pages/Audition/contest/TeamCompetition";

// Support ㅠㅔ이지
import Support from "./pages/Support/Support.js";
import SupportSuccess from "./pages/Support/SupportSuccess.js";


// My pages
import MyMain from "./pages/MyPage/MyMain";
import MyBookmark from "./pages/MyPage/MyBookmark";
import MyVote from "./pages/MyPage/MyVote";
import MyGoods from "./pages/MyPage/MyGoods";
import MyPurchase from "./pages/MyPage/MyPurchase.jsx";
import MySale from "./pages/MyPage/MySale.jsx";
import MyPurchaseReturn from "./pages/MyPage/MyPurchaseReturn.jsx";
import MySaleReturn from "./pages/MyPage/MySaleReturn.jsx";


//커뮤니티
import Community from "./pages/Community/Community";

//게시판
import BoardList from "./pages/Board/BoardList";
import BoardWrite from "./pages/Board/BoardWrite";
import BoardUpdate from "./pages/Board/BoardUpdate";
import BoardView from "./pages/Board/BoardView";
import BoardPreview from "./pages/Board/BoardPreview";

import BoardListN from "./pages/Board/boardAboutPage/BoardListN.js";
import BoardViewN from "./pages/Board/boardAboutPage/BoardViewN.js";

//아이디어 제안
import IdeaList from "./pages/Idea/IdeaList";
import IdeaWrite from "./pages/Idea/IdeaWrite";

//신고
import ReportList from "./pages/Report/ReportList";
import ReportWrite from "./pages/Report/ReportWrite";

//Qna
import QnaList from "./pages/Qna/QnaList";
import QnaWrite from "./pages/Qna/QnaWrite";
import QnaView from "./pages/Qna/QnaView";
import QnaUpdate from "./pages/Qna/QnaUpdate";

//굿즈
import GoodsView from "./pages/Goods/GoodsView";
import GoodsWrite from "./pages/Goods/GoodsWrite";
import GoodsUpdate from "./pages/Goods/GoodsUpdate";
import GoodsList from "./pages/Goods/GoodsList";
import GoodsPreview from "./pages/Goods/GoodsPreview";
import GoodsReturn from "./pages/Goods/GoodsReturn.js";
import GoodsReturnView from "./pages/Goods/GoodsReturnView.js";
import GoodsOrderSale from "./pages/Goods/GoodsOrderSale.js";
import GoodsSaleReturn from "./pages/Goods/GoodsSaleReturn.js";
import PaymentResult from "./components/kakaoPay/PaymentResult";

import Process from "./pages/Process/Process";

import ServerError from "./pages/ErrorPage/ServerError";
import NotFound from "./pages/ErrorPage/NotFound";

// 관리자
import AdminMain from "./pages/Admin/AdminMain";
import { ToastProvider } from "./context/ToastMsg/ToastContext.js";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    // 앱이 켜질 때 axios 인터셉터에 함수들을 주입합니다.
    setNavigate(navigate);
  }, [navigate]);
  return (
    <AuthProvider>
      <ToastProvider>
      {/* <BrowserRouter> */}
        <Routes>
          <Route path="/" element={<Layout><Home/></Layout>}/>
          <Route path="/UserLogin" element={<Layout><UserLogin/></Layout>}/>
          <Route path="/UserSignUp" element={<Layout><UserSignUp/></Layout>}/>

          <Route path="/Audition/vote" element={<Layout><AuditionVote/></Layout>}/>
          <Route path="/Audition/idols" element={<Layout><IdolList/></Layout>}/>
          <Route path="/Audition/profile/:id" element={<Layout><IdolProfile/></Layout>} />
          <Route path="/Audition/contest/ranking" element={<Layout><IdolRanking/></Layout>}/>
          <Route path="/Audition/contest/team" element={<Layout><TeamCompetition/></Layout>}/>

          <Route path="/Process" element={<Layout><Process/></Layout>}/>
          <Route path="/support/:id" element={<Layout><Support/></Layout>}/>
          <Route path="/support/success" element={<Layout><SupportSuccess /></Layout>} />

          {/* 뮤직비디오 */}
          <Route path="/MVideo" element={<Layout><MVideo/></Layout>}/>
          <Route path="/MVideo/:pageId" element={<ProtectedRoute><Layout><MVideo/></Layout></ProtectedRoute>}/>

          {/* 오디션 일정 */}
          <Route path="/Schedule" element={<Layout><Schedule/></Layout>}/>          
          <Route path="/Event" element={<Layout><Event/></Layout>}/>

          {/* 내페이지 관리*/}
          <Route path="/MyMain" element={<ProtectedRoute><Layout><MyMain/></Layout></ProtectedRoute>}>
            <Route index element={<MyBookmark />} />
            <Route path="MyBookmark" element={<MyBookmark />} />
            <Route path="MyVote" element={<MyVote />} />
            <Route path="MyPurchase" element={<MyPurchase />} />
            <Route path="MySale" element={<MySale />} />
            <Route path="MyGoods" element={<MyGoods />} />
            <Route path="MyPurchaseReturn" element={<MyPurchaseReturn />} />
            <Route path="MySaleReturn" element={<MySaleReturn />} />
          </Route>

          <Route path="/Community" element={<Layout><Community/></Layout>}>
            {/* index는 /Community 접속 시 기본으로 보여줄 페이지 */}
            <Route index element={<BoardList />} />
            {/* /Community/BoardList 로 접근 가능 */}
            <Route path="BoardList" element={<BoardList />} />
            <Route path="BoardView/:bno" element={<BoardView/>}/>
            <Route path="BoardPreview" element={<ProtectedRoute><BoardPreview /></ProtectedRoute>} />
            <Route path="BoardWrite" element={<ProtectedRoute><BoardWrite/></ProtectedRoute>}/>
            <Route path="BoardUpdate/:bno" element={<ProtectedRoute><BoardUpdate/></ProtectedRoute>}/>

            {/* N붙은 테스트 페이지 */}
            <Route path="BoardListN" element={<BoardListN />} />
            <Route path="BoardViewN/:bno" element={<BoardViewN/>}/>
            
            {/* 아이디어 */}
            <Route path="IdeaList" element={<IdeaList />} />
            <Route path="IdeaWrite" element={<ProtectedRoute><IdeaWrite /></ProtectedRoute>} />
            {/* 신고 */}
            <Route path="ReportList" element={<ReportList />} />
            <Route path="ReportWrite" element={<ProtectedRoute><ReportWrite /></ProtectedRoute>} />
            {/* Qna */}
            <Route path="QnaList" element={<ProtectedRoute><QnaList /></ProtectedRoute>} />
            <Route path="QnaWrite" element={<ProtectedRoute><QnaWrite /></ProtectedRoute>} />
            <Route path="QnaView/:qno" element={<ProtectedRoute><QnaView /></ProtectedRoute>} />
            <Route path="QnaUpdate/:qno" element={<ProtectedRoute><QnaUpdate /></ProtectedRoute>} />
          </Route>

          <Route path="/BoardWrite" element={<ProtectedRoute><Layout><BoardWrite/></Layout></ProtectedRoute>}/>
          <Route path="/BoardUpdate/:bno" element={<ProtectedRoute><Layout><BoardUpdate/></Layout></ProtectedRoute>}/>
          {/* <Route path="/BoardList" element={<Layout><BoardList/></Layout>}/> */}
          <Route path="/BoardView/:bno" element={<Layout><BoardView/></Layout>}/>
          <Route path="/BoardPreview" element={<ProtectedRoute><Layout><BoardPreview /></Layout></ProtectedRoute>} />

          <Route path="/GoodsList" element={<Layout><GoodsList/></Layout>} />
          <Route path="/GoodsView/:gno" element={<Layout><GoodsView/></Layout>} />
          <Route path="/GoodsReturn/:gono" element={<Layout><GoodsReturn /></Layout>} />
          <Route path="/GoodsWrite" element={<ProtectedRoute><Layout><GoodsWrite/></Layout></ProtectedRoute>} />
          <Route path="/GoodsUpdate/:gno" element={<ProtectedRoute><Layout><GoodsUpdate/></Layout></ProtectedRoute>} />
          <Route path="/GoodsOrderSale/:gono" element={<ProtectedRoute><Layout><GoodsOrderSale /></Layout></ProtectedRoute>} />
          <Route path="/GoodsReturn/:gono" element={<ProtectedRoute><Layout><GoodsReturn /></Layout></ProtectedRoute>} />
          <Route path="/GoodsReturnView/:rno" element={<ProtectedRoute><Layout><GoodsReturnView /></Layout></ProtectedRoute>} />
          <Route path="/GoodsSaleReturn/:rno" element={<ProtectedRoute><Layout><GoodsSaleReturn /></Layout></ProtectedRoute>} />
          <Route path="/GoodsPreview" element={<ProtectedRoute><Layout><GoodsPreview /></Layout></ProtectedRoute>} />

          <Route path="/Payment/Success" element={<ProtectedRoute><PaymentResult type="success" /></ProtectedRoute>} />
          <Route path="/Payment/Fail" element={<ProtectedRoute><PaymentResult type="fail" /></ProtectedRoute>} />
          <Route path="/Payment/Cancel" element={<ProtectedRoute><PaymentResult type="cancel" /></ProtectedRoute>} />

          <Route path="/AdminMain" element={<Layout><AdminMain /></Layout>} />

          <Route path="/500" element={<ServerError/>} />{/* 서버에러500페이지 */}
          <Route path="*" element={<NotFound />} />{/* 404페이지 못 찾음 */}
        </Routes>
      {/* </BrowserRouter> */}
    </ToastProvider>
    </AuthProvider>
  );
}

export default App;