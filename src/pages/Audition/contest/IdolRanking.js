import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAuditionListApi, getRankingApi, getAllIdolsApi } from "../../../api/auditionApi";
import "./IdolRanking.css";

const AVATAR_COLORS = [
  "#2d4a7a","#3a2d6b","#2d6b3a","#6b2d3a","#2d3a6b",
  "#6b5a2d","#3a6b2d","#5a2d6b","#2d5a6b","#6b2d5a",
];

const avColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];

const rankBadgeClass = (rank) => {
  if (rank === 1) return "ir-rb1";
  if (rank === 2) return "ir-rb2";
  if (rank === 3) return "ir-rb3";
  return "ir-rbn";
};

const rankColor = (rank) => {
  if (rank === 1) return "#B8860B";
  if (rank === 2) return "#888";
  if (rank === 3) return "#8B6914";
  return "rgba(232,244,248,0.35)";
};

/* ── 피라미드 카드 ── */
function PyramidCard({ idol, rank, total, imgMap, profileMap }) {
  const navigate = useNavigate();
  if (!idol) return <div className="ir-pcard" />;

  // API 응답: [idolId, name, rawVotes, totalBonus, finalVotes, mainImgUrl]
  const idolId     = idol[0];
  const name       = idol[1];
  const finalVotes = Number(idol[4] ?? 0);
  console.log(`${name}의 투표수 확인:`, finalVotes);
  const mainImgUrl = imgMap?.[idolId];
  const pct        = total > 0 ? (finalVotes / total * 100).toFixed(1) : "0.0";
  const profileId = profileMap?.[idolId];

  return (
      <div className="ir-pcard" 
      // 개인프로필로 등수 데이터 넘김
        onClick={() => navigate(`/Audition/profile/${profileId}`, { 
            state: { rank: rank, finalVotes: finalVotes } 
          })}>
            
      <div className="ir-av-wrap">
        <div className="ir-av" style={{ background: avColor(idolId) }}>
          {mainImgUrl ? (
            <img
              src={`${process.env.REACT_APP_API_URL.replace(/\/api$/, "")}/images/${mainImgUrl}`}
              alt={name}
              className="ir-av-img"
              onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
            />
          ) : null}
          <span style={{ display: mainImgUrl ? "none" : "flex" }}>
            {name?.charAt(0) ?? "#"}
          </span>
        </div>
        <div className={`ir-rbadge ${rankBadgeClass(rank)}`}>{rank}</div>
      </div>
      <p className="ir-pname">{name ?? `#${idolId}`}</p>
      <span className="ir-pvotes">{finalVotes.toLocaleString()} ({pct}%)</span>
    </div>

  );
}

/* ── 랭킹 행 카드 ── */
function RankCard({ idol, rank, total, imgMap, profileMap }) {
  const navigate  = useNavigate();
  const idolId    = idol[0];
  const name      = idol[1];
  const finalVotes = Number(idol[4] ?? 0);
  const mainImgUrl = imgMap?.[idolId];
  const pct        = total > 0 ? (finalVotes / total * 100).toFixed(1) : "0.0";
  const profileId = profileMap?.[idolId];

  return (
    <div
      className="ir-rescard"
      onClick={() => {
      console.log("보내는 데이터:", { rank, finalVotes: finalVotes }); // 보내기 직전 확인
      navigate(`/Audition/profile/${profileId}`, { 
        state: { rank: rank, finalVotes: finalVotes } // <-- 개인프로필 데이터 넘김
      });}}
    >
      <span className="ir-rc-rank" style={{ color: rankColor(rank) }}>
        {String(rank).padStart(2, "0")}
      </span>
      <div className="ir-rc-av" style={{ background: avColor(idolId) }}>
        {mainImgUrl ? (
            <img
              src={`${process.env.REACT_APP_API_URL.replace(/\/api$/, "")}/images/${mainImgUrl}`}
              alt={name}
              className="ir-av-img"
              onError={(e) => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
            />
          ) : null}
          <span style={{ display: mainImgUrl ? "none" : "flex" }}>
            {name?.charAt(0) ?? "#"}
          </span>
      </div>
      <div className="ir-rc-info">
        <div className="ir-rc-name">{name ?? `참가자 #${idolId}`}</div>
      </div>
      <div className="ir-rc-right">
        <div className="ir-rc-votes">{finalVotes.toLocaleString()}</div>
        <div className="ir-rc-pct">{pct}%</div>
      </div>
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function IdolRanking() {
  const [auditions,    setAuditions]    = useState([]);   // 회차 목록
  const [activeRound,  setActiveRound]  = useState(null); // 선택된 회차
  const [rankingData,  setRankingData]  = useState([]);   // 랭킹 데이터
  const [totalCount, setTotalCount]     = useState(0);    // 전체 참가자 수 (생존+탈락)
  const [allIdols, setAllIdols] = useState([]); // 전체 참가자 목록 (IdolList용)
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // 회차 목록 로드
  useEffect(() => {
    getAuditionListApi()
      .then((res) => {
        const list = res.data;
        setAuditions(list);
        // 기본 선택: 가장 최근 ended/ongoing 회차
        if (list.length > 0) {
          const defaultRound = list[list.length - 1];
          setActiveRound(defaultRound);
        }
      })
      .catch((err) => {
        console.error("❌ 회차 목록 조회 실패:", err);
        setError("회차 목록을 불러오지 못했어요.");
        setLoading(false);
      });
  }, []);

  // 회차 변경 시 랭킹 로드
  useEffect(() => {
    if (!activeRound) return;
    setLoading(true);
    setError(null);

    Promise.all([
        getRankingApi(activeRound.auditionId),
        getAllIdolsApi(activeRound.auditionId),  // ← 전체 참가자
    ])
    .then(([rankingRes, allIdolsRes]) => {
        setRankingData(rankingRes.data);
        setTotalCount(allIdolsRes.data.length);  // 전체 수 저장
        setAllIdols(allIdolsRes.data);
    })
    .catch((err) => {
      console.error("❌ 랭킹 조회 실패:", err);
      setError("랭킹 데이터를 불러오지 못했어요.");
    })
    .finally(() => setLoading(false));
  }, [activeRound]);

  // idolId → mainImgUrl 매핑
  const imgMap = useMemo(() => {
    const map = {};
    allIdols.forEach(i => { map[i.idolId] = i.mainImgUrl; });
    return map;
  }, [allIdols]);

  // idolId → idolProfileId 매핑
  const profileMap = useMemo(() => {
    const map = {};
    allIdols.forEach(i => { map[i.idolId] = i.idolProfileId; });
    return map;
  }, [allIdols]);

  // 집계
  const total   = rankingData.reduce((s, row) => s + Number(row[4] ?? 0), 0);
  const top10   = [...rankingData.slice(0, 10)];
  while (top10.length < 10) top10.push(null);

  const survived = rankingData.length;            // 생존자 수
  const eliminated = totalCount - survived;       // 탈락자 수
  const period   = activeRound
    ? `${activeRound.startDate} ~ ${activeRound.endDate}`
    : "";

  if (error) {
    return (
      <div className="ir-wrap">
        <div style={{ padding: "40px 24px", color: "rgba(232,244,248,0.4)" }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="ir-wrap">

      {/* 페이지 헤더 */}
      <div className="ir-page-header">
        <h2 className="ir-page-title">개인 순위</h2>
        <p className="ir-page-sub">회차별 투표 결과</p>
      </div>

      {/* 회차 탭 */}
      <div className="ir-topbar">
        <div className="ir-tabs">
          {auditions.map((a) => (
            <button
              key={a.auditionId}
              className={`ir-tab${activeRound?.auditionId === a.auditionId ? " on" : ""}`}
              onClick={() => setActiveRound(a)}
            >
              {a.round}차
            </button>
          ))}
        </div>
        <span className="ir-period">{period} 마감</span>
      </div>

      {/* 요약 카드 */}
      <div className="ir-summary">
        <div className="ir-sc">
          <p className="ir-sc-lbl">총 투표수</p>
          <p className="ir-sc-val">{loading ? "-" : total.toLocaleString()}</p>
          <p className="ir-sc-sub">해당 회차 누적</p>
        </div>
        <div className="ir-sc">
          <p className="ir-sc-lbl">참가자 수</p>
          <p className="ir-sc-val">{loading ? "-" : `${totalCount}명`}</p>
          <p className="ir-sc-sub">탈락 {loading ? "-" : `${eliminated}명`}</p>
        </div>
        <div className="ir-sc">
          <p className="ir-sc-lbl">1위 득표율</p>
          <p className="ir-sc-val">
            {loading || !rankingData[0] ? "-" : `${(Number(rankingData[0][4]) / total * 100).toFixed(1)}%`}
          </p>
          <p className="ir-sc-sub">
            {loading || !rankingData[0] ? "" : rankingData[0][1]}
          </p>
        </div>
      </div>

      <div className="ir-body">
        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(232,244,248,0.35)" }}>
            불러오는 중...
          </div>
        ) : (
          <div className="ir-two-col">

            {/* 왼쪽: TOP 10 피라미드 */}
            <div className="ir-left-col">
              <p className="ir-sec">TOP 10</p>
              <div className="ir-pyramid">
                <div className="ir-prow ir-r1">
                  <PyramidCard idol={top10[0]} rank={1} total={total} imgMap={imgMap} profileMap={profileMap} />
                </div>
                <div className="ir-prow ir-r2">
                  <PyramidCard idol={top10[1]} rank={2} total={total} imgMap={imgMap} profileMap={profileMap} />
                  <PyramidCard idol={top10[2]} rank={3} total={total} imgMap={imgMap} profileMap={profileMap} />
                </div>
                <div className="ir-prow ir-r3">
                  <PyramidCard idol={top10[3]} rank={4} total={total} imgMap={imgMap} profileMap={profileMap} />
                  <PyramidCard idol={top10[4]} rank={5} total={total} imgMap={imgMap} profileMap={profileMap} />
                  <PyramidCard idol={top10[5]} rank={6} total={total} imgMap={imgMap} profileMap={profileMap} />
                </div>
                <div className="ir-prow ir-r4">
                  <PyramidCard idol={top10[6]}  rank={7}  total={total} imgMap={imgMap} profileMap={profileMap} />
                  <PyramidCard idol={top10[7]}  rank={8}  total={total} imgMap={imgMap} profileMap={profileMap} />
                  <PyramidCard idol={top10[8]}  rank={9}  total={total} imgMap={imgMap} profileMap={profileMap} />
                  <PyramidCard idol={top10[9]}  rank={10} total={total} imgMap={imgMap} profileMap={profileMap} />
                </div>
              </div>
            </div>

            {/* 오른쪽: 전체 랭킹 스크롤 */}
            <div className="ir-right-col">
              <p className="ir-sec">전체 랭킹</p>
              <div className="ir-rank-scroll">
                {rankingData.map((idol, i) => (
                  <RankCard key={idol[0]} idol={idol} rank={i + 1} total={total} imgMap={imgMap} profileMap={profileMap} />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
