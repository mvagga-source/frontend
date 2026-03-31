import React, { use, useEffect, useState } from "react";
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
import { getPageBookmarkApi, toggleBookmarkApi } from "../Common/BookmarkApi";
import LoadingScreen from "../../components/LoadingBar/LoadingBar";

/**
 * 굿즈 구매(상세)페이지
 * @returns 
 */
function GoodsView() {
    const { gno } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
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
        // [가상 데이터 세팅] 
        // 실제 API 호출 대신 0.5초 뒤에 데이터를 불러오는 것처럼 연출
        /*const mockData = {
        success: true,
        goods: {
            gno: gno || 1,
            gname: "[Limited Edition] 공식 굿즈 응원봉 세트\n본 상품은 한정판으로 제작된 공식 응원봉입니다.\n패키지 구성: 응원봉 1개, 포토카드 5종, 스트랩 1개.\n화려한 네온 블루 라이팅을 경험해보세요!",
            gcontent: "[Limited Edition] 공식 굿즈 응원봉 세트\n본 상품은 한정판으로 제작된 공식 응원봉입니다.\n패키지 구성: 응원봉 1개, 포토카드 5종, 스트랩 1개.\n화려한 네온 블루 라이팅을 경험해보세요!",
            price: 45000,
            stockCnt: 100000,
            status:"판매중",
            gdelPrice: 3000,
            gdelType: "일반배송",
            gdelivAddr: "서울시 강남구 물류센터",
            gimg: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1000", // 테스트용 이미지
            member: {
            id: "Official_Store"
            },
            delYn: "n"
        }
        };

        setTimeout(() => {
        setGoods(mockData.goods);
        }, 500);*/

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
            getPageBookmarkApi(user.id,"GOODS")
            .then((res) => {
                // 내 북마크 리스트 중 현재 상품(gno)이 있는지 확인
                // res.data는 List<BookmarkDto> 형태
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
            return;
        }
        toggleBookmarkApi(user.id, gno, "GOODS").then((res) => {
            console.log(res);
            // 기존 다른 사람이 만든 북마크 사용
            setIsBookmarked(res.data); 
        });
    };

    // 구매 버튼 클릭 시 실행
    const handleOpenModal = () => {
        if (!user) {
            alert("로그인 후 구매가 가능합니다.");
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
        <Content TitleName="Goods Detail">
        {/* 1. 데이터를 불러오는 중일 때 로딩바 표시 */}
        {loading && <LoadingScreen />}
        {goods && (<div className={commonStyles.viewContainer}>
            
            {/* [상단] 상품 핵심 정보 영역 */}
            <div className={styles.goodsTop}>
            <div className={styles.imageBox}>
                <img src={goods.gimg || "/no-image.png"} alt="굿즈이미지" />
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
                (남은 수량: <strong>{goods.stockCnt}</strong>개)
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
                <p>- 상품 수령 후 7일 이내 고객센터를 통해 신청 가능합니다.</p>
                <p>- 단순 변심의 경우 왕복 배송비(6,000원)는 구매자 부담입니다.</p>
                <p>- 상품 가치가 훼손된 경우 교환 및 반품이 불가합니다.</p>
                </div>
            )}
            </div>
        </div>)}
        </Content>
    );
}

export default GoodsView;