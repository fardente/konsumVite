import { rest } from 'msw';
const items = [
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
    tags: [{ tag_id: 1, tag_name: 'asd' }],
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
export const handlers = [
  rest.get('*/api/shopping/items', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(items));
  }),

  rest.get('*/api/entries/from-:fromDate/to-:toDate', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testchain1loadmore));
  }),

  rest.post('*/api/chains', async (req, res, ctx) => {
    const { title } = await req.json();
    const testchain = { ...Testchain1, id: 333 };
    testchain.title = title;
    return res(ctx.status(200), ctx.json(testchain));
  }),

  rest.put('*/api/chains/:chainId', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.put('*/api/entries/:chainlinkid', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.delete('*/api/chains/:id', (req, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.options('*', (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
