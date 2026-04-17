import { useState, useEffect } from "react";
import { getAuditionListApi, getMatchesApi } from "../../../api/auditionApi";
import "./TeamCompetition.css";

const AVATAR_COLORS = [
  "#2d4a7a","#3a2d6b","#2d6b3a","#6b2d3a","#2d3a6b",
  "#6b5a2d","#3a6b2d","#5a2d6b","#2d5a6b","#6b2d5a",
];

const avColor = (idx) => AVATAR_COLORS[idx % AVATAR_COLORS.length];

/* ── 팀원 칩 ── */
function MemberChip({ name, colorIdx, isWin }) {
  return (
    <div className={`tc-chip${isWin ? " win" : ""}`}>
      <div className="tc-mav" style={{ background: avColor(colorIdx) }}>
        {name.charAt(0)}
      </div>
      <span className="tc-mname">{name}</span>
    </div>
  );
}

/* ── 대결 카드 ── */
function MatchCard({ match, idx }) {
  // API 응답 필드: matchId, matchName, teamAId, teamAName, teamBId, teamBName,
  //               teamAScore, teamBScore, winnerTeamId, status, membersA, membersB
  const aScore = Number(match.teamAScore ?? 0);
  const bScore = Number(match.teamBScore ?? 0);
  const aWin   = match.winnerTeamId === match.teamAId ||
                 (match.winnerTeamId == null && aScore >= bScore);

  const aBg = AVATAR_COLORS[idx * 2 % AVATAR_COLORS.length];
  const bBg = AVATAR_COLORS[(idx * 2 + 1) % AVATAR_COLORS.length];
  const aColor = aWin ? "tc-color-win" : "tc-color-lose";
  const bColor = !aWin ? "tc-color-win" : "tc-color-lose";

  // 대표이미지
  const BASE_URL = process.env.REACT_APP_API_URL.replace(/\/api$/, "");

  return (
    <div className="tc-mcard">
      <div className="tc-mtop">
        <span className="tc-mround">{match.matchName}</span>
      </div>

      <div className="tc-mrow">
        <div className={`tc-team${aWin ? "" : " lose"}`}>
          <div className="tc-team-img-wrap">
            {match.teamAImgUrl
              ? <img src={`${BASE_URL}${match.teamAImgUrl}`} className="tc-team-img" alt={match.teamAName} />
              : <div className="tc-team-av" style={{ background: aBg }}>{match.teamAName.charAt(0)}</div>
            }
            {aWin && <span className="tc-win-b">🏆 승리</span>}
          </div>
          <p className="tc-team-name">{match.teamAName}</p>
        </div>

        <div className="tc-vsbox">
          <span className="tc-vstxt">VS</span>
          <div className="tc-score-row">
            <span className={`tc-score${aWin ? " sw" : " sl"}`}>{aScore}</span>
            <span className="tc-sep">:</span>
            <span className={`tc-score${!aWin ? " sw" : " sl"}`}>{bScore}</span>
          </div>
          <span className="tc-vstxt tc-pct-label">득표율(%)</span>
        </div>

        <div className={`tc-team${!aWin ? "" : " lose"}`}>
          <div className="tc-team-img-wrap">
            {match.teamBImgUrl
              ? <img src={`${BASE_URL}${match.teamBImgUrl}`} className="tc-team-img" alt={match.teamBName} />
              : <div className="tc-team-av" style={{ background: bBg }}>{match.teamBName.charAt(0)}</div>
            }
            {!aWin && <span className="tc-win-b">🏆 승리</span>}
          </div>
          <p className="tc-team-name">{match.teamBName}</p>
        </div>
      </div>

      {/* 팀 구성 */}
      {(match.membersA?.length > 0 || match.membersB?.length > 0) && (
        <div className="tc-member-area">
          <p className="tc-member-label">팀 구성</p>
          <div className="tc-member-grid">
            <div>
              <p className={`tc-col-title ${aColor}`}>{match.teamAName}</p>
              <div className="tc-chips">
                {(match.membersA ?? []).map((name, j) => (
                  <MemberChip key={j} name={name} colorIdx={j} isWin={aWin} />
                ))}
              </div>
            </div>
            <div>
              <p className={`tc-col-title ${bColor}`}>{match.teamBName}</p>
              <div className="tc-chips">
                {(match.membersB ?? []).map((name, j) => (
                  <MemberChip key={j} name={name} colorIdx={j + 5} isWin={!aWin} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function TeamCompetition() {
  const [auditions,   setAuditions]   = useState([]);   // 팀경연 있는 회차만
  const [activeRound, setActiveRound] = useState(null);
  const [matches,     setMatches]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // 회차 목록 로드 (팀경연 있는 회차만 필터)
  useEffect(() => {
    getAuditionListApi()
      .then((res) => {
        const teamRounds = res.data.filter((a) => a.hasTeamMatch);
        setAuditions(teamRounds);
        if (teamRounds.length > 0) {
          const doneRounds = teamRounds.filter((a) => a.hasMatchDone === true);
          const defaultRound = doneRounds.length > 0
            ? doneRounds[doneRounds.length - 1]
            : teamRounds[teamRounds.length - 1];
          setActiveRound(defaultRound);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("❌ 회차 목록 조회 실패:", err);
        setError("회차 목록을 불러오지 못했어요.");
        setLoading(false);
      });
  }, []);

  // 회차 변경 시 팀경연 로드
  useEffect(() => {
    if (!activeRound) return;
    setLoading(true);
    setError(null);

    getMatchesApi(activeRound.auditionId)
      .then((res) => {
        console.log("✅ 팀경연:", res.data);
        setMatches(res.data);
      })
      .catch((err) => {
        console.error("❌ 팀경연 조회 실패:", err);
        setError("팀경연 데이터를 불러오지 못했어요.");
      })
      .finally(() => setLoading(false));
  }, [activeRound]);

  const period = activeRound
    ? `${activeRound.startDate} ~ ${activeRound.endDate}`
    : "";

  return (
    <div className="tc-wrap">

      {/* 페이지 헤더 */}
      <div className="tc-page-header">
        <h2 className="tc-page-title">팀 경연</h2>
        <p className="tc-page-sub">회차별 팀 대결 결과</p>
      </div>

      {/* 회차 탭 */}
      <div className="tc-topbar">
        <div className="tc-tabs">
          {auditions.map((a) => (
            <button
              key={a.auditionId}
              className={`tc-tab${activeRound?.auditionId === a.auditionId ? " on" : ""}`}
              onClick={() => setActiveRound(a)}
            >
              {a.round}차
            </button>
          ))}
        </div>
        <span className="tc-period">{period} 마감</span>
      </div>

      <div className="tc-body">
        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(232,244,248,0.35)" }}>
            불러오는 중...
          </div>
        ) : error ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "rgba(232,244,248,0.35)" }}>
            {error}
          </div>
        ) : matches.length === 0 ? (
          <div className="tc-no-team"><p>이 회차는 팀경연 데이터가 없어요.</p></div>
        ) : (
          <>
            <p className="tc-sec">조별 대결 결과</p>
            <div className="tc-match-list">
              {matches.map((m, i) => (
                <MatchCard key={m.matchId} match={m} idx={i} />
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
