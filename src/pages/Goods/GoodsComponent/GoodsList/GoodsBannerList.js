import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import styles from "./GoodsBannerList.module.css";
import { getGoodsBannerListApi } from "../../GoodsApi";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function GoodsBanner({}) {
    const navigate = useNavigate();
    const [bannerList, setBannerList] = useState([]); // 배너 리스트 상태 추가
    
    // 배너 데이터를 가져오는 함수
    const getBannerData = async () => {
        // 상위 5개 요청
        getGoodsBannerListApi(5).then((res) => {
            if (res.data && res.data.success) {
                setBannerList(res.data.list || []);
            }
        });
    };

    useEffect(() => {
        getBannerData();
    }, []);

    return (
        <>
        {bannerList.length > 0 ? (
        <div className={styles.heroSlider}>
            <Swiper 
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                speed={800}
                loop={bannerList.length > 1}
                className={styles.mySwiper}
            >
                {bannerList.map((banner, index) => {
                    const avg = Number(banner.AVGRATING || banner.avgRating || 0);
                    const reviewCnt = banner.REVIEWCNT || banner.reviewCnt || 0;

                    return (
                    <SwiperSlide key={banner.GNO || banner.gno}>
                        <div 
                        className={styles.mainSlide}
                        onClick={() => navigate(`/GoodsView/${banner.GNO || banner.gno}`)}
                        >
                        
                        {/* 왼쪽 텍스트 영역 */}
                        <div className={styles.leftContent}>
                            
                            <div className={styles.topStatus}>
                            <span className={styles.rankBadge}>TOP {index + 1}</span>
                            <span className={styles.statusText}>평점 기준 베스트</span>
                            </div>

                            <span className={styles.ratingBadge}>
                            ⭐ {avg.toFixed(2)}
                            <small>
                                ({reviewCnt} reviews)
                                {reviewCnt < 5 && " · NEW"}
                            </small>
                            </span>

                            <h2>{banner.GNAME || banner.gname}</h2>

                            <p className={styles.priceText}>
                            지금 가장 사랑받는 굿즈
                            <strong>
                                {(banner.PRICE || banner.price)?.toLocaleString()}원
                            </strong>
                            </p>

                            <span className={styles.sellerTag}>
                            판매자: {banner.SELLERID || banner.sellerId}
                            </span>

                            <button className={styles.ctaBtn}>
                            상품 보러가기 →
                            </button>
                        </div>

                        {/* 오른쪽 이미지 영역 */}
                        <div className={styles.rightImage}>
                            <img 
                            src={`${process.env.REACT_APP_IMG_URL}${banner.GIMG || banner.gimg}`} 
                            alt={banner.GNAME || banner.gname} 
                            />
                        </div>

                        </div>
                    </SwiperSlide>
                    );
                })}
            </Swiper>
            </div>
            ) : (
                <>
                <div className={styles.heroSlider}>
                <Swiper 
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    speed={800}
                    loop={bannerList.length > 1}
                    className={styles.mySwiper}
                >
                    <SwiperSlide>
                        <div className={styles.mainSlide}>
                            <div className={styles.leftContent}>
                            <h2>인기 굿즈를 만나보세요</h2>
                            <p>리뷰가 증명하는 베스트 아이템</p>
                        </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
                </div>
                </>
            )}
        </>
    );
}

export default GoodsBanner;