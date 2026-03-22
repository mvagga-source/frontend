import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { SearchBar, NumberInput } from "../../components/input/Input";
import { SearchBtn } from "../../components/button/Button";
import { SearchSelectBar } from "../../components/SelectBox/SelectBox";
import Content from "../../components/Title/ContentComp";
import styles from "./GoodsList.module.css";
import PriceFilter from "./popup/PriceFilter";

function GoodsList() {
    const navigate = useNavigate();
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    
    const searchOptions = [
        { value: "", label: "전체" },
        { value: "gname", label: "상품명" },
        { value: "idol", label: "참가자명" },
        { value: "idolGroup", label: "그룹명" },
    ];

    const [goodsData] = useState([
        { gno: 1, name: "에스파 응원봉 (OFFICIAL LIGHT STICK)", price: 50000, img: "https://fanplee.com/web/product/big/202404/73e492cd6b7a4a4d918047d49a6dbb87.png", group: "aespa" },
        { gno: 2, name: "아이브 포토카드 세트", price: 12000, img: "https://fanplee.com/web/product/big/202404/73e492cd6b7a4a4d918047d49a6dbb87.png", group: "IVE" },
        { gno: 3, name: "뉴진스 공식 티셔츠 (White)", price: 35000, img: "https://fanplee.com/web/product/big/202404/73e492cd6b7a4a4d918047d49a6dbb87.png", group: "NewJeans" },
        { gno: 4, name: "르세라핌 미니 3집 앨범", price: 18000, img: "https://fanplee.com/web/product/big/202404/73e492cd6b7a4a4d918047d49a6dbb87.png", group: "LE SSERAFIM" },
    ]);

    // 가격 필터 활성화 여부
    const isPriceFilterActive = minPrice !== "" || maxPrice !== "";

    return (
        <Content TitleName="K-POP GOODS SHOP">
            <div className={styles.wrapper}>
                <div className={styles.contentContainer}>
                    
                    {/* 1. 상단 메인 배너 - 텍스트 가독성 확보 */}
                    <div className={styles.heroSlider}>
                        <Swiper 
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            loop={true}
                            className={styles.mySwiper} // 클래스 추가
                        >
                            <SwiperSlide>
                                {/* 배경 이미지 스타일로 처리하여 높이 고정 */}
                                <div className={`${styles.mainSlide} ${styles.slideBg1}`}>
                                    <div className={styles.slideTextContainer}>
                                        <span className={styles.slideSubTitle}>NEW COLLECTION</span>
                                        <h2>AESPA OFFICIAL MERCH</h2>
                                        <p>지금 바로 한정판 굿즈를 확인하세요</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className={`${styles.mainSlide} ${styles.slideBg2}`}>
                                    <div className={styles.slideTextContainer}>
                                        <span className={styles.slideSubTitle}>BEST ITEM</span>
                                        <h2>WEEKLY POPULAR</h2>
                                        <p>이번 주 가장 많이 사랑받은 아이템</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>

                    {/* 2. 쇼핑몰형 상세 검색 필터 (디자인 수정) */}
                    <div className={styles.filterSection}>
                        <div className={styles.filterBar}>
                            <div className={styles.searchFilterGroup}>
                                {/* z-index 이슈 해결을 위해 컴포넌트를 감싸는 div 추가 가능 */}
                                <SearchSelectBar options={searchOptions}/>
                                <div className={styles.innerDivider}></div>
                                <input 
                                    type="text" 
                                    placeholder="상품명 또는 오디션참가자를 검색하세요" 
                                    className={styles.mainSearchInput}
                                />
                                {/* 가격 팝업 */}
                                <PriceFilter
                                    minPrice={minPrice}
                                    setMinPrice={setMinPrice}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                />
                                <button className={styles.inlineSearchBtn}>검색</button>
                            </div>
                        </div>
                    </div>

                    {/* 3. 리스트 상단 컨트롤러 */}
                    <div className={styles.listHeader}>
                        <p className={styles.totalCount}>총 <span>{goodsData.length}</span>개의 상품이 있습니다</p>
                        
                        <div className={styles.headerControls}>
                            {/* 가격 필터 (정렬 왼쪽에 배치) */}
                            {/* <div className={styles.inlinePriceFilter}>
                                <span className={styles.filterLabel}>가격대</span>
                                <NumberInput 
                                    placeholder="최소" 
                                    style={{
                                        width: '80px', height: '20px', background: '#1a212e',
                                        border: '1px solid #333', borderRadius: '4px',
                                        color: '#fff', fontSize: '12px', textAlign: 'right', padding: '0 8px'
                                    }}
                                />
                                <span className={styles.tilde}>~</span>
                                <NumberInput 
                                    placeholder="최대" 
                                    style={{
                                        width: '80px', height: '20px', background: '#1a212e',
                                        border: '1px solid #333', borderRadius: '4px',
                                        color: '#fff', fontSize: '12px', textAlign: 'right', padding: '0 8px'
                                    }}
                                />
                                <button className={styles.miniResetBtn}>초기화</button>
                            </div> */}

                            <div className={styles.vDivider}></div>

                            {/* 정렬 옵션 */}
                            <div className={styles.sortOptions}>
                                <button className={styles.activeSort}>최신순</button>
                                <button>낮은가격순</button>
                                <button>높은가격순</button>
                            </div>
                        </div>
                    </div>

                    {/* 4. 상품 리스트 그리드 */}
                    <div className={styles.productGrid}>
                        {goodsData.map((item) => (
                            <div key={item.gno} className={styles.productCard} onClick={() => navigate(`/GoodsView/${item.gno}`)}>
                                <div className={styles.thumbnailBox}>
                                    <img src={item.img} alt={item.name} />
                                    <div className={styles.cardOverlay}>VIEW DETAIL</div>
                                </div>
                                <div className={styles.productDesc}>
                                    <span className={styles.groupTag}>{item.group}</span>
                                    <h3 className={styles.productTitle}>{item.name}</h3>
                                    <p className={styles.productPrice}>
                                        {item.price.toLocaleString()}<span>원</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </Content>
    );
}

export default GoodsList;