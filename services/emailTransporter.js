
const nodemailer = require("nodemailer");
require("dotenv").config();

/* ============================================================
   SMTP CONFIGURATION
   ============================================================ */

const SMTP_HOST =
  process.env.SMTP_HOST || "smtp.mail.yahoo.com";

const SMTP_PORT =
  Number(process.env.SMTP_PORT) || 465;

const SMTP_SECURE =
  process.env.SMTP_SECURE !== undefined
    ? String(process.env.SMTP_SECURE).toLowerCase() === "true"
    : true;

const SMTP_USER =
  process.env.SMTP_USER || "";

const SMTP_PASS =
  process.env.SMTP_PASS || "";

const EMAIL_FROM_NAME =
  process.env.EMAIL_FROM_NAME || "INYUMBA";

  const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "";

/* ============================================================
   SMTP STATE
   ============================================================ */

let smtpTransporter = null;

let smtpConnected = false;

let smtpLastError = null;

let smtpLastCheckedAt = null;


/* ============================================================
   GET FROM ADDRESS
   ============================================================ */

const getFromAddress = () => {
  if (!SMTP_USER) {
    throw new Error(
      "SMTP_USER is required"
    );
  }

  // Use a noreply or placeholder email to hide the actual SMTP_USER
  // This will display only "INYUMBA" to recipients
  return `"${EMAIL_FROM_NAME}" <${ADMIN_EMAIL}>`;
};


/* ============================================================
   SMTP CONFIGURATION CHECK
   ============================================================ */

const isSMTPConfigured = () => {
  return Boolean(
    SMTP_HOST &&
    SMTP_PORT &&
    SMTP_USER &&
    SMTP_PASS
  );
};


/*
 * Kept for compatibility with existing code.
 */
const isResendConfigured = () => {
  return isSMTPConfigured();
};


/* ============================================================
   CREATE SMTP TRANSPORTER
   ============================================================ */

const getTransporter = () => {

  if (!isSMTPConfigured()) {
    throw new Error(
      "SMTP configuration is incomplete. " +
      "Check SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS."
    );
  }


  /*
   * Reuse existing transporter.
   */
  if (smtpTransporter) {
    return smtpTransporter;
  }


  smtpTransporter =
    nodemailer.createTransport({

      host:
        SMTP_HOST,

      port:
        SMTP_PORT,

      secure:
        SMTP_SECURE,

      auth: {

        user:
          SMTP_USER,

        pass:
          SMTP_PASS,

      },

      /*
       * Port 465 uses SSL/TLS immediately.
       */
      tls: {

        minVersion:
          "TLSv1.2",

      },

      /*
       * Prevent the application from waiting forever
       * when the SMTP server cannot be reached.
       */
      connectionTimeout:
        30000,

      greetingTimeout:
        30000,

      socketTimeout:
        30000,

      /*
       * Do not use connection pooling.
       * This keeps the sending behavior simple and avoids
       * unexpected repeated sends.
       */
      pool:
        false,

    });


  return smtpTransporter;
};


/* ============================================================
   TEST SMTP CONNECTION
   ============================================================ */

const testConnection = async () => {

  console.log("");

  console.log(
    "================================================"
  );

  console.log(
    "🔍 VERIFYING SMTP CONNECTION"
  );

  console.log(
    "================================================"
  );


  smtpLastCheckedAt =
    new Date();


  /* ----------------------------------------------------------
     CHECK CONFIGURATION
     ---------------------------------------------------------- */

  if (!isSMTPConfigured()) {

    smtpConnected =
      false;

    smtpLastError =
      "SMTP configuration is incomplete";


    console.error(
      "❌ SMTP CONFIGURATION INCOMPLETE"
    );

    console.error(
      "Required environment variables:"
    );

    console.error(
      "SMTP_HOST"
    );

    console.error(
      "SMTP_PORT"
    );

    console.error(
      "SMTP_SECURE"
    );

    console.error(
      "SMTP_USER"
    );

    console.error(
      "SMTP_PASS"
    );


    console.log(
      "================================================"
    );


    return {

      success:
        false,

      connected:
        false,

      error:
        smtpLastError,

      checkedAt:
        smtpLastCheckedAt,

    };
  }


  try {

    const transporter =
      getTransporter();


    const from =
      getFromAddress();


    console.log(
      "🔄 Connecting to SMTP..."
    );

    console.log(
      "🌐 Host:",
      SMTP_HOST
    );

    console.log(
      "🔌 Port:",
      SMTP_PORT
    );

    console.log(
      "🔒 Security:",
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS"
    );

    console.log(
      "📤 From:",
      from
    );


    /* --------------------------------------------------------
       VERIFY CONNECTION
       -------------------------------------------------------- */

    await transporter.verify();


    smtpConnected =
      true;

    smtpLastError =
      null;

    smtpLastCheckedAt =
      new Date();


    console.log(
      "✅ SMTP CONNECTION VERIFIED"
    );

    console.log(
      "================================================"
    );


    return {

      success:
        true,

      connected:
        true,

      error:
        null,

      checkedAt:
        smtpLastCheckedAt,

    };


  } catch (error) {

    smtpConnected =
      false;

    smtpLastError =
      error.message;

    smtpLastCheckedAt =
      new Date();


    console.error("");

    console.error(
      "================================================"
    );

    console.error(
      "❌ SMTP CONNECTION FAILED"
    );

    console.error(
      "🔴 EMAIL SERVICE: OFFLINE"
    );

    console.error(
      "🌐 HOST:",
      SMTP_HOST
    );

    console.error(
      "🔌 PORT:",
      SMTP_PORT
    );

    console.error(
      "🔒 SECURITY:",
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS"
    );

    console.error(
      "❌ Error:",
      error.message
    );

    console.error(
      "================================================"
    );


    return {

      success:
        false,

      connected:
        false,

      error:
        error.message,

      checkedAt:
        smtpLastCheckedAt,

    };
  }
};


/* ============================================================
   SEND MAIL
   ============================================================ */

const sendMail = async (
  mailOptions
) => {

  try {

    if (!isSMTPConfigured()) {

      return {

        success:
          false,

        error:
          "SMTP configuration is incomplete",

      };

    }


    if (
      !mailOptions ||
      typeof mailOptions !== "object"
    ) {

      return {

        success:
          false,

        error:
          "Mail options are required",

      };

    }


    if (!mailOptions.to) {

      return {

        success:
          false,

        error:
          "Email recipient is required",

      };

    }


    if (!mailOptions.subject) {

      return {

        success:
          false,

        error:
          "Email subject is required",

      };

    }


    if (
      !mailOptions.text &&
      !mailOptions.html
    ) {

      return {

        success:
          false,

        error:
          "Email text or HTML content is required",

      };

    }


    const transporter =
      getTransporter();


    /*
     * IMPORTANT:
     *
     * Always use INYUMBA as sender with a noreply placeholder email.
     * The actual SMTP_USER is used ONLY for authentication.
     */
    const from =
      getFromAddress();


    const result =
      await transporter.sendMail({

        from,

        to:
          mailOptions.to,

        subject:
          mailOptions.subject,


        ...(mailOptions.text && {
          text:
            mailOptions.text,
        }),


        ...(mailOptions.html && {
          html:
            mailOptions.html,
        }),


        ...(mailOptions.cc && {
          cc:
            mailOptions.cc,
        }),


        ...(mailOptions.bcc && {
          bcc:
            mailOptions.bcc,
        }),


        ...(mailOptions.replyTo && {
          replyTo:
            mailOptions.replyTo,
        }),


        ...(mailOptions.attachments && {
          attachments:
            mailOptions.attachments,
        }),

      });


    smtpConnected =
      true;

    smtpLastError =
      null;

    smtpLastCheckedAt =
      new Date();


    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "✅ EMAIL SENT SUCCESSFULLY"
    );

    console.log(
      "📤 From:",
      from
    );

    console.log(
      "📨 To:",
      mailOptions.to
    );

    console.log(
      "📋 Subject:",
      mailOptions.subject
    );

    console.log(
      "📨 Message ID:",
      result.messageId ||
      "N/A"
    );

    console.log(
      "================================================"
    );


    return {

      success:
        true,

      info:
        result,

      data:
        result,

      error:
        null,

    };


  } catch (error) {

    smtpConnected =
      false;

    smtpLastError =
      error.message;

    smtpLastCheckedAt =
      new Date();


    console.error(
      "❌ SMTP EMAIL SENDING FAILED:",
      error.message
    );


    return {

      success:
        false,

      error:
        error.message,

    };

  }
};


/* ============================================================
   SEND EMAIL
   ============================================================ */

const sendEmail = async ({
  to,
  subject,
  text,
  html,
  cc,
  bcc,
  replyTo,
  attachments,
}) => {

  if (!to) {

    return {

      success:
        false,

      error:
        "Email recipient is required",

    };

  }


  if (!subject) {

    return {

      success:
        false,

      error:
        "Email subject is required",

    };

  }


  if (!text && !html) {

    return {

      success:
        false,

      error:
        "Email text or HTML content is required",

    };

  }


  const mailOptions = {

    /*
     * Always use INYUMBA as sender.
     */
    from:
      getFromAddress(),

    to,

    subject,


    ...(text && {
      text,
    }),


    ...(html && {
      html,
    }),


    ...(cc && {
      cc,
    }),


    ...(bcc && {
      bcc,
    }),


    ...(replyTo && {
      replyTo,
    }),


    ...(attachments && {
      attachments,
    }),

  };


  /*
   * ONE SMTP ATTEMPT ONLY.
   *
   * Do not automatically resend because the SMTP server
   * may have accepted the first message already.
   */
  return await sendMailWithRetry(
    mailOptions,
    1
  );
};


/* ============================================================
   SEND MAIL WITH RETRY
   ============================================================ */

const sendMailWithRetry = async (
  mailOptions,
  maxRetries = 1
) => {

  /*
   * We deliberately perform only ONE actual send.
   *
   * This protects the application from duplicate emails.
   */
  const attempts = 1;


  let lastError =
    null;


  for (
    let attempt = 1;
    attempt <= attempts;
    attempt++
  ) {

    console.log(
      `📧 Sending email attempt ${attempt}/${attempts}...`
    );


    try {

      const result =
        await sendMail(
          mailOptions
        );


      if (result.success) {

        return result;

      }


      lastError =
        result.error;


    } catch (error) {

      lastError =
        error.message;

    }


    /*
     * NEVER retry automatically.
     */
    break;
  }


  return {

    success:
      false,

    error:
      lastError ||
      "SMTP email sending failed",

  };
};


/* ============================================================
   SAFE SEND
   ============================================================ */

const sendMailSafely = async (
  mailOptions
) => {

  try {

    /*
     * One attempt only.
     */
    return await sendMailWithRetry(
      mailOptions,
      1
    );

  } catch (error) {

    console.error(
      "⚠️ SMTP email service error:",
      error.message
    );


    return {

      success:
        false,

      error:
        error.message,

    };

  }
};


/* ============================================================
   GET SMTP INFORMATION
   ============================================================ */

const getSMTPInfo = () => {

  return {

    host:
      SMTP_HOST,

    port:
      SMTP_PORT,

    fromName:
      EMAIL_FROM_NAME,

    service:
      "SMTP",

    protocol:
      "SMTP",

    security:
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS",

    configured:
      isSMTPConfigured(),

    transporterCreated:
      Boolean(
        smtpTransporter
      ),

    connected:
      smtpConnected,

    status:
      smtpConnected
        ? "ONLINE"
        : "OFFLINE",

    lastError:
      smtpLastError,

    lastCheckedAt:
      smtpLastCheckedAt,

  };
};


/* ============================================================
   CLOSE SMTP TRANSPORTER
   ============================================================ */

const closeTransporter =
  async () => {

    try {

      if (smtpTransporter) {

        smtpTransporter.close();

      }


      smtpTransporter =
        null;


      smtpConnected =
        false;


      console.log(
        "🔌 SMTP CLIENT CLOSED"
      );


      return {

        success:
          true,

      };


    } catch (error) {

      return {

        success:
          false,

        error:
          error.message,

      };

    }
  };


/* ============================================================
   START SMTP VERIFICATION
   ============================================================ */

const startSMTPVerification =
  async () => {

    console.log("");

    console.log(
      "================================================"
    );

    console.log(
      "📧 EMAIL SERVICE STARTUP CHECK"
    );

    console.log(
      "================================================"
    );

    console.log(
      "🌐 Host:",
      SMTP_HOST
    );

    console.log(
      "🔌 Port:",
      SMTP_PORT
    );

    console.log(
      "🔒 Security:",
      SMTP_SECURE
        ? "SSL/TLS"
        : "STARTTLS"
    );


    const result =
      await testConnection();


    console.log("");


    if (result.connected) {

      console.log(
        "🟢 EMAIL SERVICE STATUS: ONLINE"
      );

      console.log(
        "🟢 SMTP: CONNECTED"
      );

      console.log(
        `🔌 PORT: ${SMTP_PORT}`
      );

      console.log(
        "🔒 SECURITY:",
        SMTP_SECURE
          ? "SSL/TLS"
          : "STARTTLS"
      );

    } else {

      console.log(
        "🔴 EMAIL SERVICE STATUS: OFFLINE"
      );

      console.log(
        "🔴 Reason:",
        result.error
      );

    }


    console.log(
      "================================================"
    );

    console.log("");


    return result;
  };


/* ============================================================
   EXPORTS
   ============================================================ */

module.exports = {

  getTransporter,

  getSMTPInfo,

  isSMTPConfigured,

  isResendConfigured,

  testConnection,

  startSMTPVerification,

  sendEmail,

  sendMail,

  sendMailWithRetry,

  sendMailSafely,

  closeTransporter,

};