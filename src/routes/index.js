import React, { lazy, Suspense } from 'react';
import { Redirect } from 'react-router-dom';
import Home from '@application/home';

const RecommendComponent = lazy(() => import('@application/recommend'));
const SingersComponent = lazy(() => import('@application/singers'));
const RankComponent = lazy(() => import('@application/rank'));
const AlbumComponent = lazy(() => import('@application/album'));
const SingerComponent = lazy(() => import('@application/singer'));

const SuspenseComponent = (Component) => (props) => {
  return (
    <Suspense fallback={null}>
      <Component {...props}></Component>
    </Suspense>
  );
};

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
        component: SuspenseComponent(RecommendComponent),
        key: 'recommend',
        routes: [
          {
            path: '/recommend/:id',
            component: SuspenseComponent(AlbumComponent),
          },
        ],
      },
      {
        path: '/singers',
        component: SuspenseComponent(SingersComponent),
        key: 'singers',
        routes: [
          {
            path: '/singers/:id',
            component: SuspenseComponent(SingerComponent),
          },
        ],
      },
      {
        path: '/rank',
        component: SuspenseComponent(RankComponent),
        key: 'rank',
        routes: [
          {
            path: '/rank/:id',
            component: SuspenseComponent(AlbumComponent),
          },
        ],
      },
    ],
  },
];

export default routes;
