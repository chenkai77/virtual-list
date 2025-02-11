import { useState, useRef } from "react";
import "./index.scss";
import { getList, IItemData } from "../data";
import ListItem from "../listItem/index";

export default function VirtualList() {
  // 列表全部数据
  const [allList, setAllList] = useState<IItemData[]>([]);
  // 最外层包裹元素
  const containerWrap = useRef<HTMLDivElement>(null);
  // 列表的包裹元素
  const listWrap = useRef<HTMLDivElement>(null);
  // 开始的索引
  const [startIndex, setStartIndex] = useState(0);
  // 可见的列表个数
  const listSize = useRef(0);
  // 列表每一项的高度
  const itemHeight = 50;
  // 上下增加缓冲列表项个数
  const buffer = 5;

  // 点击获取列表数据
  const initList = () => {
    // 获取列表
    const arr = getList();
    setAllList(arr);
    const listWrapDom = listWrap.current;
    const listSizeNum = Math.ceil(listWrapDom!.offsetHeight / itemHeight);
    listSize.current = listSizeNum;
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
  };

  // 可见区域列表渲染
  const renderList = () => {
    const visibleList = allList.slice(
      startIndex,
      startIndex + listSize.current + 2 * buffer
    );
    return visibleList.map((itemData) => (
      <div key={itemData.index} data-index={itemData.index + 1}>
        <ListItem
          itemData={{ ...itemData, height: itemHeight + "px" }}
        ></ListItem>
      </div>
    ));
  };

  return (
    <div>
      <div className="container" ref={containerWrap} onScroll={listScroll}>
        <div
          className="placeholder-element"
          style={{ height: allList.length * itemHeight + "px" }}
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
