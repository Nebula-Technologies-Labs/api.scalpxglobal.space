const exchangeMapping = (exchange) => {
  switch (exchange?.toUpperCase()) {
    case "NSE":
      return 1;
    case "NFO":
      return 2;
    case "BSE":
      return 3;
    case "BFO":
      return 4;
    case "MCX":
      return 5;
    default:
      return null;
  }
};

module.exports = exchangeMapping;
