import React, { lazy, Suspense } from 'react';

const LazyProject = lazy(() => import('./Project'));

const Project = props => (
  <Suspense fallback={null}>
    <LazyProject {...props} />
  </Suspense>
);

export default Project;
