import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { CORE_VERSION, CoreComponentName, StringUnion } from '@sunmao-ui/shared';
import { css } from '@emotion/css';
import React, { useEffect } from 'react';

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: CoreComponentName.Iframe,
    displayName: 'Iframe',
    description: '',
    exampleProperties: {
      src: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
      referrerpolicy: 'unset',
      sandbox: 'unset',
      fetchpriority: 'auto',
    },
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: Type.Object({
      src: Type.String({ title: 'Src' }),
      referrerpolicy: StringUnion(
        [
          'unset',
          'no-referrer',
          'no-referrer-when-downgrade',
          'origin',
          'origin-when-cross-origin',
          'same-origin',
          'strict-origin',
          'strict-origin-when-cross-origin',
          'unsafe-url',
        ],
        {
          title: 'Referrer Policy',
          description:
            "Indicates which referrer to send when fetching the frame's resource.",
        }
      ),
      sandbox: StringUnion(
        [
          'unset',
          'allow-forms',
          'allow-modals',
          'allow-orientation-lock',
          'allow-pointer-lock',
          'allow-popups',
          'allow-popups-to-escape-sandbox',
          'allow-presentation',
          'allow-same-origin',
          'allow-scripts',
          'allow-top-navigation',
          'allow-top-navigation-by-user-activation',
        ],
        {
          title: 'Sandbox',
          description: 'Applies extra restrictions to the content in the frame.',
        }
      ),
      fetchpriority: StringUnion(['auto', 'low', 'high'], {
        title: 'Fetch Priority',
        description:
          'Provides a hint of the relative priority to use when fetching the iframe document',
      }),
    }),
    state: Type.Object({}),
    methods: {
      requestFullscreen: Type.Object({}),
    },
    slots: {},
    styleSlots: ['content'],
    events: [],
  },
})(
  ({
    component,
    src,
    referrerpolicy,
    sandbox,
    fetchpriority,
    elementRef,
    customStyle,
    subscribeMethods,
  }) => {
    const iframeProps: Record<string, unknown> = {
      title: component.id,
      src,
      fetchpriority,
    };

    if (referrerpolicy !== 'unset') {
      iframeProps.referrerpolicy = referrerpolicy;
    }

    if (sandbox !== 'unset') {
      iframeProps.sandbox = sandbox;
    }

    useEffect(() => {
      subscribeMethods({
        requestFullscreen() {
          elementRef?.current.requestFullscreen();
        },
      });
    }, [elementRef, subscribeMethods]);

    return (
      <iframe ref={elementRef} {...iframeProps} className={css(customStyle?.content)} />
    );
  }
);
