import React, { memo, useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  Container,
  HotKey,
  List,
  ListItem,
  ShortcutWrapper,
  SongItem,
} from './style';
import SearchBox from '@baseUI/search-box';
import { actionCreators } from '@application/search/store';
import { connect } from 'react-redux';
import Scroll from '@baseUI/scroll';
import Loading from '@baseUI/loading';
import LazyLoad, { forceCheck } from 'react-lazyload';
import musicPNG from './music.png';
import singerPNG from './singer.png';
import { getName } from '@api/utils';

function Search(props) {
  const {
    enterLoading,
    hotList,
    suggestList: immutableSuggestList,
    songsList: immutableSongsList,
    songsCount,
  } = props;

  const {
    getHotKeywordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch,
  } = props;

  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS();

  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setShow(true);
    if (!hotList.size) {
      getHotKeywordsDispatch();
    }
    // eslint-disable-next-line
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
    // eslint-disable-next-line
  }, []);

  const handleQuery = (q) => {
    setQuery(q);

    if (!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  };

  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
  };

  /*** UI function*/
  const renderHotKey = () => {
    let list = hotList ? hotList.toJS() : [];
    return (
      <ul>
        {list.map((item) => {
          return (
            <li
              className='item'
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderSingers = () => {
    let singers = suggestList.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className='title'> 相关歌手 </h1>
        {singers.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + '' + index}
              onClick={() => props.history.push(`/singers/${item.id}`)}
            >
              <div className='img_wrapper'>
                <LazyLoad
                  placeholder={
                    <img
                      width='100%'
                      height='100%'
                      src={singerPNG}
                      alt='singer'
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width='100%'
                    height='100%'
                    alt='music'
                  />
                </LazyLoad>
              </div>
              <span className='name'> 歌手: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className='title'> 相关歌单 </h1>
        {albums.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + '' + index}
              onClick={() => props.history.push(`/album/${item.id}`)}
            >
              <div className='img_wrapper'>
                <LazyLoad
                  placeholder={
                    <img
                      width='100%'
                      height='100%'
                      src={musicPNG}
                      alt='music'
                    />
                  }
                >
                  <img
                    src={item.coverImgUrl}
                    width='100%'
                    height='100%'
                    alt='music'
                  />
                </LazyLoad>
              </div>
              <span className='name'> 歌单: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };
  const renderSongs = () => {
    return (
      <List>
        <h1 className='title'> 相关歌曲 </h1>
        <SongItem style={{ paddingLeft: '20px' }}>
          {songsList.map((item) => {
            return (
              <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                <div className='info'>
                  <span>{item.name}</span>
                  <span>
                    {getName(item.artists)} - {item.album.name}
                  </span>
                </div>
              </li>
            );
          })}
        </SongItem>
      </List>
    );
  };

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames='fly'
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container play={songsCount}>
        <div className='search_box_wrapper'>
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className='title'> 热门搜索 </h1>
                {renderHotKey()}
              </HotKey>
            </div>
          </Scroll>
        </ShortcutWrapper>
        <ShortcutWrapper show={query}>
          <Scroll onScorll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        {enterLoading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition>
  );
}

const mapStateToProps = (state) => ({
  enterLoading: state.getIn(['search', 'enterLoading']),
  hotList: state.getIn(['search', 'hotList']),
  suggestList: state.getIn(['search', 'suggestList']),
  songsCount: state.getIn(['player', 'playList']).size,
  songsList: state.getIn(['search', 'songsList']),
});

const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeywordsDispatch() {
      dispatch(actionCreators.getHotKeyWords());
    },
    changeEnterLoadingDispatch(data) {
      dispatch(actionCreators.changeEnterLoading(data));
    },
    getSuggestListDispatch(data) {
      dispatch(actionCreators.getSuggestList(data));
    },
    getSongDetailDispatch(id) {
      dispatch(actionCreators.getSongDetail(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Search));
