import React from "react";
import "./StandardTable.scss";
import "antd/dist/antd.css";
import { Table } from "antd";
import { Model } from "react3l-common/src/Model";
import { TFunction } from "i18next";
import { DownOutlined, RightOutlined } from "@ant-design/icons";
// import classNames from "classnames";
// import nameof from "ts-nameof.macro";
import { ColumnProps } from "antd/lib/table";
import { UseMaster } from "./interfaceTable";
import { ExpandedRowRender } from "rc-table/lib/interface";
import classNames from "classnames";

export interface StandardTableCustomProps extends UseMaster {
  size?: "lg" | "md" | "sm";
  orderPadding?: "order-left" | "order-center" | "order-right";
  columns?: ColumnProps<Model>[];
  isDragable?: boolean;
  isShowTitle?: boolean;
  translate?: TFunction;
  isExpandAble?: boolean;
  expandedRowRend?: ExpandedRowRender<Model>;
}

function StandardTable(props: StandardTableCustomProps) {
  const {
    list,
    columns,
    expandedRowRend,
    size,
    isExpandAble,
    orderPadding,
  } = props;

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Model[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: Model) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
      <div className="page__master-table">
        <Table
          className={classNames(
            `table-size-${size}`,
            `table-padding-${orderPadding}`
          )}
          columns={columns}
          expandable={
            isExpandAble
              ? {
                  expandedRowRender: expandedRowRend,
                  expandIcon: ({ expanded, onExpand, record }) =>
                    expanded ? (
                      <DownOutlined
                        className="icon-table-expand"
                        onClick={(e) => onExpand(record, e)}
                      />
                    ) : (
                      <RightOutlined
                        className="icon-table-expand"
                        onClick={(e) => onExpand(record, e)}
                      />
                    ),
                }
              : null
          }
          dataSource={list}
          rowSelection={rowSelection}
        />
      </div>
    </>
  );
}
StandardTable.defaultProps = {
  size: "md",
  isExpandAble: false,
  orderPadding: "order-center",
};
export default StandardTable;
