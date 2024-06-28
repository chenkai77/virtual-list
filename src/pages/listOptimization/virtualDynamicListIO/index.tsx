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
  // 可见区域的第一个列表项
  const startElement = useRef<HTMLDivElement>(null);
  // 可见区域的最后一个列表项
  const endElement = useRef<HTMLDivElement>(null);
  // 开始的索引
  const [startIndex, setStartIndex] = useState(0);
  // 结束的索引
  const [endIndex, setEndIndex] = useState(0);
  // 预估高度
  const estimatedHeight = 70;
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
        if (endIndex < allList.current.length - buffer) {
          setStartIndex(startIndex + buffer);
          setEndIndex(endIndex + buffer);
        } else {
          const diff = allList.current.length - endIndex;
          setStartIndex(startIndex + diff);
          setEndIndex(allList.current.length);
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
    setTranslateYOffset(allList.current[startIndex]?.top || 0);
    return () => {
      if (startElement.current) {
        io.unobserve(startElement.current);
      }
      if (endElement.current) {
        io.unobserve(endElement.current);
      }
    };
  }, [endIndex]);

  // 初始化列表
  const initList = () => {
    const arr = getList();
    allList.current = arr.map((e, i) => ({
      ...e,
      height: estimatedHeight,
      top: i * estimatedHeight,
      bottom: (i + 1) * estimatedHeight,
    }));
    const listWrapDom = listWrap.current;
    const endIndex = getIndex(listWrapDom!.offsetHeight);
    setEndIndex(endIndex + buffer * 2);
  };

  useEffect(() => {
    const listItemDoms = listWrap.current?.children;
    if (listItemDoms && listItemDoms.length) {
      let hasDifferenceValue = false;
      let firstDifferenceIndex = undefined;
      for (let i = 0; i < listItemDoms.length; i++) {
        const itemDom = listItemDoms[i] as HTMLElement;
        const index = Number(itemDom.getAttribute("data-index")) - 1;
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

  // 可见区域列表渲染
  const renderList = () => {
    const visibleList = allList.current.slice(startIndex, endIndex);
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
          <ListItem itemData={{ ...itemData, height: "auto" }}></ListItem>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="container" ref={containerWrap}>
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
