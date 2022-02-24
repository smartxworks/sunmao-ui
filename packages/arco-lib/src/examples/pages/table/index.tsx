import { Divider, Typography } from "@arco-design/web-react";
import { DemoWrapper } from "../../DemoWrapper";
import { basicUsage } from "./basicUsage";
import { selection } from "./selection";
import { attributes } from "./attributes";
import { sortAndFilter } from "./sortAndFilter";

const { Title, Text, Paragraph } = Typography;

export const TableDemoPage: React.FC = () => {
  return (
    <div>
      <Title heading={3}>Basic Usage</Title>
      <DemoWrapper application={basicUsage} />
      <Divider />
      <Title heading={3}>Selection</Title>
      <Paragraph>
        To enable selection, you can use radio or checkbox by setting the{" "}
        <Text code>Row Selection Type</Text>
      </Paragraph>
      <DemoWrapper application={selection} />
      <Divider />
      <Title heading={3}>Attributes</Title>
      <Paragraph>
        You can easily open or close the properties of the table
      </Paragraph>
      <DemoWrapper application={attributes} />
      <Divider />
      <Title heading={3}>Sort and filter</Title>
      <Paragraph>
        Configure the <Text code>sortable</Text> or <Text code>filterable</Text>{" "}
        of <Text code>Column</Text> to sort or filter the table
      </Paragraph>
      <Paragraph>
        You can provide only <Text code>ascending</Text> or{" "}
        <Text code>descending</Text> order or both by setting the sortDirections
        value to <Text code>[&rsquo;ascend&rsquo;]</Text>,
        <Text code>[&rsquo;descend&rsquo;]</Text>,
        <Text code>[&rsquo;ascend&rsquo;,&rsquo;descend&rsquo;]</Text>
      </Paragraph>
      <Paragraph>
        After that you can pick one of them as the default sort by setting{" "}
        <Text code>defaultSortOrder</Text>
      </Paragraph>
      <DemoWrapper application={sortAndFilter} />
      <Divider />
    </div>
  );
};
