import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import MiniPlayer from './mini';
import NormalPlayer from './normal';
import { findIndex, getSongUrl, isEmptyObject, shuffle } from '@api/utils';
import { playMode } from '@api/config';
import PlayList from './playList';
import { getLyricReq } from '@api/request';
import Lyric from '@api/lyric-parser';

function Player(props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  //记录之前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const audioRef = useRef();
  const songReady = useRef(true);
  const currentLyric = useRef();
  const [currentPlayingLyric, setPlayingLyric] = useState('');
  const currentLineNum = useRef(0);

  const {
    fullScreen,
    playing,
    playList: immutablePlayList,
    currentIndex,
    currentSong: immutableCurrentSong,
    mode,
    sequencePlayList: immutableSequencePlayList,
  } = props;
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changeModeDispatch,
    changePlayListDispatch,
  } = props;

  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      // @ts-ignore
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    )
      return;

    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    songReady.current = false;
    setPreSong(current);
    // @ts-ignore
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      // @ts-ignore
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    getLyric(current.id);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);
    togglePlayingDispatch(true);
    // eslint-disable-next-line
  }, [playList, currentIndex]);

  useEffect(() => {
    // @ts-ignore
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  const getLyric = (id) => {
    let lyric = '';
    if (currentLyric.current) {
      // @ts-ignore
      currentLyric.current.stop();
    }
    getLyricReq(id)
      .then((data) => {
        // @ts-ignore
        lyric = data.lrc.lyric;
        if (!lyric) {
          currentLyric.current = null;
          return;
        }
        // @ts-ignore
        currentLyric.current = new Lyric(lyric, handleLyric);
        // @ts-ignore
        currentLyric.current.play();
        currentLineNum.current = 0;
        // @ts-ignore
        currentLyric.current.seek(0);
      })
      .catch(() => {
        // songReady.current = true;
        // @ts-ignore
        // audioRef.current.play();
      });
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    pauseLyric();
  };

  const pauseLyric = () => {
    if (currentLyric.current) {
      // @ts-ignore
      currentLyric.current.togglePlay(currentTime * 1000);
    }
  };

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    // @ts-ignore
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
		
    if (currentLyric.current) {
      // @ts-ignore
      currentLyric.current.seek(newTime * 1000);
    }
  };

  const handleLoop = () => {
    // @ts-ignore
    audioRef.current.currentTime = 0;
    // changePlayingState(true);
    togglePlayingDispatch(true);
    // @ts-ignore
    audioRef.current.play();
  };

  const handlePrev = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };
  const handlePlayError = () => {
    songReady.current = true;
    togglePlayingDispatch(false);
    pauseLyric();
  };

  const changeMode = () => {
    const newMode = (mode + 1) % 3;
    if (newMode === playMode.sequence) {
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === playMode.loop) {
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === playMode.random) {
      const newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          percent={percent}
          toggleFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
          clickPlaying={clickPlaying}
        ></MiniPlayer>
      )}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          mode={mode}
          fullScreen={fullScreen}
          percent={percent}
          playing={playing}
          duration={duration}
          currentTime={currentTime}
          toggleFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
          handlePrev={handlePrev}
          handleNext={handleNext}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          changeMode={changeMode}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum.current}
        ></NormalPlayer>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handlePlayError}
      ></audio>
      <PlayList></PlayList>
    </div>
  );
}

const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
});

const mapDispatchToProps = (dispatch) => ({
  togglePlayingDispatch(data) {
    dispatch(actionCreators.changePlayingState(data));
  },
  toggleFullScreenDispatch(data) {
    dispatch(actionCreators.changeFullScreen(data));
  },
  togglePlayListDispatch(data) {
    dispatch(actionCreators.changeShowPlayList(data));
  },
  changeCurrentIndexDispatch(index) {
    dispatch(actionCreators.changeCurrentIndex(index));
  },
  changeCurrentDispatch(data) {
    dispatch(actionCreators.changeCurrentSong(data));
  },
  changeModeDispatch(data) {
    dispatch(actionCreators.changePlayMode(data));
  },
  changePlayListDispatch(data) {
    dispatch(actionCreators.changePlayList(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
