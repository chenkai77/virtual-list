import { useState, useRef } from "react";
import "./index.scss";
import getList, { IItemData } from "../data";
import ListItem from "../listItem/index";

export default function VirtualList() {
  const [list, setList] = useState<IItemData[]>([]);
  // 最外层包裹元素
  const containerWrap = useRef<HTMLDivElement>(null);
  // 列表的包裹元素
  const listWrap = useRef<HTMLDivElement>(null);
  // 开始的索引
  const [startIndex, setStartIndex] = useState(0);
  // 可见的列表数据
  const [visibleList, setVisibleList] = useState<IItemData[]>([]);
  // 列表个数
  const listSize = useRef(0);
  // 列表每一项的高度
  const itemHeight = 50;
  // 上下增加缓冲列表项个数
  const buffer = 5;

  const initList = () => {
    const now = Date.now();
    const arr = getList();
    setList(arr);
    const listWrapDom = listWrap.current;
    const listSizeNum = Math.ceil(listWrapDom!.offsetHeight / itemHeight);
    listSize.current = listSizeNum;
    setVisibleList(arr.slice(0, listSizeNum));
    console.log("JS运行时间：", Date.now() - now);
    setTimeout(() => {
      console.log("总运行时间：", Date.now() - now);
    }, 0);
  };

  // 滚动事件
  const listScroll = () => {
    const containerWrapDom = containerWrap.current;
    const scrollTop = containerWrapDom?.scrollTop || 0;
    const start = Math.floor(scrollTop / itemHeight);
    let sliceStart = start;
    if (start > buffer) {
      sliceStart = start - buffer;
    } else {
      sliceStart = 0;
    }
    setStartIndex(sliceStart);
    setVisibleList(list.slice(sliceStart, start + listSize.current + buffer));
  };

  const renderList = () => {
    return visibleList.map((itemData) => (
      <div key={itemData.order}>
        <ListItem itemData={itemData}></ListItem>
      </div>
    ));
  };

  return (
    <div>
      <div className="container" ref={containerWrap} onScroll={listScroll}>
        <div
          className="hide-placeholder-element"
          style={{ height: list.length * itemHeight + "px" }}
        ></div>
        <div
          className="list-wrap"
          ref={listWrap}
          style={{ transform: `translateY(${startIndex * itemHeight + "px"})` }}
        >
          {renderList()}
        </div>
      </div>
      <button className="button" onClick={() => initList()}>
        列表数据赋值
      </button>
    </div>
  );
}
