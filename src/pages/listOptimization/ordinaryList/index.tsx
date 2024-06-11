import { useState } from "react";
import "./index.scss";
import ListItem from "../listItem/index";
import getList, { IItemData } from "../data";

export default function OrdinaryList() {
  const [list, setList] = useState<IItemData[]>([]);

  const initList = () => {
    const now = Date.now();
    const arr = getList();
    setList(arr);
    console.log("JS运行时间：", Date.now() - now);
    setTimeout(() => {
      console.log("总运行时间：", Date.now() - now);
    }, 0);
  };

  const renderList = () => {
    return list.map((itemData) => (
      <div key={itemData.order}>
        <ListItem itemData={itemData}></ListItem>
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
