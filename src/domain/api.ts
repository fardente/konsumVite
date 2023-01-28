import axios from 'axios';

export interface TagDTO {
  tag_id: number;
  tag_name: string;
}

export interface ShoppingListItemDTO {
  id: number;
  checked: boolean;
  item_name: string;
  tags: TagDTO[];
}

export type ShoppingListDTO = ShoppingListItemDTO[];

function mapTagDTO(tagDTO: TagDTO): ITag {
  return { id: tagDTO.tag_id, tagName: tagDTO.tag_name };
}

function mapShoppingListItemDTO(
  shoppingListItemDTO: ShoppingListItemDTO
): IShoppingListItem {
  return {
    id: String(shoppingListItemDTO.id),
    name: shoppingListItemDTO.item_name,
    checked: shoppingListItemDTO.checked,
    tags: shoppingListItemDTO.tags.map(tag => mapTagDTO(tag)),
  };
}

function mapShoppingListDTO(shoppingListDTO: ShoppingListDTO): TShoppingList {
  return shoppingListDTO.map(item => mapShoppingListItemDTO(item));
}

export interface ITag {
  id: number | undefined;
  tagName: string;
}

export interface IShoppingListItem {
  id: string;
  name: string;
  checked: boolean;
  tags: ITag[];
}

export type TShoppingList = IShoppingListItem[];

const exampleData: ShoppingListDTO = [
  {
    id: 20,
    checked: false,
    item_name: 'Borken',
    tags: [],
  },
  {
    id: 14,
    checked: false,
    item_name: 'Wef',
    tags: [
      {
        tag_id: 1,
        tag_name: 'asd',
      },
    ],
  },
  {
    id: 11,
    checked: false,
    item_name: 'Sowas',
    tags: [],
  },
  {
    id: 10,
    checked: false,
    item_name: 'Rotzy',
    tags: [],
  },
  {
    id: 9,
    checked: false,
    item_name: 'Tushy',
    tags: [],
  },
  {
    id: 4,
    checked: false,
    item_name: 'Tomaten, passiert',
    tags: [],
  },
  {
    id: 3,
    checked: false,
    item_name: 'Olivenöl',
    tags: [],
  },
  {
    id: 2,
    checked: false,
    item_name: 'Mehl, 00',
    tags: [],
  },
];

export async function fetchShoppingItems(): Promise<TShoppingList> {
  const { data }: { data: ShoppingListDTO } = await axios.get(
    'http://localhost:3000/api/shopping/items'
  );
  console.log('data is', data, mapShoppingListDTO(data));
  return mapShoppingListDTO(data);
}
