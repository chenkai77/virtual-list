import { useState, useRef, useEffect } from "react";
import "./index.scss";
import { getList, IItemData } from "../data";
import ListItem from "../listItem/index";

type IList = IItemData & { height: number; top: number; bottom: number };

export default function VirtualDynamicList() {
  // 所有列表数据(缓存高度数据)
  const allList = useRef<IList[]>([]);
  // 最外层包裹元素
  const containerWrap = useRef<HTMLDivElement>(null);
  // 列表的包裹元素
  const listWrap = useRef<HTMLDivElement>(null);
  // 偏移量
  const [translateYOffset, setTranslateYOffset] = useState(0);
  // 可见的列表数据
  const [visibleList, setVisibleList] = useState<IItemData[]>([]);
  // 预估高度
  const estimatedHeight = 70;
  // 上下增加缓冲列表项个数
  const buffer = 5;

  // 初始化列表
  const initList = () => {
    const arr = getList();
    allList.current = arr.map((e, i) => ({
      ...e,
      height: estimatedHeight,
      top: i * estimatedHeight,
      bottom: (i + 1) * estimatedHeight,
    }));
    listScroll();
  };

  useEffect(() => {
    const listItemDoms = listWrap.current?.children;
    if (listItemDoms && listItemDoms.length) {
      let hasDifferenceValue = false;
      let firstDifferenceIndex = undefined;
      for (let i = 0; i < listItemDoms.length; i++) {
        const itemDom = listItemDoms[i] as HTMLElement;
        const index = visibleList[i].index;
        const differenceValue =
          allList.current[index].height - itemDom.offsetHeight;
        if (differenceValue) {
          hasDifferenceValue = true;
          if (firstDifferenceIndex === undefined) {
            firstDifferenceIndex = index;
            allList.current[index].bottom =
              allList.current[index].bottom - differenceValue;
          }
          // 更新真实高度
          allList.current[index].height = itemDom.offsetHeight;
        }
      }
      // 有差值，遍历更新列表数据的top、bottom数据
      if (hasDifferenceValue) {
        for (
          let i = (firstDifferenceIndex || 0) + 1;
          i < allList.current.length;
          i++
        ) {
          allList.current[i].top = allList.current[i - 1].bottom;
          allList.current[i].bottom =
            allList.current[i - 1].bottom + allList.current[i].height;
        }
      }
    }
  });

  // 获取索引（采用二分查找）
  const getIndex = (height: number) => {
    let startIndex = 0;
    let endIndex = allList.current.length - 1;
    let resultIndex = 0;
    while (startIndex <= endIndex) {
      const middleIndex = Math.floor((endIndex + startIndex) / 2);
      const middleBottom = allList.current[middleIndex].bottom;
      if (middleBottom === height) {
        return middleIndex + 1;
      } else if (middleBottom > height) {
        if (!resultIndex || resultIndex > middleIndex) {
          resultIndex = middleIndex;
        }
        endIndex--;
      } else if (middleBottom < height) {
        startIndex = middleIndex + 1;
      }
    }
    return resultIndex;
  };

  // 滚动事件
  const listScroll = () => {
    const containerWrapDom = containerWrap.current;
    const scrollTop = containerWrapDom?.scrollTop || 0;
    const startIndex = getIndex(scrollTop);
    let sliceStart = startIndex;
    if (startIndex > buffer) {
      sliceStart = startIndex - buffer;
    } else {
      sliceStart = 0;
    }
    setTranslateYOffset(allList.current[sliceStart].top);
    const listWrapDom = listWrap.current;
    const endIndex = getIndex(scrollTop + listWrapDom!.offsetHeight);
    setVisibleList(allList.current.slice(sliceStart, endIndex + buffer));
  };

  const renderList = () => {
    return visibleList.map((itemData) => (
      <div key={itemData.index} data-index={itemData.index + 1}>
        <ListItem itemData={{ ...itemData, height: "auto" }}></ListItem>
      </div>
    ));
  };

  return (
    <div>
      <div className="container" ref={containerWrap} onScroll={listScroll}>
        <div
          className="hide-placeholder-element"
          style={{
            height: allList.current.length
              ? allList.current[allList.current.length - 1].bottom + "px"
              : 0,
          }}
        ></div>
        <div
          className="list-wrap"
          ref={listWrap}
          style={{
            transform: `translateY(${translateYOffset + "px"})`,
          }}
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
