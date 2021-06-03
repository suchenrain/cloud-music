import { prefixStyle } from '@api/utils';
import React, { memo, useEffect, useRef, useState } from 'react';
import { ProgressBarWrapper } from './style';

function ProgressBar(props) {
  const { percent } = props;
  const { percentChange } = props;

  const progressBar = useRef();
  const progress = useRef();
  const progressBtn = useRef();
  const [touch, setTouch] = useState({});

  const transform = prefixStyle('transform');

  useEffect(() => {
    // @ts-ignore
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      // @ts-ignore
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      const offsetWidth = percent * barWidth;
      // @ts-ignore
      progress.current.style.width = `${offsetWidth}px`;
      // @ts-ignore
      progressBtn.current.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
  }, [percent]);

  const progressBtnWidth = 0;

  const _offset = (offsetWidth) => {
    // @ts-ignore
    progress.current.style.width = `${offsetWidth}px`;
    // @ts-ignore
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  const _changePercent = () => {
    // @ts-ignore
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    // @ts-ignore
    const curPercent = progress.current.clientWidth / barWidth; // 新的进度计算
    percentChange(curPercent); // 把新的进度传给回调函数并执行
  };

  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true; //initial 为 true 表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX; // 滑动开始时横向坐标
    // @ts-ignore
    startTouch.left = progress.current.clientWidth; // 当前 progress 长度
    setTouch(startTouch);
  };

  const progressTouchMove = (e) => {
    // @ts-ignore
    if (!touch.initiated) return;
    // 滑动距离
    // @ts-ignore
    const deltaX = e.touches[0].pageX - touch.startX;
    // @ts-ignore
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    // @ts-ignore
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };

  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch));
    endTouch.initiated = false;
    setTouch(endTouch);
    _changePercent();
  };

  const progressClick = (e) => {
    e.stopPropagation();
    // @ts-ignore
    const rect = progressBar.current.getBoundingClientRect();
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);
    _changePercent();
  };

  return (
    <ProgressBarWrapper>
      <div className='bar-inner' ref={progressBar} onClick={progressClick}>
        <div className='progress' ref={progress}></div>
        <div
          className='progress-btn-wrapper'
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className='progress-btn'></div>
        </div>
      </div>
    </ProgressBarWrapper>
  );
}

export default memo(ProgressBar);
