import React, { memo, useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container } from './style';
import SearchBox from '@baseUI/search-box';

function Search(props) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setShow(true);
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    setQuery(q);
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
      <Container>
        <div className='search_box_wrapper'>
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
      </Container>
    </CSSTransition>
  );
}

export default memo(Search);
