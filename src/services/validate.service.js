const validateOrderRequestPayload = (data,average) => {
  const { orderOption } = data;
  switch (orderOption) {
    case 0:
      return {
        token: data.token,
        quantity: data.quantity,
        lotQuantity: data.lotQuantity,
        orderType: data.orderType,
        tradeOption: data.tradeOption,
        limit: null,
        triggerPrice: null,
        stopLossOption: null,
        orderStatus: 1,
        orderOption: data.orderOption,
      };
    case 1:
      return {
        token: data.token,
        quantity: data.quantity,
        lotQuantity: data.lotQuantity,
        orderType: data.orderType,
        tradeOption: data.tradeOption,
        limit: data.limit,
        triggerPrice: null,
        stopLossOption: null,
        orderStatus: 0,
        orderOption: data.orderOption,
      };
    case 2:
      return {
        token: data.token,
        quantity: data.quantity,
        lotQuantity: data.lotQuantity,
        orderType: data.orderType,
        tradeOption: data.tradeOption,
        limit: data.stopLossOption === 1 ? data.limit : average,
        triggerPrice: data.triggerPrice,
        stopLossOption: data.stopLossOption,
        orderStatus: 0,
        orderOption: data.orderOption,
      };
  }
};

module.exports = validateOrderRequestPayload;
