import { Button } from "@arco-design/web-react";
import { css } from "@emotion/css";
import { Application } from "@sunmao-ui/core";
import { initSunmaoUI } from "@sunmao-ui/runtime";
import { useState } from "react";
import { components } from "../../lib";

type Props = {
  application: Application;
};

const containerStyle = css``;

const demoStyle = css`
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 48px;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  .App {
    height: auto !important;
  }
`;

const codeStyle = css`
  margin-top: 12px;
  font-size: 13px;
  padding: 28px 48px;
  width: 100%;
  background-color: var(--color-fill-1);
`;

export const DemoWrapper: React.FC<Props> = (props) => {
  const { application } = props;
  const ui = initSunmaoUI();
  const [isShowCode, setIsShowCode] = useState(false);

  const App = ui.App;
  const registry = ui.registry;
  components.forEach((c) => registry.registerComponent(c));

  const sunmaoApp = (
    <App options={application} debugEvent={false} debugStore={false}></App>
  );

  const codeArea = (
    <pre className={codeStyle}>{JSON.stringify(application, null, 2)}</pre>
  );

  return (
    <div className={containerStyle}>
      <div className={demoStyle}>{sunmaoApp}</div>
      <div>
        <Button onClick={() => setIsShowCode(!isShowCode)}>Show Code</Button>
      </div>
      {isShowCode ? codeArea : null}
    </div>
  );
};
