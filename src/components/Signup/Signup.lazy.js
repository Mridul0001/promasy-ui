import React, { lazy, Suspense } from 'react';

const LazySignup = lazy(() => import('./Signup'));

const Signup = props => (
  <Suspense fallback={null}>
    <LazySignup {...props} />
  </Suspense>
);

export default Signup;
