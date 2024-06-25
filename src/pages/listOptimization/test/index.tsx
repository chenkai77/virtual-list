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
  // 列表个数
  const listSize = useRef(0);
  // 列表每一项的高度
  const itemHeight = 50;
  // 开始的索引
  const [startIndex, setStartIndex] = useState(0);

  // 点击获取列表数据
  const initList = () => {
    // 获取列表
    const arr = getList();
    setAllList(arr);
    const listWrapDom = listWrap.current;
    // 获取可视区域需要展示的列表项个数
    const listSizeNum = Math.ceil(listWrapDom!.offsetHeight / itemHeight);
    listSize.current = listSizeNum;
  };

  const renderList = () => {
    const visibleList = allList.slice(
      startIndex,
      startIndex + listSize.current
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
      <div className="container" ref={containerWrap}>
        <div
          className="placeholder-element"
          style={{ height: allList.length * itemHeight + "px" }}
        ></div>
        <div className="list-wrap" ref={listWrap}>
          {renderList()}
        </div>
      </div>
      <button className="button" onClick={() => initList()}>
        列表数据赋值
      </button>
    </div>
  );
}
