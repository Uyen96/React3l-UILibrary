import { storiesOf } from "@storybook/react";
import React from "react";
import nameof from "ts-nameof.macro";
import TableOfContents from "./TableOfContents";

const listEnum = [
  {
    sessionId: 1,
    sessionName: "Thông tin chung",
  },
  {
    sessionId: 2,
    sessionName: "Khách hàng",
  },
  {
    sessionId: 3,
    sessionName: "Chiết khấu, quà tặng",
  },
  {
    sessionId: 4,
    sessionName: "Vay",
  },
  {
    sessionId: 5,
    sessionName: "Thanh toán",
  },
  {
    sessionId: 6,
    sessionName: "KhangMeow",
  },
];
function Default() {
  return <TableOfContents list={listEnum} />;
}

storiesOf("TableOfContents", module).add(nameof(Default), Default);
