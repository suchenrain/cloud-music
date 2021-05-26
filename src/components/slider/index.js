import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Swiper from 'swiper';
import { SliderContainer } from './style';

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
                pagination: { el: '.swiper-pagination' },
            });
            setSliderSwiper(newSliderSwiper);
        }
    }, [bannerList.length, sliderSwiper]);

    return (
        <SliderContainer>
            <div className="slider-container">
                <div className="swiper-wrapper">
                    {bannerList.map((slider, index) => {
                        return (
                            <div className="swiper-slide" key={index}>
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
