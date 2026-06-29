import generatePayload from 'promptpay-qr';
import QRCode from 'qrcode'; // I should probably install this as it's needed to render the QR to base64 or URL

export class PaymentService {
  /**
   * Generates a PromptPay QR code containing the exact amount
   * @param amount The total amount of the order
   * @param promptpayId The merchant's promptpay ID (phone number or citizen ID)
   * @returns Base64 image data of the QR code
   */
  static async generateQR(amount: number, promptpayId: string = '0812345678'): Promise<string> {
    try {
      const payload = generatePayload(promptpayId, { amount });
      const options = { type: 'image/png', color: { dark: '#000', light: '#fff' } };
      
      // Need to cast to any because qrcode types might not perfectly match
      const base64Image = await (QRCode as any).toDataURL(payload, options);
      return base64Image;
    } catch (error) {
      console.error('Failed to generate PromptPay QR:', error);
      throw new Error('QR Generation failed');
    }
  }
}
