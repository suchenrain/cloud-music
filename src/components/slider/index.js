import React, { useEffect, useState } from 'react';
import { SliderContainer } from './style';
import Swiper from 'swiper';
// Import Swiper styles
import 'swiper/dist/css/swiper.css';

function Slider(props) {
    const [sliderSwiper, setSliderSwiper] = useState(null);
    const { bannerList } = props;

    useEffect(() => {
        if (bannerList.length && !sliderSwiper) {
            let newSliderSwiper = new Swiper('.slider-container', {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: { el: '.swiper-pagination', type: 'bullets' },
            });
            setSliderSwiper(newSliderSwiper);
        }
    }, [bannerList.length, sliderSwiper]);

    return (
        <SliderContainer>
            <div className="before"></div>
            <div className="slider-container">
                <div className="swiper-wrapper">
                    {bannerList.map((slider, index) => {
                        return (
                            <div className="swiper-slide" key={`${index}-${slider.imageUrl}`}>
                                <div className="slider-nav">
                                    <img src={slider.imageUrl} alt="推荐" width="100%" height="100%" />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="swiper-pagination"></div>
            </div>
        </SliderContainer>
    );
}

export default React.memo(Slider);
