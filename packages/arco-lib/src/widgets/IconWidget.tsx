import React, { useCallback, useMemo, useState } from 'react';
import {
  WidgetProps,
  implementWidget,
  ComponentFormElementId,
} from '@sunmao-ui/editor-sdk';
import * as Icons from '@arco-design/web-react/icon';
import IconsMessage from '@arco-design/web-react/icon/icons.json';
import { Popover, Input, Button, Radio, Space } from '@arco-design/web-react';
import { css } from '@emotion/css';
import { mapValues } from 'lodash';
import { ARCO_V1_VERSION } from '../constants/widgets';

type IconWidgetWidgetID = 'arco/v1/icon';

const iconButtonStyle = css`
  background: transparent !important;
  border: 0 !important;
  width: 40px !important;
  height: 40px !important;
  margin-right: 5px;
  &:hover {
    background-color: var(--color-secondary-hover) !important;
  }
`;

const iconListWrapperStyle = css`
  height: 350px;
  width: 380px;
  overflow: auto;
  margin-top: 10px;
`;
const popoverStyle = css`
  height: 500px;
  max-width: none !important;
  .arco-trigger-arrow.arco-popover-arrow {
    display: none;
  }
  .arco-popover-content {
    padding: 12px 0 12px 12px;
  }
`;

const selectButtonStyle = css`
  background: transparent !important;
  border: 1px solid var(--color-secondary) !important;
  width: 100%;
  text-align: left;
  padding: 0 5px !important;
  &:hover {
    border-color: var(--color-secondary-hover) !important;
  }
`;

const IconCategories = IconsMessage.icons;
const eng = IconsMessage.i18n['en-US'];

const iconStyle = {
  outline: 'Stroke',
  fill: 'Fill',
  color: 'Color',
};
type IconStyle = keyof typeof iconStyle;

export const PopoverContent: React.FC<{
  onChange: (iconName: string) => void;
  closePopover: () => void;
}> = ({ onChange, closePopover }) => {
  const [style, setStyle] = useState<IconStyle>('outline');
  const [searchValue, setSearchValue] = useState('');

  const categories = useMemo(() => {
    return mapValues(IconCategories, o => {
      return mapValues(o, iconComps => {
        return iconComps.filter(iconComp =>
          new RegExp(searchValue, 'i').test(iconComp.componentName)
        );
      });
    });
  }, [searchValue]);

  return (
    <div>
      <Space direction="horizontal">
        <Radio.Group
          size="small"
          type="button"
          value={style}
          onChange={style => {
            setStyle(style);
          }}
        >
          {Object.keys(iconStyle).map(key => (
            <Radio key={key} value={key}>
              {iconStyle[key as IconStyle]}
            </Radio>
          ))}
        </Radio.Group>
        <Input
          value={searchValue}
          onChange={v => {
            setSearchValue(v);
          }}
          placeholder="Search icon by name"
          size="small"
        />
      </Space>
      <div className={iconListWrapperStyle}>
        {Object.keys(categories).map(category => {
          const curCategory = categories[category as keyof typeof categories];
          const currentIcons = curCategory[style as keyof typeof curCategory];

          return (
            <div key={category}>
              {currentIcons && currentIcons.length > 0 && (
                <div>
                  <div className="title">{eng[category as keyof typeof categories]}</div>
                  <div className="content">
                    {currentIcons.map(component => {
                      const iconName = component.componentName;
                      const Icon = Icons[iconName as keyof typeof Icons];
                      return (
                        <Button
                          onClick={() => {
                            onChange(iconName);
                            closePopover();
                          }}
                          title={iconName}
                          key={iconName}
                          icon={<Icon />}
                          className={iconButtonStyle}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const _IconWidget: React.FC<WidgetProps<IconWidgetWidgetID, string>> = props => {
  const { value, onChange, spec } = props;
  const CurrentIcon = Icons[value as keyof typeof Icons];
  const [visible, setVisible] = useState(false);

  const closePopover = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <Popover
      unmountOnExit={false}
      triggerProps={{
        onClickOutside: () => {
          closePopover();
        },
      }}
      getPopupContainer={_node =>
        spec.widgetOptions?.appendToBody
          ? document.body
          : document.getElementById(ComponentFormElementId)!
      }
      popupVisible={visible}
      position="left"
      className={popoverStyle}
      content={<PopoverContent closePopover={closePopover} onChange={onChange} />}
      title="Select Icon"
      trigger="click"
      {...(spec.widgetOptions?.appendToBody ? {} : { style: { left: '-390px' } })}
    >
      <Button
        onClick={() => {
          setVisible(!visible);
        }}
        className={selectButtonStyle}
        icon={<CurrentIcon />}
      >
        {value}
      </Button>
    </Popover>
  );
};

export const IconWidget = implementWidget<IconWidgetWidgetID>({
  version: ARCO_V1_VERSION,
  metadata: {
    name: 'icon',
  },
})(_IconWidget);
