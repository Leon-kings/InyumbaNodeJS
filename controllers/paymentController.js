// const Payment = require("../models/Payment");
// const {
//   initiatePayment,
//   checkPaymentStatus,
// } = require("../services/kpayPaymentService");

// const crypto = require("crypto");

// const generateReferenceId = () => {
//   return `PAY-${Date.now()}-${crypto
//     .randomBytes(4)
//     .toString("hex")}`;
// };

// const normalizePhone = (phone) => {
//   let value = String(phone).replace(/\s+/g, "").trim();

//   if (value.startsWith("+250")) {
//     value = value.substring(1);
//   }

//   if (value.startsWith("250")) {
//     return value;
//   }

//   if (value.startsWith("07")) {
//     return `250${value.substring(1)}`;
//   }

//   if (value.startsWith("7")) {
//     return `250${value}`;
//   }

//   return value;
// };

// exports.createPayment = async (req, res) => {
//   try {
//     const {
//       booking,
//       bookingId,
//       payerName,
//       payerEmail,
//       payerPhone,
//       amount,
//       currency,
//     } = req.body;

//     if (
//       !booking ||
//       !bookingId ||
//       !payerName ||
//       !payerEmail ||
//       !payerPhone ||
//       !amount
//     ) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "booking, bookingId, payerName, payerEmail, payerPhone and amount are required",
//       });
//     }

//     const numericAmount = Number(amount);

//     if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Amount must be greater than 0",
//       });
//     }

//     const phone = normalizePhone(payerPhone);

//     const referenceId = generateReferenceId();

//     const payment = await Payment.create({
//       booking,
//       bookingId,
//       payerName,
//       payerEmail,
//       payerPhone: phone,
//       amount: numericAmount,
//       currency: currency || "RWF",
//       provider: "kpay",
//       referenceId,
//       status: "pending",
//       initiatedAt: new Date(),
//     });

//     try {
//       const kpayResponse = await initiatePayment({
//         phone,
//         email: payerEmail,
//         name: payerName,
//         amount: numericAmount,
//         referenceId,
//         bookingId,
//       });

//       payment.rawResponse = kpayResponse;

//       if (Number(kpayResponse.success) === 1) {
//         payment.status = "pending";

//         payment.transactionId =
//           kpayResponse.tid ||
//           kpayResponse.transactionId ||
//           "";

//         await payment.save();

//         return res.status(201).json({
//           success: true,
//           message: "Payment initialized successfully",
//           payment: {
//             id: payment._id,
//             booking: payment.booking,
//             bookingId: payment.bookingId,
//             referenceId: payment.referenceId,
//             transactionId: payment.transactionId,
//             amount: payment.amount,
//             currency: payment.currency,
//             status: payment.status,
//           },
//           kpay: {
//             success: kpayResponse.success,
//             reply: kpayResponse.reply,
//             url: kpayResponse.url,
//             tid: kpayResponse.tid,
//             refid: kpayResponse.refid,
//             retcode: kpayResponse.retcode,
//           },
//         });
//       }

//       payment.status = "failed";

//       payment.reason =
//         kpayResponse.reply ||
//         kpayResponse.statusdesc ||
//         "KPay payment initialization failed";

//       await payment.save();

//       return res.status(400).json({
//         success: false,
//         message: payment.reason,
//         payment: {
//           id: payment._id,
//           referenceId: payment.referenceId,
//           status: payment.status,
//         },
//         kpay: kpayResponse,
//       });
//     } catch (kpayError) {
//       payment.status = "failed";

//       payment.reason =
//         kpayError.response?.data?.reply ||
//         kpayError.response?.data?.message ||
//         kpayError.message ||
//         "KPay request failed";

//       payment.rawResponse =
//         kpayError.response?.data || null;

//       await payment.save();

//       return res.status(502).json({
//         success: false,
//         message: "KPay payment request failed",
//         payment: {
//           id: payment._id,
//           referenceId: payment.referenceId,
//           status: payment.status,
//           reason: payment.reason,
//         },
//         kpay: kpayError.response?.data || null,
//       });
//     }
//   } catch (error) {
//     console.error(
//       "Create payment error:",
//       error.response?.data || error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create payment",
//       error: error.message,
//     });
//   }
// };

// exports.checkPaymentStatus = async (req, res) => {
//   try {
//     const { referenceId } = req.params;

//     if (!referenceId) {
//       return res.status(400).json({
//         success: false,
//         message: "referenceId is required",
//       });
//     }

//     const payment = await Payment.findOne({
//       referenceId,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     const kpayResponse =
//       await checkPaymentStatus(referenceId);

//     payment.rawResponse = kpayResponse;

//     const statusId = String(
//       kpayResponse.statusid || ""
//     );

//     if (statusId === "01") {
//       payment.status = "successful";

//       payment.transactionId =
//         kpayResponse.momtransactionid ||
//         payment.transactionId;

//       payment.completedAt =
//         payment.completedAt || new Date();

//       payment.reason =
//         kpayResponse.statusdesc ||
//         "Successfully processed transaction";
//     } else if (
//       statusId === "02" ||
//       statusId === "03" ||
//       statusId === "04"
//     ) {
//       payment.status = "failed";

//       payment.reason =
//         kpayResponse.statusdesc ||
//         "Payment failed";
//     } else {
//       payment.status = "pending";

//       payment.reason =
//         kpayResponse.statusdesc ||
//         "Payment is still pending";
//     }

//     await payment.save();

//     return res.status(200).json({
//       success: true,
//       payment,
//       kpay: kpayResponse,
//     });
//   } catch (error) {
//     console.error(
//       "Check KPay status error:",
//       error.response?.data || error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to check payment status",
//       error:
//         error.response?.data || error.message,
//     });
//   }
// };

// exports.getPayment = async (req, res) => {
//   try {
//     const { referenceId } = req.params;

//     const payment = await Payment.findOne({
//       referenceId,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       payment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get payment",
//       error: error.message,
//     });
//   }
// };

// exports.getBookingPayments = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     const payments = await Payment.find({
//       bookingId,
//     }).sort({
//       createdAt: -1,
//     });

//     return res.status(200).json({
//       success: true,
//       payments,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get booking payments",
//       error: error.message,
//     });
//   }
// };

// exports.kpayCallback = async (req, res) => {
//   try {
//     const data = req.body;

//     const referenceId =
//       data.refid ||
//       data.referenceId ||
//       data.reference ||
//       data.externalReference;

//     if (!referenceId) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment reference is missing",
//       });
//     }

//     const payment = await Payment.findOne({
//       referenceId,
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     payment.rawResponse = data;

//     const statusId = String(
//       data.statusid || ""
//     );

//     const status = String(
//       data.status || data.paymentStatus || ""
//     ).toLowerCase();

//     if (
//       statusId === "01" ||
//       status === "successful" ||
//       status === "success" ||
//       status === "completed"
//     ) {
//       payment.status = "successful";

//       payment.transactionId =
//         data.momtransactionid ||
//         data.transactionId ||
//         data.transaction_id ||
//         payment.transactionId;

//       payment.completedAt =
//         payment.completedAt || new Date();

//       payment.reason =
//         data.statusdesc ||
//         "Successfully processed transaction";
//     } else if (
//       status === "failed" ||
//       status === "failure" ||
//       status === "cancelled"
//     ) {
//       payment.status =
//         status === "cancelled"
//           ? "cancelled"
//           : "failed";

//       payment.reason =
//         data.statusdesc ||
//         data.message ||
//         data.reason ||
//         "Payment failed";
//     } else {
//       payment.status = "pending";

//       payment.reason =
//         data.statusdesc ||
//         "Payment is pending";
//     }

//     await payment.save();

//     return res.status(200).json({
//       success: true,
//       message: "KPay callback processed",
//     });
//   } catch (error) {
//     console.error(
//       "KPay callback error:",
//       error.response?.data || error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: "Failed to process KPay callback",
//       error: error.message,
//     });
//   }
// };
const crypto = require("crypto");

const Payment = require("../models/Payment");

const {
  initiatePayment,
  checkPaymentStatus,
} = require("../services/kpayPaymentService");

const generateReferenceId = () => {
  return `PAY-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
};

const normalizePhone = (phone) => {
  let value = String(phone).replace(/\s+/g, "").trim();

  if (value.startsWith("+250")) {
    value = value.substring(1);
  }

  if (value.startsWith("250")) {
    return value;
  }

  if (value.startsWith("07")) {
    return `250${value.substring(1)}`;
  }

  if (value.startsWith("7")) {
    return `250${value}`;
  }

  return value;
};

/*
|--------------------------------------------------------------------------
| CREATE PAYMENT
|--------------------------------------------------------------------------
*/

exports.createPayment = async (req, res) => {
  try {
    const {
      booking,
      bookingId,
      payerName,
      payerEmail,
      payerPhone,
      amount,
      currency,
      paymentMethod,
    } = req.body;

    if (
      !booking ||
      !bookingId ||
      !payerName ||
      !payerEmail ||
      !payerPhone ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message:
          "booking, bookingId, payerName, payerEmail, payerPhone, amount and paymentMethod are required",
      });
    }

    if (!["momo", "card"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod must be momo or card",
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const phone = normalizePhone(payerPhone);

    const referenceId = generateReferenceId();

    const payment = await Payment.create({
      booking,
      bookingId,

      payerName,

      payerEmail,

      payerPhone: phone,

      amount: numericAmount,

      currency: currency || "RWF",

      provider: "kpay",

      paymentMethod,

      referenceId,

      status: "pending",

      initiatedAt: new Date(),
    });

    try {
      const kpayResponse = await initiatePayment({
        phone,

        email: payerEmail,

        name: payerName,

        amount: numericAmount,

        referenceId,

        bookingId,

        paymentMethod,
      });

      payment.rawResponse = kpayResponse;

      if (Number(kpayResponse.success) === 1) {
        payment.status = "pending";

        payment.transactionId =
          kpayResponse.tid || kpayResponse.transactionId || "";

        await payment.save();

        return res.status(201).json({
          success: true,

          message: "Payment initialized successfully",

          payment: {
            id: payment._id,

            booking: payment.booking,

            bookingId: payment.bookingId,

            referenceId: payment.referenceId,

            transactionId: payment.transactionId,

            payerName: payment.payerName,

            payerEmail: payment.payerEmail,

            payerPhone: payment.payerPhone,

            amount: payment.amount,

            currency: payment.currency,

            provider: payment.provider,

            paymentMethod: payment.paymentMethod,

            status: payment.status,
          },

          kpay: {
            success: kpayResponse.success,

            reply: kpayResponse.reply,

            url: kpayResponse.url,

            tid: kpayResponse.tid,

            refid: kpayResponse.refid,

            retcode: kpayResponse.retcode,
          },
        });
      }

      payment.status = "failed";

      payment.reason =
        kpayResponse.reply ||
        kpayResponse.statusdesc ||
        "KPay payment initialization failed";

      await payment.save();

      return res.status(400).json({
        success: false,

        message: payment.reason,

        payment: {
          id: payment._id,

          referenceId: payment.referenceId,

          status: payment.status,
        },

        kpay: kpayResponse,
      });
    } catch (kpayError) {
      payment.status = "failed";

      payment.reason =
        kpayError.response?.data?.reply ||
        kpayError.response?.data?.message ||
        kpayError.message ||
        "KPay request failed";

      payment.rawResponse = kpayError.response?.data || null;

      await payment.save();

      return res.status(502).json({
        success: false,

        message: "KPay payment request failed",

        payment: {
          id: payment._id,

          referenceId: payment.referenceId,

          status: payment.status,

          reason: payment.reason,
        },

        kpay: kpayError.response?.data || null,
      });
    }
  } catch (error) {
    console.error(
      "Create payment error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,

      message: "Failed to create payment",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| CHECK PAYMENT STATUS
|--------------------------------------------------------------------------
*/

exports.checkPaymentStatus = async (req, res) => {
  try {
    const { referenceId } = req.params;

    if (!referenceId) {
      return res.status(400).json({
        success: false,

        message: "referenceId is required",
      });
    }

    const payment = await Payment.findOne({
      referenceId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,

        message: "Payment not found",
      });
    }

    const kpayResponse = await checkPaymentStatus(referenceId);

    payment.rawResponse = kpayResponse;

    const statusId = String(kpayResponse.statusid || "");

    if (statusId === "01") {
      payment.status = "successful";

      payment.transactionId =
        kpayResponse.momtransactionid || payment.transactionId;

      payment.completedAt = payment.completedAt || new Date();

      payment.reason =
        kpayResponse.statusdesc || "Successfully processed transaction";
    } else if (statusId === "02" || statusId === "03" || statusId === "04") {
      payment.status = "failed";

      payment.reason = kpayResponse.statusdesc || "Payment failed";
    } else {
      payment.status = "pending";

      payment.reason = kpayResponse.statusdesc || "Payment is still pending";
    }

    await payment.save();

    return res.status(200).json({
      success: true,

      payment,

      kpay: kpayResponse,
    });
  } catch (error) {
    console.error(
      "Check KPay status error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,

      message: "Failed to check payment status",

      error: error.response?.data || error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PAYMENT
|--------------------------------------------------------------------------
*/

exports.getPayment = async (req, res) => {
  try {
    const { referenceId } = req.params;

    const payment = await Payment.findOne({
      referenceId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,

        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,

      payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: "Failed to get payment",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET BOOKING PAYMENTS
|--------------------------------------------------------------------------
*/

exports.getBookingPayments = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payments = await Payment.find({
      bookingId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: "Failed to get booking payments",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| KPAY CALLBACK
|--------------------------------------------------------------------------
*/

exports.kpayCallback = async (req, res) => {
  try {
    const data = req.body;

    const referenceId =
      data.refid ||
      data.referenceId ||
      data.reference ||
      data.externalReference;

    if (!referenceId) {
      return res.status(400).json({
        success: false,

        message: "Payment reference is missing",
      });
    }

    const payment = await Payment.findOne({
      referenceId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,

        message: "Payment not found",
      });
    }

    payment.rawResponse = data;

    const statusId = String(data.statusid || "");

    const status = String(
      data.status || data.paymentStatus || "",
    ).toLowerCase();

    if (
      statusId === "01" ||
      status === "successful" ||
      status === "success" ||
      status === "completed"
    ) {
      payment.status = "successful";

      payment.transactionId =
        data.momtransactionid ||
        data.transactionId ||
        data.transaction_id ||
        payment.transactionId;

      payment.completedAt = payment.completedAt || new Date();

      payment.reason = data.statusdesc || "Successfully processed transaction";
    } else if (status === "failed" || status === "failure") {
      payment.status = "failed";

      payment.reason =
        data.statusdesc || data.message || data.reason || "Payment failed";
    } else if (status === "cancelled") {
      payment.status = "cancelled";

      payment.reason = data.statusdesc || data.message || "Payment cancelled";
    } else {
      payment.status = "pending";

      payment.reason = data.statusdesc || "Payment is pending";
    }

    await payment.save();

    return res.status(200).json({
      success: true,

      message: "KPay callback processed",
    });
  } catch (error) {
    console.error(
      "KPay callback error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,

      message: "Failed to process KPay callback",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| PAYMENT STATISTICS
|--------------------------------------------------------------------------
*/

exports.getPaymentStatistics = async (req, res) => {
  try {
    const now = new Date();

    const currentYear = now.getFullYear();

    const currentMonth = now.getMonth();

    const startOfDay = new Date(
      currentYear,
      currentMonth,
      now.getDate(),
      0,
      0,
      0,
      0,
    );

    const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);

    const startOfNextMonth = new Date(
      currentYear,
      currentMonth + 1,
      1,
      0,
      0,
      0,
      0,
    );

    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);

    const startOfNextYear = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0);

    const todayIncomeResult = await Payment.aggregate([
      {
        $match: {
          status: "successful",

          completedAt: {
            $gte: startOfDay,
          },
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: "$amount",
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const monthIncomeResult = await Payment.aggregate([
      {
        $match: {
          status: "successful",

          completedAt: {
            $gte: startOfMonth,

            $lt: startOfNextMonth,
          },
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: "$amount",
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const yearIncomeResult = await Payment.aggregate([
      {
        $match: {
          status: "successful",

          completedAt: {
            $gte: startOfYear,

            $lt: startOfNextYear,
          },
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: "$amount",
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalIncomeResult = await Payment.aggregate([
      {
        $match: {
          status: "successful",
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: "$amount",
          },

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const statusResult = await Payment.aggregate([
      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },

          amount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const statusStats = {
      pending: {
        count: 0,
        amount: 0,
      },

      successful: {
        count: 0,
        amount: 0,
      },

      failed: {
        count: 0,
        amount: 0,
      },

      cancelled: {
        count: 0,
        amount: 0,
      },

      expired: {
        count: 0,
        amount: 0,
      },
    };

    statusResult.forEach((item) => {
      if (statusStats[item._id]) {
        statusStats[item._id] = {
          count: item.count,

          amount: item.amount,
        };
      }
    });

    const monthlyIncome = await Payment.aggregate([
      {
        $match: {
          status: "successful",

          completedAt: {
            $gte: startOfYear,

            $lt: startOfNextYear,
          },
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$completedAt",
            },
          },

          income: {
            $sum: "$amount",
          },

          payments: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthlyStats = monthNames.map((month, index) => {
      const found = monthlyIncome.find((item) => item._id.month === index + 1);

      return {
        month,

        monthNumber: index + 1,

        income: found ? found.income : 0,

        payments: found ? found.payments : 0,
      };
    });

    return res.status(200).json({
      success: true,

      statistics: {
        today: {
          income: todayIncomeResult[0]?.total || 0,

          payments: todayIncomeResult[0]?.count || 0,
        },

        month: {
          income: monthIncomeResult[0]?.total || 0,

          payments: monthIncomeResult[0]?.count || 0,

          month: monthNames[currentMonth],

          year: currentYear,
        },

        year: {
          income: yearIncomeResult[0]?.total || 0,

          payments: yearIncomeResult[0]?.count || 0,

          year: currentYear,
        },

        allTime: {
          income: totalIncomeResult[0]?.total || 0,

          payments: totalIncomeResult[0]?.count || 0,
        },

        status: statusStats,

        monthly: monthlyStats,
      },
    });
  } catch (error) {
    console.error("Payment statistics error:", error.message);

    return res.status(500).json({
      success: false,

      message: "Failed to get payment statistics",

      error: error.message,
    });
  }
};
