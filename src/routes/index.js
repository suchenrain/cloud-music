import React from 'react';
import { Redirect } from 'react-router-dom';
import Home from '@application/home';
import Recommend from '@application/recommend';
import Singers from '@application/singers';
import Rank from '@application/rank';
import Album from '@application/album';

const routes = [
  {
    path: '/',
    component: Home,
    routes: [
      {
        path: '/',
        exact: true,
        render: () => <Redirect to={'/recommend'} />,
      },
      {
        path: '/recommend',
        component: Recommend,
        routes: [
          {
            path: '/recommend/:id',
            component: Album,
          },
        ],
      },
      {
        path: '/singers',
        component: Singers,
      },
      {
        path: '/rank',
        component: Rank,
        key: 'rank',
        routes: [
          {
            path: '/rank/:id',
            component: Album,
          },
        ],
      },
    ],
  },
];

export default routes;
