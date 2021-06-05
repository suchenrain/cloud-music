import { prefixStyle } from '@api/utils';
import style from '@assets/global-style';
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style['theme-color']};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    transform: translate3d(0, 0, 0);
    > div {
      transition: transform 1s;
    }
  }
`;

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef();
  const ICON_NUMBER = 3;

  const transform = prefixStyle('transform');

  // 原生 DOM 操作，返回一个 DOM 节点对象
  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    return tempNode.firstChild;
  };

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      // @ts-ignore
      iconsRef.current.appendChild(node);
    }
    // 类数组转换成数组，当然也可以用 [...xxx] 解构语法或者 Array.from ()
    // @ts-ignore
    let domArray = [].slice.call(iconsRef.current.children);
    domArray.forEach((item) => {
      item.running = false;
      item.addEventListener(
        'transitionend',
        function () {
          // @ts-ignore
          this.style['display'] = 'none';
          // @ts-ignore
          this.style[transform] = `translate3d(0, 0, 0)`;
          this.running = false;

          // @ts-ignore
          let icon = this.querySelector('div');
          icon.style[transform] = `translate3d(0, 0, 0)`;
        },
        false
      );
    });
    //eslint-disable-next-line
  }, []);

  const startAnimation = ({ x, y }) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      // @ts-ignore
      let domArray = [].slice.call(iconsRef.current.children);
      let item = domArray[i];
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.style.display = 'inline-block';

        setTimeout(() => {
          item.running = true;
          item.style[transform] = `translate3d(0, 750px, 0)`;
          let icon = item.querySelector('div');
          icon.style[transform] = `translate3d(-40px, 0, 0)`;
        }, 20);
        break;
      }
    }
  };
  // 外界调用的 ref 方法
  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  return <Container ref={iconsRef}></Container>;
});

export default memo(MusicNote);
