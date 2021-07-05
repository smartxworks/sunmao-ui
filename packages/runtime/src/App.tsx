import React from "react";
import { Application, createApplication } from "@meta-ui/core";
import { registry } from "./registry";

const App: React.FC<{ options: Application }> = ({ options }) => {
  const app = createApplication(options);
  console.log(app);

  return (
    <div className="App">
      {app.spec.components.map((c) => {
        const Impl = registry.getComponent(
          c.parsedType.version,
          c.parsedType.name
        ).impl;
        return <Impl key={c.id} {...c.properties} />;
      })}
    </div>
  );
};

export default App;
