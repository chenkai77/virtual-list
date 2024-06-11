import { useState } from "react";
import "./index.scss";
import ListItem from "../listItem/index";
// 获取随机的列表数据
import { getList, IItemData } from "../data";

export default function OrdinaryList() {
  // 所有列表数据
  const [allList, setAllList] = useState<IItemData[]>([]);
  // 列表项固定高度
  const listItemHeight = "50px";

  // 点击初始化列表
  const initList = () => {
    const now = Date.now();
    const arr = getList();
    setAllList(arr);
    console.log("JS运行时间：", Date.now() - now);
    setTimeout(() => {
      console.log("总运行时间：", Date.now() - now);
    }, 0);
  };

  // 渲染列表
  const renderList = () => {
    return allList.map((itemData) => (
      <div key={itemData.index}>
        <ListItem itemData={{ ...itemData, height: listItemHeight }}></ListItem>
      </div>
    ));
  };

  return (
    <div className="ordinary-list-wrap">
      <div className="list-wrap">{renderList()}</div>
      <button className="button" onClick={() => initList()}>
        列表数据赋值
      </button>
    </div>
  );
}
