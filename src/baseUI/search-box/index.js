import { debounce } from '@api/utils';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { SearchBoxWrapper } from './style';

const SearchBox = (props) => {
  const queryRef = useRef();
  const [query, setQuery] = useState('');

  const { newQuery } = props;
  const { handleQuery } = props;
  const displayStyle = query ? { display: 'block' } : { display: 'none' };

  useEffect(() => {
    // @ts-ignore
    queryRef.current.focus();
  }, []);

  useEffect(() => {
    handleQueryDebounce(query);
    // eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    if (newQuery !== query) {
      setQuery(newQuery);
    }
    // eslint-disable-next-line
  }, [newQuery]);

  const handleChange = (e) => {
    setQuery(e.currentTarget.value);
  };

  let handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500);
  }, [handleQuery]);

  const clearQuery = () => {
    setQuery('');
    // @ts-ignore
    queryRef.current.focus();
  };

  return (
    <SearchBoxWrapper>
      <i className='iconfont icon-back' onClick={() => props.back()}>
        &#xe655;
      </i>
      <input
        type='text'
        ref={queryRef}
        className='box'
        placeholder='搜索歌曲、歌手、专辑'
        value={query}
        onChange={handleChange}
      />
      <i
        className='iconfont icon-delete'
        onClick={clearQuery}
        style={displayStyle}
      >
        &#xe600;
      </i>
    </SearchBoxWrapper>
  );
};

export default memo(SearchBox);
