import { injectGlobal, keyframes } from '@emotion/css';

const rcSelectSlideUpIn = keyframes`
	0% {
		opacity: 0;
		transform-origin: 0% 0%;
	}
	100% {
		opacity: 1;
		transform-origin: 0% 0%;
	}
`;

const rcSelectSlideUpOut = keyframes`
  0% {
    transform: scaleY(1);
    transform-origin: 0% 0%;
    opacity: 1;
  }
  100% {
    transform: scaleY(0.8);
    transform-origin: 0% 0%;
    opacity: 0;
  }
`;

const rcSelectSlideDownIn = keyframes`
  0% {
    transform: scaleY(0.8);
    transform-origin: 100% 100%;
    opacity: 0;
  }
  100% {
    transform: scaleY(1);
    transform-origin: 100% 100%;
    opacity: 1;
  }
}`;
const rcSelectSlideDownOut = keyframes`
  0% {
    transform: scaleY(1);
    transform-origin: 100% 100%;
    opacity: 1;
  }
  100% {
    transform: scaleY(0.8);
    transform-origin: 100% 100%;
    opacity: 0;
  }
}`;

injectGlobal`
  .sunmao-select-single .sunmao-select-selector {
    display: flex;
  }
  .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-search {
    position: absolute;
    top: 0;
    right: 11px;
    bottom: 0;
    left: 11px;
  }
  .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-search-input {
    width: 100%;
  }
  .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-item,
  .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-placeholder {
    padding: 0;
    line-height: 30px;
    transition: all 0.3s;
  }
  @supports (-moz-appearance: meterbar) {
    .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-item,
    .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-placeholder {
      line-height: 30px;
    }
  }
  .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-item {
    position: relative;
    user-select: none;
  }
  .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-placeholder {
    transition: none;
    pointer-events: none;
  }
  .sunmao-select-single .sunmao-select-selector::after,
  .sunmao-select-single .sunmao-select-selector .sunmao-select-selection-item::after,
  .sunmao-select-single
    .sunmao-select-selector
    .sunmao-select-selection-placeholder::after {
    display: inline-block;
    width: 0;
    visibility: hidden;
    content: '\\a0';
  }
  .sunmao-select-single.sunmao-select-show-arrow .sunmao-select-selection-search {
    right: 25px;
  }
  .sunmao-select-single.sunmao-select-show-arrow .sunmao-select-selection-item,
  .sunmao-select-single.sunmao-select-show-arrow .sunmao-select-selection-placeholder {
    padding-right: 18px;
  }
  .sunmao-select-single.sunmao-select-open .sunmao-select-selection-item {
    color: #bfbfbf;
  }
  .sunmao-select-single:not(.sunmao-select-customize-input) .sunmao-select-selector {
    width: 100%;
    height: 32px;
    padding: 0 11px;
  }
  .sunmao-select-single:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    .sunmao-select-selection-search-input {
    height: 30px;
  }
  .sunmao-select-single:not(.sunmao-select-customize-input)
    .sunmao-select-selector::after {
    line-height: 30px;
  }
  .sunmao-select-single.sunmao-select-customize-input .sunmao-select-selector::after {
    display: none;
  }
  .sunmao-select-single.sunmao-select-customize-input
    .sunmao-select-selector
    .sunmao-select-selection-search {
    position: static;
    width: 100%;
  }
  .sunmao-select-single.sunmao-select-customize-input
    .sunmao-select-selector
    .sunmao-select-selection-placeholder {
    position: absolute;
    right: 0;
    left: 0;
    padding: 0 11px;
  }
  .sunmao-select-single.sunmao-select-customize-input
    .sunmao-select-selector
    .sunmao-select-selection-placeholder::after {
    display: none;
  }
  .sunmao-select-single.sunmao-select-lg:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    height: 40px;
  }
  .sunmao-select-single.sunmao-select-lg:not(.sunmao-select-customize-input)
    .sunmao-select-selector::after,
  .sunmao-select-single.sunmao-select-lg:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    .sunmao-select-selection-item,
  .sunmao-select-single.sunmao-select-lg:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    .sunmao-select-selection-placeholder {
    line-height: 38px;
  }
  .sunmao-select-single.sunmao-select-lg:not(.sunmao-select-customize-input):not(.sunmao-select-customize-input)
    .sunmao-select-selection-search-input {
    height: 38px;
  }
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    height: 24px;
  }
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input)
    .sunmao-select-selector::after,
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    .sunmao-select-selection-item,
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    .sunmao-select-selection-placeholder {
    line-height: 22px;
  }
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input):not(.sunmao-select-customize-input)
    .sunmao-select-selection-search-input {
    height: 22px;
  }
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input)
    .sunmao-select-selection-search {
    right: 7px;
    left: 7px;
  }
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    padding: 0 7px;
  }
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input).sunmao-select-show-arrow
    .sunmao-select-selection-search {
    right: 28px;
  }
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input).sunmao-select-show-arrow
    .sunmao-select-selection-item,
  .sunmao-select-single.sunmao-select-sm:not(.sunmao-select-customize-input).sunmao-select-show-arrow
    .sunmao-select-selection-placeholder {
    padding-right: 21px;
  }
  .sunmao-select-single.sunmao-select-lg:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    padding: 0 11px;
  }
  .sunmao-select-selection-overflow {
    position: relative;
    display: flex;
    flex: auto;
    flex-wrap: wrap;
    max-width: 100%;
  }
  .sunmao-select-selection-overflow-item {
    flex: none;
    align-self: center;
    max-width: 100%;
  }
  .sunmao-select-multiple .sunmao-select-selector {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 1px 4px;
  }
  .sunmao-select-show-search.sunmao-select-multiple .sunmao-select-selector {
    cursor: text;
  }
  .sunmao-select-disabled.sunmao-select-multiple .sunmao-select-selector {
    background: #f5f5f5;
    cursor: not-allowed;
  }
  .sunmao-select-multiple .sunmao-select-selector::after {
    display: inline-block;
    width: 0;
    margin: 2px 0;
    line-height: 24px;
    content: '\\a0';
  }
  .sunmao-select-multiple.sunmao-select-show-arrow .sunmao-select-selector,
  .sunmao-select-multiple.sunmao-select-allow-clear .sunmao-select-selector {
    padding-right: 24px;
  }
  .sunmao-select-multiple .sunmao-select-selection-item {
    position: relative;
    display: flex;
    flex: none;
    box-sizing: border-box;
    max-width: 100%;
    height: 24px;
    margin-top: 2px;
    margin-bottom: 2px;
    line-height: 22px;
    background: #f5f5f5;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    cursor: default;
    transition: font-size 0.3s, line-height 0.3s, height 0.3s;
    user-select: none;
    margin-inline-end: 4px;
    padding-inline-start: 8px;
    padding-inline-end: 4px;
  }
  .sunmao-select-disabled.sunmao-select-multiple .sunmao-select-selection-item {
    color: #bfbfbf;
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  .sunmao-select-multiple .sunmao-select-selection-item-content {
    display: inline-block;
    margin-right: 4px;
    overflow: hidden;
    white-space: pre;
    text-overflow: ellipsis;
  }
  .sunmao-select-multiple .sunmao-select-selection-item-remove {
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-align: center;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: inline-block;
    color: rgba(0, 0, 0, 0.45);
    font-weight: bold;
    font-size: 10px;
    line-height: inherit;
    cursor: pointer;
  }
  .sunmao-select-multiple .sunmao-select-selection-item-remove > * {
    line-height: 1;
  }
  .sunmao-select-multiple .sunmao-select-selection-item-remove svg {
    display: inline-block;
  }
  .sunmao-select-multiple .sunmao-select-selection-item-remove::before {
    display: none;
  }
  .sunmao-select-multiple
    .sunmao-select-selection-item-remove
    .sunmao-select-multiple
    .sunmao-select-selection-item-remove-icon {
    display: block;
  }
  .sunmao-select-multiple .sunmao-select-selection-item-remove:hover {
    color: rgba(0, 0, 0, 0.75);
  }
  .sunmao-select-multiple
    .sunmao-select-selection-overflow-item
    + .sunmao-select-selection-overflow-item
    .sunmao-select-selection-search {
    margin-inline-start: 0;
  }
  .sunmao-select-multiple .sunmao-select-selection-search {
    position: relative;
    max-width: 100%;
    margin-inline-start: 7px;
  }
  .sunmao-select-multiple .sunmao-select-selection-search-input,
  .sunmao-select-multiple .sunmao-select-selection-search-mirror {
    height: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol', 'Noto Color Emoji';
    line-height: 24px;
    transition: all 0.3s;
  }
  .sunmao-select-multiple .sunmao-select-selection-search-input {
    width: 100%;
    min-width: 4.1px;
  }
  .sunmao-select-multiple .sunmao-select-selection-search-mirror {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    white-space: pre;
    visibility: hidden;
  }
  .sunmao-select-multiple .sunmao-select-selection-placeholder {
    position: absolute;
    top: 50%;
    right: 11px;
    left: 11px;
    transform: translateY(-50%);
    transition: all 0.3s;
  }
  .sunmao-select-multiple.sunmao-select-lg .sunmao-select-selector::after {
    line-height: 32px;
  }
  .sunmao-select-multiple.sunmao-select-lg .sunmao-select-selection-item {
    height: 32px;
    line-height: 30px;
  }
  .sunmao-select-multiple.sunmao-select-lg .sunmao-select-selection-search {
    height: 32px;
    line-height: 32px;
  }
  .sunmao-select-multiple.sunmao-select-lg .sunmao-select-selection-search-input,
  .sunmao-select-multiple.sunmao-select-lg .sunmao-select-selection-search-mirror {
    height: 32px;
    line-height: 30px;
  }
  .sunmao-select-multiple.sunmao-select-sm .sunmao-select-selector::after {
    line-height: 16px;
  }
  .sunmao-select-multiple.sunmao-select-sm .sunmao-select-selection-item {
    height: 16px;
    line-height: 14px;
  }
  .sunmao-select-multiple.sunmao-select-sm .sunmao-select-selection-search {
    height: 16px;
    line-height: 16px;
  }
  .sunmao-select-multiple.sunmao-select-sm .sunmao-select-selection-search-input,
  .sunmao-select-multiple.sunmao-select-sm .sunmao-select-selection-search-mirror {
    height: 16px;
    line-height: 14px;
  }
  .sunmao-select-multiple.sunmao-select-sm .sunmao-select-selection-placeholder {
    left: 7px;
  }
  .sunmao-select-multiple.sunmao-select-sm .sunmao-select-selection-search {
    margin-inline-start: 3px;
  }
  .sunmao-select-multiple.sunmao-select-lg .sunmao-select-selection-item {
    height: 32px;
    line-height: 32px;
  }
  .sunmao-select-disabled .sunmao-select-selection-item-remove {
    display: none;
  }
  .sunmao-select {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .sunmao-select-borderless .sunmao-select-selector {
    border-color: transparent !important;
  }
  .sunmao-select:not(.sunmao-select-customize-input) .sunmao-select-selector {
    position: relative;
    background-color: var(--chakra-colors-gray-100);
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .sunmao-select:not(.sunmao-select-customize-input):hover .sunmao-select-selector {
    background-color: var(--chakra-colors-gray-200);
  }

  .sunmao-select:not(.sunmao-select-customize-input) .sunmao-select-selector input {
    cursor: pointer;
  }
  .sunmao-select-show-search.sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    cursor: text;
  }
  .sunmao-select-show-search.sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    input {
    cursor: auto;
  }
  .sunmao-input-rtl
    .sunmao-select-focused:not(.sunmao-select-disabled).sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    border-right-width: 0;
    border-left-width: 1px !important;
  }
  .sunmao-select-disabled.sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    color: rgba(0, 0, 0, 0.25);
    background: #f5f5f5;
    cursor: not-allowed;
  }
  .sunmao-select-multiple.sunmao-select-disabled.sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector {
    background: #f5f5f5;
  }
  .sunmao-select-disabled.sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    input {
    cursor: not-allowed;
  }
  .sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    .sunmao-select-selection-search-input {
    margin: 0;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    appearance: none;
  }
  .sunmao-select:not(.sunmao-select-customize-input)
    .sunmao-select-selector
    .sunmao-select-selection-search-input::-webkit-search-cancel-button {
    display: none;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-appearance: none;
  }
  .sunmao-input-rtl
    .sunmao-select:not(.sunmao-select-disabled):hover
    .sunmao-select-selector {
    border-right-width: 0;
    border-left-width: 1px !important;
  }
  .sunmao-select-selection-item {
    flex: 1;
    overflow: hidden;
    font-weight: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .sunmao-select-selection-placeholder {
    flex: 1;
    overflow: hidden;
    color: #bfbfbf;
    white-space: nowrap;
    text-overflow: ellipsis;
    pointer-events: none;
  }
  .sunmao-select-arrow {
    display: inline-block;
    color: inherit;
    font-style: normal;
    line-height: 0;
    text-transform: none;
    vertical-align: -0.125em;
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    top: 50%;
    right: 11px;
    display: flex;
    align-items: center;
    height: 12px;
    margin-top: -6px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    line-height: 1;
    text-align: center;
    pointer-events: none;
  }
  .sunmao-select-arrow > * {
    line-height: 1;
  }
  .sunmao-select-arrow svg {
    display: inline-block;
  }
  .sunmao-select-arrow::before {
    display: none;
  }
  .sunmao-select-arrow .sunmao-select-arrow-icon {
    display: block;
  }
  .sunmao-select-disabled .sunmao-select-arrow {
    cursor: not-allowed;
  }
  .sunmao-select-arrow > *:not(:last-child) {
    margin-inline-end: 8px;
  }
  .sunmao-select-clear {
    position: absolute;
    top: 50%;
    right: 11px;
    z-index: 1;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-top: -6px;
    color: rgba(0, 0, 0, 0.25);
    font-size: 12px;
    font-style: normal;
    line-height: 1;
    text-align: center;
    text-transform: none;
    background: var(--chakra-colors-gray-200);
    cursor: pointer;
    opacity: 0;
    transition: color 0.3s ease, opacity 0.15s ease;
    text-rendering: auto;
  }
  .sunmao-select-clear::before {
    display: block;
  }
  .sunmao-select-clear:hover {
    color: rgba(0, 0, 0, 0.45);
  }
  .sunmao-select:hover .sunmao-select-clear {
    opacity: 1;
  }
  .sunmao-select-dropdown {
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    font-feature-settings: 'tnum';
    position: absolute;
    top: -9999px;
    left: -9999px;
    z-index: 1050;
    box-sizing: border-box;
    overflow: hidden;
    font-size: 14px;
    font-variant: initial;
    background-color: #fff;
    border-radius: 2px;
    outline: none;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    border: var(--chakra-borders-none);
    border-color: inherit;
    border-radius: var(--chakra-radii-md);
    box-shadow: var(--chakra-shadows-base);
    z-index: var(--chakra-zIndices-popover);
    padding-top: var(--chakra-space-4);
    padding-bottom: var(--chakra-space-4);
  }

  .sunmao-select-dropdown.sunmao-slide-up-enter.sunmao-select-dropdown-placement-topLeft,
  .sunmao-select-dropdown.sunmao-slide-up-enter.sunmao-select-dropdown-placement-topRight,
  .sunmao-select-dropdown.sunmao-slide-up-appear.sunmao-select-dropdown-placement-topLeft,
  .sunmao-select-dropdown.sunmao-slide-up-appear.sunmao-select-dropdown-placement-topRight {
    animation-name: ${rcSelectSlideDownIn};
  }
  .sunmao-select-dropdown.sunmao-slide-up-enter.sunmao-select-dropdown-placement-bottomLeft,
  .sunmao-select-dropdown.sunmao-slide-up-enter.sunmao-select-dropdown-placement-bottomRight,
  .sunmao-select-dropdown.sunmao-slide-up-appear.sunmao-select-dropdown-placement-bottomLeft,
  .sunmao-select-dropdown.sunmao-slide-up-appear.sunmao-select-dropdown-placement-bottomRight {
    animation-name: ${rcSelectSlideUpIn};
  }
  .sunmao-select-dropdown.sunmao-slide-up-leave.sunmao-select-dropdown-placement-topLeft,
  .sunmao-select-dropdown.sunmao-slide-up-leave.sunmao-select-dropdown-placement-topRight {
    animation-name: ${rcSelectSlideDownOut};
  }
  .sunmao-select-dropdown.sunmao-slide-up-leave.sunmao-select-dropdown-placement-bottomLeft,
  .sunmao-select-dropdown.sunmao-slide-up-leave.sunmao-select-dropdown-placement-bottomRight {
    animation-name: ${rcSelectSlideUpOut};
  }
  .sunmao-select-dropdown-hidden {
    display: none;
  }
  .sunmao-select-dropdown-empty {
    color: rgba(0, 0, 0, 0.25);
  }
  .sunmao-select-item-empty {
    position: relative;
    display: block;
    min-height: 32px;
    padding: 5px 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.25);
  }
  .sunmao-select-item {
    position: relative;
    display: block;
    min-height: 32px;
    padding: 5px 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  .sunmao-select-item-group {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    cursor: default;
  }
  .sunmao-select-item-option {
    display: flex;
  }
  .sunmao-select-item-option-content {
    flex: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .sunmao-select-item-option-state {
    flex: none;
  }
  .sunmao-select-item-option-active:not(.sunmao-select-item-option-disabled) {
    background-color: #f5f5f5;
  }
  .sunmao-select-item-option-selected:not(.sunmao-select-item-option-disabled) {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    background-color: #e8f4ff;
  }
  .sunmao-select-item-option-selected:not(.sunmao-select-item-option-disabled)
    .sunmao-select-item-option-state {
    color: #1890ff;
  }
  .sunmao-select-item-option-disabled {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
  .sunmao-select-item-option-disabled.sunmao-select-item-option-selected {
    background-color: #f5f5f5;
  }
  .sunmao-select-item-option-grouped {
    padding-left: 24px;
  }
`;
