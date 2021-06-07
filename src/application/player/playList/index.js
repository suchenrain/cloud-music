import { playMode } from '@api/config';
import { findIndex, getName, prefixStyle, shuffle } from '@api/utils';
import Scroll from '@baseUI/scroll';
import React, { memo, useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { actionCreators } from '../store';
import {
  ListContent,
  ListHeader,
  PlayListWrapper,
  ScrollWrapper,
} from './style';

import Confirm from '@baseUI/confirm';

function PlayList(props) {
  const {
    showPlayList,
    playList: immutablePlayList,
    sequencePlayList: immutableSequencePlayList,
    currentIndex,
    currentSong: immutableCurrentSong,
    mode,
  } = props;

  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeModeDispatch,
    changePlayListDispatch,
    deleteSongDispatch,
    clearDispatch,
  } = props;

  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  const playListRef = useRef();
  const listWrapperRef = useRef();
  const listContentRef = useRef();
  const confirmRef = useRef();
  const [isShow, setIsShow] = useState(false);

  const [canTouch, setCanTouch] = useState(true);
  //touchStart 后记录 y 值
  const [startY, setStartY] = useState(0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState(false);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);

  const transform = prefixStyle('transform');

  // hooks
  const onEnterCB = useCallback(() => {
    setIsShow(true);
    // @ts-ignore
    listWrapperRef.current.style[transform] = `translate3d(0,100%,0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    // 让列表展现
    // @ts-ignore
    listWrapperRef.current.style['transition'] = 'all 0.3s';
    // @ts-ignore
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitingCB = useCallback(() => {
    // @ts-ignore
    listWrapperRef.current.style['transition'] = 'all 0.3s';
    // @ts-ignore
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    // @ts-ignore
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  const getPlayMode = () => {
    let content, text;
    if (mode === playMode.sequence) {
      content = '&#xe625;';
      text = '顺序播放';
    } else if (mode === playMode.loop) {
      content = '&#xe653;';
      text = '单曲循环';
    } else {
      content = '&#xe61b;';
      text = '随机播放';
    }
    return (
      <div>
        <i
          className='iconfont'
          onClick={(e) => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></i>
        <span className='text' onClick={(e) => changeMode(e)}>
          {text}
        </span>
      </div>
    );
  };

  const changeMode = (e) => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  const getCurrentIcon = (item) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;' : '';
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></i>
    );
  };

  const handleChangeCurrentIndex = (index) => {
    if (currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  };

  const handleDeleteSong = (e, song) => {
    e.stopPropagation();
    deleteSongDispatch(song);
  };

  const handleShowClear = () => {
    // @ts-ignore
    confirmRef.current.show();
  };

  const handleConfirmClear = () => {
    clearDispatch();
  };

  // 滑动关闭
  const handleTouchStart = (e) => {
    if (!canTouch || initialed) return;
    // @ts-ignore
    listWrapperRef.current.style['transition'] = '';
    setStartY(e.nativeEvent.touches[0].pageY); // 记录 y 值
    setInitialed(true);
  };
  const handleTouchMove = (e) => {
    if (!canTouch || !initialed) return;
    let distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance(distance); // 记录下滑距离
    // @ts-ignore
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`;
  };
  const handleTouchEnd = (e) => {
    setInitialed(false);
    // 这里设置阈值为 150px
    if (distance >= 150) {
      // 大于 150px 则关闭 PlayList
      togglePlayListDispatch(false);
    } else {
      // 否则反弹回去
      // @ts-ignore
      listWrapperRef.current.style['transition'] = 'all 0.3s';
      // @ts-ignore
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`;
    }
    // 重置distance
    setDistance(0);
  };

  const handleScroll = (pos) => {
    // 只有当内容偏移量为 0 的时候才能下滑关闭 PlayList。否则一边内容在移动，一边列表在移动，出现 bug
    let state = pos.y === 0;
    setCanTouch(state);
  };

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames='list-fade'
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? { display: 'block' } : { display: 'none' }}
        onClick={() => {
          togglePlayListDispatch(false);
        }}
      >
        <div
          className='list_wrapper'
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className='title'>
              {getPlayMode()}
              <span className='iconfont clear' onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={(pos) => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {playList.map((item, index) => {
                  return (
                    <li
                      className='item'
                      key={item.id}
                      onClick={() => {
                        handleChangeCurrentIndex(index);
                      }}
                    >
                      {getCurrentIcon(item)}
                      <span className='text'>
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className='like'>
                        <i className='iconfont'>&#xe601;</i>
                      </span>
                      <span
                        className='delete'
                        onClick={(e) => {
                          handleDeleteSong(e, item);
                        }}
                      >
                        <i className='iconfont'>&#xe63d;</i>
                      </span>
                    </li>
                  );
                })}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          // @ts-ignore
          text={'确定清空播放列表?'}
          cancelBtnText={'取消'}
          confirmBtnText={'确定'}
          handleConfirm={handleConfirmClear}
        />
      </PlayListWrapper>
    </CSSTransition>
  );
}

const mapStateToProps = (state) => ({
  showPlayList: state.getIn(['player', 'showPlayList']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  mode: state.getIn(['player', 'mode']),
});

const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayListDispatch(data) {
      dispatch(actionCreators.changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(actionCreators.changeCurrentIndex(data));
    },
    changeModeDispatch(data) {
      dispatch(actionCreators.changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(actionCreators.changePlayList(data));
    },
    deleteSongDispatch(data) {
      dispatch(actionCreators.deleteSong(data));
    },
    clearDispatch() {
      // 1. 清空两个列表
      dispatch(actionCreators.changePlayList([]));
      dispatch(actionCreators.changeSequecePlayList([]));
      // 2. 初始 currentIndex
      dispatch(actionCreators.changeCurrentIndex(-1));
      // 3. 关闭 PlayList 的显示
      dispatch(actionCreators.changeShowPlayList(false));
      // 4. 将当前歌曲置空
      dispatch(actionCreators.changeCurrentSong({}));
      // 5. 重置播放状态
      dispatch(actionCreators.changePlayingState(false));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(PlayList));
