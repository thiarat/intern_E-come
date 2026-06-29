import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    // In production, configure your actual SMTP credentials (e.g. AWS SES, Resend, SendGrid)
    // Here we use a fake test account setup for demonstration.
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER || 'ethereal_user',
      pass: process.env.SMTP_PASS || 'ethereal_pass'
    }
  });

  static async sendOrderConfirmation(to: string, orderId: string, totalAmount: number) {
    try {
      const info = await this.transporter.sendMail({
        from: '"E-Com Delivery" <no-reply@ecomdelivery.com>',
        to,
        subject: `Order Confirmation #${orderId}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Your order <strong>#${orderId}</strong> has been received successfully.</p>
          <p>Total amount: <strong>฿${totalAmount.toLocaleString()}</strong></p>
          <p>We will notify you once it has been shipped.</p>
        `
      });
      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  static async sendShipmentUpdate(to: string, orderId: string, status: string) {
    try {
      await this.transporter.sendMail({
        from: '"E-Com Delivery" <no-reply@ecomdelivery.com>',
        to,
        subject: `Shipment Update for Order #${orderId}`,
        text: `Your order #${orderId} is now: ${status}`
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}
