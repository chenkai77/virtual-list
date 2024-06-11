import { useState, useRef, useEffect } from "react";
import "./index.scss";

interface IListItem {
  value: string;
  index: number;
  height: number;
}

interface IListInfo {
  index: number;
  height: number;
  top: number;
  bottom: number;
}

const allList: IListItem[] = [];

const initList = () => {
  for (let i = 0; i < 1000; i++) {
    allList.push({
      value: "item-" + (i + 1),
      index: i,
      height: Math.floor(Math.random() * 80 + 20), // 高度为 20-100 之间的随机数
    });
  }
};
initList();

export default function VirtualDynamicList() {
  // 最外层包裹元素
  const containerWrap = useRef<HTMLDivElement>(null);
  // 列表的包裹元素
  const listWrap = useRef<HTMLDivElement>(null);
  // 偏移量
  const [translateYOffset, setTranslateYOffset] = useState(0);
  // 可见的列表数据
  const [visibleList, setVisibleList] = useState<IListItem[]>([]);
  // 预估高度
  const estimatedHeight = 70;
  // 上下增加缓冲列表项个数
  const buffer = 5;
  // 列表缓存高度数据
  const listInfo = useRef<IListInfo[]>(
    allList.map((e, i) => ({
      index: e.index,
      height: estimatedHeight,
      top: i * estimatedHeight,
      bottom: (i + 1) * estimatedHeight,
    }))
  );

  useEffect(() => {
    listScroll();
  }, []);

  useEffect(() => {
    const listItemDoms = listWrap.current?.children;
    if (listItemDoms && listItemDoms.length) {
      let hasDifferenceValue = false;
      let firstDifferenceIndex = undefined;
      for (let i = 0; i < listItemDoms.length; i++) {
        const itemDom = listItemDoms[i] as HTMLElement;
        const index = visibleList[i].index;
        const differenceValue =
          listInfo.current[index].height - itemDom.offsetHeight;
        if (differenceValue) {
          hasDifferenceValue = true;
          if (firstDifferenceIndex === undefined) {
            firstDifferenceIndex = index;
            listInfo.current[index].bottom =
              listInfo.current[index].bottom - differenceValue;
          }
          listInfo.current[index].height = itemDom.offsetHeight;
        }
      }
      if (hasDifferenceValue) {
        for (
          let i = (firstDifferenceIndex || 0) + 1;
          i < listInfo.current.length;
          i++
        ) {
          listInfo.current[i].top = listInfo.current[i - 1].bottom;
          listInfo.current[i].bottom =
            listInfo.current[i - 1].bottom + listInfo.current[i].height;
        }
      }
    }
  });

  // 获取索引
  const getIndex = (height: number) => {
    let startIndex = 0;
    let endIndex = listInfo.current.length - 1;
    let resultIndex = 0;
    while (startIndex <= endIndex) {
      const middleIndex = Math.floor((endIndex + startIndex) / 2);
      const middleBottom = listInfo.current[middleIndex].bottom;
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
    if (sliceStart === 0) {
      setTranslateYOffset(0);
    } else {
      setTranslateYOffset(listInfo.current[sliceStart - 1].bottom);
    }
    const listWrapDom = listWrap.current;
    const endIndex = getIndex(scrollTop + listWrapDom!.offsetHeight);
    setVisibleList(allList.slice(sliceStart, endIndex + buffer));
  };

  const renderList = () => {
    return visibleList.map((e) => (
      <div
        key={e.value}
        className="list-item"
        style={{ height: e.height + "px" }}
      >
        <div>
          {e.value}(高度： {e.height})
        </div>
      </div>
    ));
  };

  return (
    <div className="container" ref={containerWrap} onScroll={listScroll}>
      <div
        className="hide-placeholder-element"
        style={{
          height: listInfo.current[listInfo.current.length - 1].bottom + "px",
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
  );
}
