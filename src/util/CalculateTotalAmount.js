function calculateTotalPrice(
  instrumentType,
  average,
  futmargin,
  optionmargin,
  quantity,
  lotquantity
) {
  const optionTypes = ["OPTIDX", "OPTSTK", "OPTFUT"];
  let margin;
  let brokerage;

  if (optionTypes.includes(instrumentType)) {
    margin = (average / optionmargin) * quantity;
    brokerage = 20;
  } else {
    margin = futmargin * lotquantity;
    brokerage = 500;
  }

  const totalAmount = margin + brokerage;
  return {
    totalAmount,
    margin,
    brokerage,
  };
}

module.exports = calculateTotalPrice;
