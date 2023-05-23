import { rest } from 'msw';

import { API_ENDPOINT, HTTP_STATUS_CODE } from '../../constants/api';
import {
  addCartItem,
  changeCartItemQuantity,
  getCartData,
  removeCartItem,
  setCartData,
} from '../../domain/cart';
import { PostCartItemRequestBody } from '../../types';
import { PatchCartItemRequestBody } from '../../types/api';

const cartHandlers = [
  rest.get(API_ENDPOINT.CART_GET, (req, res, ctx) => {
    const cartList = getCartData();

    return res(ctx.delay(100), ctx.status(HTTP_STATUS_CODE.OK), ctx.json(cartList));
  }),

  rest.post(API_ENDPOINT.CART_POST, async (req, res, ctx) => {
    const { productId } = await req.json<PostCartItemRequestBody>();
    const currentCartData = getCartData();

    const newCartList = addCartItem(currentCartData, productId);

    if (!newCartList) {
      return res(
        ctx.status(HTTP_STATUS_CODE.NOT_FOUND),
        ctx.json({ errorMessage: '해당하는 상품이 없습니다.' })
      );
    }

    setCartData(newCartList);

    return res(
      ctx.status(201),
      ctx.set('Location', `${API_ENDPOINT.CART_POST}/${newCartList.at(-1)?.id}`),
      ctx.json(newCartList)
    );
  }),

  rest.patch(`${API_ENDPOINT.CART_PATCH}/:productId`, async (req, res, ctx) => {
    const { productId } = req.params;
    const { quantity } = await req.json<PatchCartItemRequestBody>();
    const currentCartData = getCartData();

    const newCartList = changeCartItemQuantity(currentCartData, Number(productId), quantity);

    if (!newCartList) {
      return res(
        ctx.status(HTTP_STATUS_CODE.NOT_FOUND),
        ctx.json({ errorMessage: '해당하는 상품이 없습니다.' })
      );
    }

    setCartData(newCartList);

    return res(ctx.delay(100), ctx.status(HTTP_STATUS_CODE.OK), ctx.json(newCartList));
  }),

  rest.delete(`${API_ENDPOINT.CART_DELETE}/:productId`, (req, res, ctx) => {
    const { productId } = req.params;
    const currentCartData = getCartData();
    const newCartList = removeCartItem(currentCartData, Number(productId));

    if (currentCartData.length === 0 || !newCartList) {
      return res(
        ctx.status(HTTP_STATUS_CODE.NOT_FOUND),
        ctx.json({ errorMessage: '장바구니가 비어있거나 해당하는 상품이 장바구니에 없습니다.' })
      );
    }

    setCartData(newCartList);

    return res(ctx.delay(100), ctx.status(HTTP_STATUS_CODE.NO_CONTENT));
  }),
];

export { cartHandlers };
