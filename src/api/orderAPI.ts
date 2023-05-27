import { API_ENDPOINT, AUTHORIZED_FETCH_OPTION_HEADERS } from '../constants/api';
import { OrderCartItemsData, ProductItemData } from '../types';
import { fetchAPI } from './fetchAPI';

const postOrder = async (
  baseUrl: string,
  cartItems: OrderCartItemsData[]
): Promise<ProductItemData[]> => {
  const data = {
    cartItems,
  };
  const jsonData = JSON.stringify(data);

  return await fetchAPI(`${baseUrl}${API_ENDPOINT.ORDERS}`, {
    method: 'POST',
    headers: { ...AUTHORIZED_FETCH_OPTION_HEADERS },
    body: jsonData,
  });
};

export { postOrder };