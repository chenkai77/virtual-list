import "./index.scss";
import { IItemData } from "../data";

export default function OrdinaryList({
  itemData,
}: {
  itemData: IItemData & { height?: string };
}) {
  return (
    <div className="list-item" style={{ height: itemData.height ?? "auto" }}>
      <div className="avatar-box">
        <img className="image" src={itemData.image} alt="" />;
      </div>
      <div className="text-box">{itemData.content}</div>
    </div>
  );
}
