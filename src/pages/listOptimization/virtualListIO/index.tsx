import { useState, useRef, useEffect } from "react";
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
  // 可见区域的第一个列表项
  const startElement = useRef<HTMLDivElement>(null);
  // 可见区域的最后一个列表项
  const endElement = useRef<HTMLDivElement>(null);
  // 开始的索引
  const [startIndex, setStartIndex] = useState(0);
  // 结束的索引
  const [endIndex, setEndIndex] = useState(0);
  // 列表每一项的高度
  const itemHeight = 50;
  // 上下增加缓冲列表项个数
  const buffer = 5;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // 第一个元素可见时
      if (
        entry.isIntersecting &&
        entry.target.getAttribute("data-order") === "top"
      ) {
        if (startIndex > buffer) {
          setStartIndex(startIndex - buffer);
          setEndIndex(endIndex - buffer);
        } else {
          const diff = startIndex - 0;
          setEndIndex(endIndex - diff);
          setStartIndex(0);
        }
      }
      // 最后一个元素可见时
      if (
        entry.isIntersecting &&
        entry.target.getAttribute("data-order") === "bottom"
      ) {
        if (endIndex < allList.length - buffer) {
          setStartIndex(startIndex + buffer);
          setEndIndex(endIndex + buffer);
        } else {
          const diff = allList.length - endIndex;
          setStartIndex(startIndex + diff);
          setEndIndex(allList.length);
        }
      }
    });
  });

  useEffect(() => {
    if (startElement.current) {
      io.observe(startElement.current);
    }
    if (endElement.current) {
      io.observe(endElement.current);
    }
    return () => {
      if (startElement.current) {
        io.unobserve(startElement.current);
      }
      if (endElement.current) {
        io.unobserve(endElement.current);
      }
    };
  }, [endIndex]);

  // 点击获取列表数据
  const initList = () => {
    // 获取列表
    const arr = getList();
    setAllList(arr);
    const listWrapDom = listWrap.current;
    const listSizeNum = Math.ceil(listWrapDom!.offsetHeight / itemHeight);
    setEndIndex(listSizeNum + buffer * 2);
  };

  // 可见区域列表渲染
  const renderList = () => {
    const visibleList = allList.slice(startIndex, endIndex);
    return visibleList.map((itemData, index) => {
      let ref = null;
      let position = "";
      if (index === 0) {
        ref = startElement;
        position = "top";
      } else if (index === visibleList.length - 1) {
        ref = endElement;
        position = "bottom";
      }
      return (
        <div
          key={itemData.index}
          ref={ref}
          data-order={position}
          data-index={itemData.index + 1}
        >
          <ListItem
            itemData={{ ...itemData, height: itemHeight + "px" }}
          ></ListItem>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="container" ref={containerWrap}>
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
