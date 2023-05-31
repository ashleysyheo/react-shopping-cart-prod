import { useRecoilValue } from 'recoil';

import HTTPError from '../../../api/utils/HTTPError';
import { HTTP_ERROR_MESSAGE, HTTP_STATUS_CODE } from '../../../constants/api';
import { orderState } from '../../../store/order';
import { priceFormatter } from '../../../utils/formatter';
import * as S from './OrderDetailPurchaseInformation.styles';

interface OrderDetailPurchaseInformationProps {
  orderId: number;
}

const OrderDetailPurchaseInformation = ({ orderId }: OrderDetailPurchaseInformationProps) => {
  const order = useRecoilValue(orderState(orderId));

  if (!order) {
    throw new HTTPError(HTTP_STATUS_CODE.NOT_FOUND, {
      payload: HTTP_ERROR_MESSAGE[HTTP_STATUS_CODE.NOT_FOUND],
    });
  }

  return (
    <>
      <S.OrderDetailPurchaseInformationHeading size="xSmall">
        결제 정보
      </S.OrderDetailPurchaseInformationHeading>
      <S.OrderDetailPurchaseInformationContainer>
        <S.PurchaseInformationData>
          <S.PurchaseInformationDataLabel>상품 금액</S.PurchaseInformationDataLabel>
          <S.PurchaseInformationDataDescription>
            {priceFormatter(order.totalItemPrice)}원
          </S.PurchaseInformationDataDescription>
        </S.PurchaseInformationData>
        <S.PurchaseInformationData>
          <S.PurchaseInformationDataLabel>상품 할인 금액</S.PurchaseInformationDataLabel>
          <S.PurchaseInformationDataDescription>
            {priceFormatter(-order.totalItemDiscountAmount)}원
          </S.PurchaseInformationDataDescription>
        </S.PurchaseInformationData>
        <S.PurchaseInformationData>
          <S.PurchaseInformationDataLabel>등급 할인 금액</S.PurchaseInformationDataLabel>
          <S.PurchaseInformationDataDescription>
            {priceFormatter(-order.totalMemberDiscountAmount)}원
          </S.PurchaseInformationDataDescription>
        </S.PurchaseInformationData>
        <S.PurchaseInformationData>
          <S.PurchaseInformationDataLabel>배송비</S.PurchaseInformationDataLabel>
          <S.PurchaseInformationDataDescription>
            {priceFormatter(order.shippingFee)}원
          </S.PurchaseInformationDataDescription>
        </S.PurchaseInformationData>
        <S.PurchaseInformationData>
          <S.PurchaseInformationDataLabel>결제 금액</S.PurchaseInformationDataLabel>
          <S.PurchaseInformationDataDescription>
            {priceFormatter(order.totalPrice)}원
          </S.PurchaseInformationDataDescription>
        </S.PurchaseInformationData>
      </S.OrderDetailPurchaseInformationContainer>
    </>
  );
};

export default OrderDetailPurchaseInformation;
