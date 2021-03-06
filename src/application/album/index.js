import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Container, Menu, TopDesc } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '@baseUI/header';
import Scroll from '@baseUI/scroll';
import { getCount, isEmptyObject } from '@api/utils';
import { HEADER_HEIGHT } from '@api/config';
import style from '@assets/global-style';
import { actionCreators } from './store';
import { connect } from 'react-redux';
import Loading from '@baseUI/loading';
import SongList from '@application/songList';
import MusicNote from '@baseUI/music-note';

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState('歌单');
  const [isMarquee, setIsMarquee] = useState(false); // 是否跑马灯

  const musicNoteRef = useRef();

  const musicAnimation = (x, y) => {
    // @ts-ignore
    musicNoteRef.current.startAnimation({ x, y });
  };

  //歌单id
  const id = props.match.params.id;

  const {
    currentAlbum: currentAlbumImmutable,
    enterLoading,
    songsCount,
  } = props;
  const { getAlbumDataDispatch } = props;

  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  let currentAlbum = currentAlbumImmutable.toJS();

  const headerEl = useRef();

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      // 滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style['theme-color'];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbum.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = '';
        headerDom.style.opacity = 1;
        setTitle('歌单');
        setIsMarquee(false);
      }
    },
    [currentAlbum]
  );

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className='background'>
          <div className='filter'></div>
        </div>
        <div className='img_wrapper'>
          <div className='decorate'></div>
          <img src={currentAlbum.coverImgUrl} alt='' />
          <div className='play_count'>
            <i className='iconfont play'>&#xe885;</i>
            <span className='count'>
              {getCount(currentAlbum.subscribedCount)}
            </span>
          </div>
        </div>
        <div className='desc_wrapper'>
          <div className='title'>{currentAlbum.name}</div>
          <div className='person'>
            <div className='avatar'>
              <img src={currentAlbum.creator.avatarUrl} alt='' />
            </div>
            <div className='name'>{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className='iconfont'>&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className='iconfont'>&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className='iconfont'>&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className='iconfont'>&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  const renderSongList = () => {
    return (
      <SongList
        showBackground={true}
        collectCount={currentAlbum.subscribedCount}
        showCollect={true}
        songs={currentAlbum.tracks}
        musicAnimation={musicAnimation}
      ></SongList>
    );
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames='fly'
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        ></Header>
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {renderSongList()}
            </div>
          </Scroll>
        ) : null}
        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(actionCreators.changeEnterLoading(true));
      dispatch(actionCreators.getAlbumList(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Album));
