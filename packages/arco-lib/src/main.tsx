import ReactDom from "react-dom";
import { initSunmaoUIEditor } from "@sunmao-ui/editor";
import { sunmaoChakraUILib } from "@sunmao-ui/chakra-ui-lib";
import { ArcoDesignLib } from ".";
import { StrictMode } from "react";
import "@sunmao-ui/editor/dist/esm/index.css";

const { Editor } = initSunmaoUIEditor({
  libs: [ArcoDesignLib, sunmaoChakraUILib],
});

ReactDom.render(
  <StrictMode>
    <Editor />
  </StrictMode>,
  document.getElementById("root")
);
