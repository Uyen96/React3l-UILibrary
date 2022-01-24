import React from "react";
import "./TableOfContents.scss";
import { Radio } from "antd";
import classNames from "classnames";

export interface TableOfContentsModel {
  sessionName?: string;
  sessionId?: string | number;
}

export interface TableOfContentsProps {
  list?: TableOfContentsModel[];
}

function TableOfContents(props: TableOfContentsProps) {
  const { list } = props;
  const [value, setValue] = React.useState<number>(
    Number(list[0]?.sessionId) || 1
  );

  const onChange = (e: any) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  return (
    <div className="component_table-of-contents">
      <Radio.Group onChange={onChange} value={value}>
        {list?.length > 0 &&
          list.map((item) => {
            return (
              <div
                className={classNames("nav-content", {
                  "nav-content-active": Number(item.sessionId) === value,
                })}
                key={item.sessionId}
              >
                <div style={{ height: 16 }}>
                  <Radio
                    value={item.sessionId}
                    className="table-of-contents-radio"
                  >
                    <span className="nav-content-title">
                      {item.sessionName}
                    </span>
                  </Radio>
                </div>
              </div>
            );
          })}
      </Radio.Group>
    </div>
  );
}

TableOfContents.defaultProps = {
  list: [],
};

export default TableOfContents;
