// netlify/functions/send-email.js
const nodemailer = require('nodemailer');

// Email templates with inline CSS
const getEmailTemplate = (type, data) => {
  switch(type) {
    case 'verification':
      return getVerificationEmailTemplate(data);
    case 'registration':
      return getRegistrationEmailTemplate(data);
    case 'statusUpdate':
      return getStatusUpdateEmailTemplate(data);
    default:
      throw new Error('Unknown email template type');
  }
};

const getVerificationEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verifikasi Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="background-color: #ffffff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; text-align: center;">
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 10px;">Selamat Datang di Faza Training Center!</h2>
          </div>
          <div style="color: #666; line-height: 1.6;">
            <p>Halo <strong>${data.userName}</strong>,</p>
            <p>Terima kasih telah mendaftar. Untuk mengaktifkan akun Anda, silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda.</p>
            <a href="${data.verificationUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; transition: background-color 0.3s ease;">Verifikasi Email Sekarang</a>
            <p>Atau, salin dan tempel link berikut ke browser Anda:</p>
            <p><a href="${data.verificationUrl}" style="color: #007bff; text-decoration: none;">${data.verificationUrl}</a></p>
          </div>
          <div style="margin-top: 20px; font-size: 0.9em; color: #999;">
            <p>Link ini akan kedaluwarsa dalam 24 jam.</p>
            <p>&copy; 2024 Faza Training Center. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getRegistrationEmailTemplate = (data) => {
  const statusClassStyle = data.status === 'pending' 
    ? 'background-color: #fff3cd; color: #856404;' 
    : 'background-color: #d4edda; color: #155724;';
  
  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Konfirmasi Pendaftaran Pelatihan</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
        <div style="background-color: #ffffff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; text-align: center; margin: 20px;">
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 10px;">Konfirmasi Pendaftaran Pelatihan</h2>
          </div>
          <div style="color: #666; line-height: 1.6; text-align: left;">
            <p>Halo <strong>${data.userName}</strong>,</p>
            <p>Terima kasih telah mendaftar untuk pelatihan kami. Berikut adalah detail pendaftaran Anda:</p>
            
            <div style="background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin: 20px 0; text-align: left;">
              <h3 style="margin-top: 0; color: #007bff;">${data.trainingName}</h3>
              <p><strong>Tanggal Pelatihan:</strong> ${data.trainingDate}</p>
              <p><strong>Durasi:</strong> ${data.trainingDuration}</p>
              <p><strong>Lokasi:</strong> ${data.trainingLocation}</p>
              <p><strong>Tanggal Pendaftaran:</strong> ${data.registrationDate}</p>
              <div style="display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-top: 10px; ${statusClassStyle}">
                Status: ${data.registrationStatus}
              </div>
            </div>
            
            <p>${data.statusMessage}</p>
            
            <a href="${data.trainingUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; transition: background-color 0.3s ease;">Lihat Detail Pelatihan</a>
            
            <p>Anda dapat memeriksa status pendaftaran Anda kapan saja melalui akun Anda di website kami.</p>
          </div>
          <div style="margin-top: 20px; font-size: 0.9em; color: #999;">
            <p>&copy; 2024 Faza Training Center. All rights reserved.</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi kami di <a href="mailto:info@fazatraining.com" style="color: #007bff; text-decoration: none;">info@fazatraining.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getStatusUpdateEmailTemplate = (data) => {
  const getStatusClassStyle = (status) => {
    switch(status) {
      case 'pending':
        return 'background-color: #fff3cd; color: #856404;';
      case 'terdaftar':
        return 'background-color: #d4edda; color: #155724;';
      case 'selesai':
        return 'background-color: #cce5ff; color: #004085;';
      default:
        return 'background-color: #fff3cd; color: #856404;';
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Update Status Pendaftaran</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
        <div style="background-color: #ffffff; padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; text-align: center; margin: 20px;">
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 10px;">Update Status Pendaftaran Pelatihan</h2>
          </div>
          <div style="color: #666; line-height: 1.6; text-align: left;">
            <p>Halo <strong>${data.userName}</strong>,</p>
            <p>Kami ingin memberitahukan bahwa status pendaftaran Anda untuk pelatihan berikut telah diperbarui:</p>

            <div style="background-color: #f9f9f9; border-left: 5px solid #007bff; padding: 15px; margin: 20px 0; text-align: left;">
              <h3>${data.trainingName}</h3>
              <p>
                <strong>Status Sebelumnya:</strong>
                <span style="display: inline-block; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9em; margin-top: 5px; ${getStatusClassStyle(data.oldStatusClass)}">
                  ${data.oldStatusText}
                </span>
              </p>
              <p>
                <strong>Status Terkini:</strong>
                <span style="display: inline-block; padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9em; margin-top: 5px; ${getStatusClassStyle(data.newStatusClass)}">
                  ${data.newStatusText}
                </span>
              </p>
            </div>

            <p>${data.statusMessage}</p>

            <a href="${data.trainingUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; transition: background-color 0.3s ease;">Lihat Detail Pelatihan</a>

            <p>Terima kasih atas kepercayaan Anda kepada Faza Training Center.</p>
          </div>
          <div style="margin-top: 20px; font-size: 0.9em; color: #999;">
            <p>&copy; 2024 Faza Training Center. All rights reserved.</p>
            <p>
              Jika Anda memiliki pertanyaan, silakan hubungi kami di
              <a href="mailto:info@fazatraining.com" style="color: #007bff; text-decoration: none;">info@fazatraining.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Create transporter with your email service configuration
const createTransporter = () => {
  // For Gmail, you'll need to use an App Password
  // For production, you might want to use a service like SendGrid, Mailgun, etc.
  return nodemailer.createTransport({ // Fixed: changed from createTransporter to createTransport
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your email address
      pass: process.env.SMTP_PASS, // your email password or app password
    },
  });
};

// Handler function for Netlify serverless function
exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the request body
    const { type, to, subject, data } = JSON.parse(event.body);

    // Validate required fields
    if (!type || !to || !subject || !data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Get the email template
    const html = getEmailTemplate(type, data);

    // Create the transporter
    const transporter = createTransporter();

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Faza Training Center <noreply@fazatraining.com>',
      to,
      subject,
      html,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Failed to send email', 
        error: error.message 
      }),
    };
  }
};