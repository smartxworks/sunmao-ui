import whyDidYouRender from '@welldone-software/why-did-you-render';
import React from 'react';

// Make sure to only include the library in development
if (process.env.NODE_ENV === 'development') {
  // const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
