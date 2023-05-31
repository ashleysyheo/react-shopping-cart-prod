import { DefaultValue, atom, selector, selectorFamily } from 'recoil';

import { getCartAPI } from '../api/cartAPI';
import { SHIPPING_FEE, SHIPPING_FEE_EXEMPTION_CONDITION } from '../constants';
import { changeCartItemQuantity } from '../domain/cart';
import { CartItemData } from '../types/cart';
import {
  getDiscountedTotalItemPrice,
  getTotalItemDiscountAmount,
  getTotalItemPrice,
  getTotalMemberDiscountAmount,
} from '../utils/costs';
import { checkedCartIdListState } from './cartCheckbox';
import { currentMemberInformationState } from './member';
import { currentServerState } from './server';

const cartListQuery = selector<CartItemData[]>({
  key: 'cartListQuery',
  get: ({ get }) => {
    const currentServer = get(currentServerState);
    const cartAPI = getCartAPI(currentServer);

    return cartAPI.getCartList();
  },
});

const cartListState = atom<CartItemData[]>({
  key: 'cartList',
  default: cartListQuery,
});

const cartIdListState = selector<number[]>({
  key: 'cartIdList',
  get: ({ get }) => {
    const cartList = get(cartListState);

    return cartList.map((cartItem) => cartItem.id);
  },
});

const cartItemIdState = selectorFamily<number | null, number>({
  key: 'cartItemId',
  get:
    (productId) =>
    ({ get }) => {
      const cartList = get(cartListState);

      return cartList.find((cartItem) => cartItem.product.id === productId)?.id ?? null;
    },
});

const cartListItemCountState = selector<number>({
  key: 'cartListItemCount',
  get: ({ get }) => get(cartListState).length,
});

const cartItemQuantityState = selectorFamily<number, number>({
  key: 'cartItemQuantity',
  get:
    (cartItemId) =>
    ({ get }) => {
      const cartList = get(cartListState);

      return cartList.find((cartItem) => cartItem.id === cartItemId)?.quantity ?? 0;
    },
  set:
    (cartItemId) =>
    ({ set }, quantity) => {
      if (!quantity || quantity instanceof DefaultValue) return;

      set(cartListState, (prevCartList) => {
        const updatedCartList = changeCartItemQuantity(prevCartList, cartItemId, quantity);

        return updatedCartList ?? prevCartList;
      });
    },
});

const cartListCheckoutCostsState = selector({
  key: 'cartListCheckoutPrice',
  get: ({ get }) => {
    const cartList = get(cartListState);
    const checkedCartIdList = get(checkedCartIdListState);
    const memberInformation = get(currentMemberInformationState);
    const checkedCartItems = cartList.filter((cartItem) => checkedCartIdList.has(cartItem.id));

    const totalItemDiscountAmount = getTotalItemDiscountAmount(checkedCartItems);
    const totalMemberDiscountAmount = getTotalMemberDiscountAmount(
      checkedCartItems,
      memberInformation
    );
    const totalItemPrice = getTotalItemPrice(checkedCartItems);
    const discountedTotalItemPrice = getDiscountedTotalItemPrice(
      totalItemDiscountAmount,
      totalMemberDiscountAmount,
      totalItemPrice
    );
    const shippingFee =
      discountedTotalItemPrice > SHIPPING_FEE_EXEMPTION_CONDITION || checkedCartIdList.size === 0
        ? 0
        : SHIPPING_FEE;
    const totalPrice = discountedTotalItemPrice + shippingFee;

    return {
      totalItemPrice,
      totalItemDiscountAmount,
      totalMemberDiscountAmount,
      discountedTotalItemPrice,
      shippingFee,
      totalPrice,
    };
  },
});

export {
  cartListQuery,
  cartListState,
  cartIdListState,
  cartItemIdState,
  cartListItemCountState,
  cartItemQuantityState,
  cartListCheckoutCostsState,
};
