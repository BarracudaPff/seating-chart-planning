export type ItemID = string
export enum ItemType {
    Chair,
    Table,
}

export enum DataType {
    SVG,
    PNG,
}

export interface Item {
    id: string,
    itemName: ItemID,
    itemType: ItemType,
    position: number[],
    rotation: number[],
    scale: number[],
    size: number[],
    fixed: boolean,
    resizable: boolean,
    data: string,
    dataType: DataType,
}
