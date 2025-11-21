const speakeasy = require("speakeasy");

const generateTotp = async () => {
  const totp = await speakeasy.totp({
    secret: process.env.SMART_API_TOTP_SECRET,
    encoding: "base32",
  });
  return totp;
};

module.exports = {generateTotp};
