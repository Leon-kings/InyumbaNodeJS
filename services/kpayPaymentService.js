const axios = require("axios");

const apiKey = process.env.KPAY_API_KEY;
const username = process.env.KPAY_USERNAME;
const password = process.env.KPAY_PASSWORD;

if (!apiKey) {
  throw new Error("KPAY_API_KEY is missing");
}

if (!username) {
  throw new Error("KPAY_USERNAME is missing");
}

if (!password) {
  throw new Error("KPAY_PASSWORD is missing");
}

const kpayClient = axios.create({
  baseURL: process.env.KPAY_BASE_URL || "https://pay.esicia.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Kpay-Key": apiKey,
    Authorization:
      "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
  },
});

const initiatePayment = async ({
  phone,
  email,
  name,
  amount,
  referenceId,
  bookingId,
}) => {
  const payload = {
    action: "pay",

    msisdn: phone,

    email,

    details: `INYUMBA Booking ${bookingId}`,

    refid: referenceId,

    amount: Number(amount),

    currency: "RWF",

    cname: name,

    cnumber: bookingId,

    pmethod: "momo",

    retailerid: process.env.KPAY_RETAILER_ID,

    returl: process.env.KPAY_CALLBACK_URL,

    redirecturl: process.env.KPAY_REDIRECT_URL,

    ...(process.env.KPAY_LOGO_URL
      ? {
          logourl: process.env.KPAY_LOGO_URL,
        }
      : {}),
  };

  const response = await kpayClient.post("/", payload);

  return response.data;
};

const checkPaymentStatus = async (referenceId) => {
  const payload = {
    action: "checkstatus",
    refid: referenceId,
  };

  const response = await kpayClient.post("/", payload);

  return response.data;
};

module.exports = {
  initiatePayment,
  checkPaymentStatus,
};
