import { Layout, Menu, Typography } from "@arco-design/web-react";
import React, { useState } from "react";
import { ButtonDemoPage } from "./pages/button";

const { Sider, Content, Header } = Layout;
const ContentMap: Record<string, React.FC> = {
  Button: ButtonDemoPage,
};

export const ExampleIndexPage: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState("Button");
  const ContentComponent: React.FC = ContentMap[selectedKey];
  return (
    <Layout>
      <Sider collapsed={false}>
        <Menu selectedKeys={[selectedKey]}>
          {Object.keys(ContentMap).map((name) => {
            return (
              <Menu.Item key={name} onClick={() => setSelectedKey(name)}>
                {name}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ paddingLeft: 20 }}>
          <Typography.Title>{selectedKey}</Typography.Title>
        </Header>
        <Layout style={{ padding: "0 24px" }}>
          <Content>
            {ContentComponent ? <ContentComponent /> : undefined}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
