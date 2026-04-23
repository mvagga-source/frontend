import React, { use, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./GoodsView.module.css";
import commonStyles from "../Board/BoardView.module.css"; // 기존 게시판 스타일 재사용
import { DelBtn, SaveBtn, MoveBtn } from "../../components/button/Button";
import Content from "../../components/Title/ContentComp";
import GoodsReview from "./GoodsComponent/GoodsView/GoodsReview";
import { useAuth } from "../../context/AuthContext";
import DeliveryModal from "./popup/DeliveryModal";
import { getGoodsViewApi, GoodsDeleteApi } from "./GoodsApi"; // API 함수 가정
import GoodsContent from "./GoodsComponent/GoodsContent";
import { toggleBookmarkApi } from "../Common/BookmarkApi";
import { getMyPageBookmarskApi } from "../MyPage/MyMainApi";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";
import { useToast } from "../../context/ToastMsg/ToastContext";

/**
 * 굿즈 구매(상세)페이지
 * @returns 
 */
function GoodsView() {
    const { gno } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    
    const [goods, setGoods] = useState(null);
    const [activeTab, setActiveTab] = useState("detail"); // 탭 상태: detail, review, info
    const [orderCnt, setOrderCnt] = useState(1);
    const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
    const [loading, setLoading] = useState(false);

    // 상태값에 따른 CSS 클래스 매핑
    const STATUS_CLASS_MAP = {
        "판매중": styles.onSale,
        "품절": styles.soldOut,
        "판매중지": styles.hidden
    };

    useEffect(() => {
        if (loading) return;
        setLoading(true);
        // 상품 데이터 가져오기 로직 (예시)
        getGoodsViewApi({gno}).then((res) => {
            if (res.data.success) {
                setGoods(res.data.data);
            }
        }).finally(() => setLoading(false));

        // 로그인 상태라면 북마크 여부 확인
        if (user && user.id) {
            getMyPageBookmarskApi({
                memberId : user.id,
                pageType : "GOODS"
            })
            .then((res) => {
                // 내 북마크 리스트 중 현재 상품(gno)이 있는지 확인
                const exists = res.data.some(bookmark => String(bookmark.pageId) === String(gno));
                setIsBookmarked(exists);
            });
        }
    }, [gno]);

    // 수량 직접 입력 핸들러
    const handleQtyChange = (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setOrderCnt(1);
        } else if (value > goods.stockCnt) {
            alert(`최대 구매 가능 수량은 ${goods.stockCnt}개입니다.`);
            setOrderCnt(goods.stockCnt);
        } else {
            setOrderCnt(value);
        }
    };

    // blur 이벤트(입력창 포커스 나갈 때)에서 최소값 1 보장
    const handleBlur = () => {
        if (orderCnt === '' || orderCnt < 1) {
            setOrderCnt(1);
        }
    };

    // 북마크 토글 핸들러
    const handleBookmark = () => {
        if (!user) {
            alert("로그인 후 이용 가능합니다.");
            navigate("/UserLogin", { state: { from: window.location.pathname } });
            return;
        }
        toggleBookmarkApi(user.id, gno, "GOODS").then((res) => {
            // 기존 다른 사람이 만든 북마크 사용
            setIsBookmarked(res.data); 
            if(res.data){
                showToast("북마크에 추가되었습니다.");
            }else{
                showToast("북마크가 삭제되었습니다.");
            }
        });
    };

    // 구매 버튼 클릭 시 실행
    const handleOpenModal = () => {
        if (!user) {
            alert("로그인 후 구매가 가능합니다.");
            navigate("/UserLogin", { state: { from: window.location.pathname } });
            return;
        }
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (window.confirm("삭제하시겠습니까?")) {
            const formData = new FormData();
            formData.append("gno", gno);
            GoodsDeleteApi(formData).then((res) => {
                if (res.data.success) {
                    alert("삭제되었습니다.");
                    // replace: true를 추가하여 히스토리 스택에서 현재 페이지를 제거
                    navigate("/GoodsList", { replace: true });
                }
            });
        }
    };

    //if (!goods) return <LoadingScreen />;

    return (
        <>
        {/* <Content TitleName="Goods Detail"> */}
        {/* 1. 데이터를 불러오는 중일 때 로딩바 표시 */}
        {loading && <LoadingScreen />}
        {goods && (<div className={commonStyles.viewContainer}>
            {/* [상단] 상품 핵심 정보 영역 */}
            <div className={styles.goodsTop}>
            <div className={styles.imageBox}>
                <img src={`${process.env.REACT_APP_IMG_URL}${goods.gimg || "/no-image.png"}`} alt="굿즈이미지" />
            </div>
            
            <div className={styles.infoBox}>
                {/* [상단] 판매자 정보 및 북마크 행 */}
                <div className={styles.sellerBookmarkRow}>
                    <div className={styles.sellerArea}>
                    <span className={styles.sellerTitle}>판매자: </span>
                    <span className={styles.sellerId}>{goods.member?.nickname}</span>
                    <span className={`${styles.statusBadge} ${STATUS_CLASS_MAP[goods.status] || ""}`}>{goods.status}</span>
                    </div>
                    <div className={styles.actionArea}>
                    {user && user.id === goods.member?.id && (
                    <>
                        <span onClick={() => navigate(`/GoodsUpdate/${gno}`)}>수정</span>
                        <span className={styles.divider}>|</span>
                        <span onClick={handleDelete}>삭제</span>
                    </>
                    )}
                    {/* SVG 북마크 버튼 (기존 이미지 위에서 여기로 이동) */}
                    <button 
                        className={`${styles.topBookmark} ${isBookmarked ? styles.active : ""}`}
                        onClick={handleBookmark}
                        aria-label="북마크"
                    >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-4-7 4V5c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v16z"/>
                    </svg>
                    </button>
                    </div>
                </div>
                {/* 첫 줄만 제목으로 추출 */}
                <h2 className={styles.goodsName}>{goods.gname.split('\n')[0]}</h2>
                
                <div className={styles.priceArea}>
                <span className={styles.priceLabel}>판매가</span>
                <span className={styles.priceVal}>{goods.price?.toLocaleString()}원</span>
                {/* 잔여 재고 표시 */}
                <span className={styles.stockInfo}>
                (남은 수량: <strong>{goods.stockCnt?.toLocaleString()}</strong>개)
                </span>
                </div>

                <div className={styles.deliveryInfo}>
                <p>배송비: {goods.gdelPrice === 0 ? "무료배송" : `${goods.gdelPrice?.toLocaleString()}원`}</p>
                <p>배송타입: {goods.gdelType}</p>
                <p>출고지: {goods.gdelivAddr}</p>
                </div>

                <div className={styles.orderArea}>
                {/* 품절일 경우 수량 조절 막기 */}
                <div className={styles.qtySelector} style={{ opacity: goods.stockCnt === 0 ? 0.5 : 1 }}>
                <button 
                    onClick={() => setOrderCnt(Math.max(1, orderCnt - 1))}
                    disabled={goods.stockCnt === 0}
                >-</button>
                <input 
                    type="number" 
                    value={orderCnt} 
                    onChange={handleQtyChange}
                    onBlur={handleBlur}
                    readOnly={goods.stockCnt === 0}
                />
                <button 
                    onClick={() => setOrderCnt(Math.min(goods.stockCnt, orderCnt + 1))}
                    disabled={goods.stockCnt === 0}
                >+</button>
                </div>
                <div className={styles.totalPriceInfo}>
                    총 금액: <strong>{(goods.price * orderCnt + goods.gdelPrice).toLocaleString()}원</strong>
                </div>
                <button 
                    className={styles.kakaoPayBtn} 
                    disabled={goods.stockCnt === '품절' || goods.status === '판매중지' || goods.stockCnt <= 0}
                    onClick={handleOpenModal}
                >
                {goods.status === '품절' || goods.stockCnt <= 0 ? "품절된 상품입니다" : 
                goods.status === '판매중지' ? "판매 중단된 상품입니다" : "카카오페이로 구매하기"}
                </button>
                </div>
                {/* 배송 정보 모달 컴포넌트 추가 */}
                <DeliveryModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    totalPrice={goods.price * orderCnt + goods.gdelPrice} 
                    goods={goods}   //배송팝업의 결제에 넘길 굿즈정보
                    count={orderCnt} // 선택한 수량 추가
                />
            </div>
            </div>

            {/* 목록 이동 및 상품 관리 버튼 */}
            {/* <div className={commonStyles.btnArea} style={{ marginBottom: '20px', borderTop: 'none', borderBottom: '1px solid rgba(0, 242, 255, 0.1)', paddingBottom: '20px' }}>
                <MoveBtn onClick={() => navigate("/GoodsList")}>목록으로</MoveBtn>
            </div> */}

            {/* [중단] 탭 메뉴 */}
            <div className={styles.tabWrapper}>
            <button className={activeTab === "detail" ? styles.activeTab : ""} onClick={() => setActiveTab("detail")}>상세정보</button>
            <button className={activeTab === "review" ? styles.activeTab : ""} onClick={() => setActiveTab("review")}>리뷰</button>
            <button className={activeTab === "info" ? styles.activeTab : ""} onClick={() => setActiveTab("info")}>배송/교환/반품</button>
            </div>

            {/* [하단] 탭 콘텐츠 영역 */}
            <div className={styles.tabContent}>
            {activeTab === "detail" && (
                <div className={styles.detailText}>
                    <GoodsContent content={goods.gcontent} />
                </div>
            )}
            
            {activeTab === "review" && <GoodsReview gno={gno} sellerId={goods.member?.id} />}
            
            {activeTab === "info" && (
                <div className={styles.policyText}>
                <h4>[배송안내]</h4>
                <p>- 결제 완료 후 2-3일 이내 출고됩니다.</p>
                <p>- 도서산간 지역은 배송비가 추가될 수 있습니다.</p>
                <h4>[교환/반품 안내]</h4>
                <p>- 상품 수령 후 7일 이내 마이페이지를 통해 신청 가능합니다.</p>
                <p>- 단순 변심의 경우 왕복 배송비({goods.gdelPrice !== 0?(goods.gdelPrice*2)?.toLocaleString():'6,000'}원)는 구매자가 부담하며, 환불 금액에서 차감 후 정산됩니다.</p>
                <p>- 상품 가치가 훼손된 경우 교환 및 반품이 불가합니다.</p>
                <p>- 교환의 경우 판매자의 승인 후 다시 이 페이지에서 구매신청을 진행해 주세요.(품절인 경우 반품은 가능하지만 교환신청은 거부 될 수 있습니다.)</p>
                <h4>[주의 사항 (반품 불가)]</h4>
                <p>상품 택(Tag) 제거, 포장 훼손, 사용 흔적 등으로 인해 상품 가치가 감소한 경우 교환 및 반품이 절대 불가합니다.</p>
                <p>모니터 해상도에 따른 색상 차이는 제품 하자로 인정되지 않습니다.</p>
                <h4>[이용자 유의사항]</h4>
                <p>본 플랫폼은 안전한 거래를 위해 안전거래(에스크로) 시스템 이용을 권장합니다.</p>
                <p>판매자와 구매자 간의 직거래(개인 송금 등) 시 발생하는 사고 및 분쟁에 대해 플랫폼은 일체 책임을 지지 않습니다.</p>
                </div>
            )}
            </div>
        </div>)}
        {/* </Content> */}
        </>
    );
}

export default GoodsView;