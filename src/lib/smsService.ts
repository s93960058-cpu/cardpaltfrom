interface SMSServiceConfig {
  provider: 'twilio' | 'infobip' | 'dev';
  apiKey?: string;
  apiSecret?: string;
  senderId?: string;
}

class SMSService {
  private config: SMSServiceConfig;

  constructor(config: SMSServiceConfig) {
    this.config = config;
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    if (this.config.provider === 'dev') {
      console.log('📱 SMS (Dev Mode):');
      console.log(`To: ${phoneNumber}`);
      console.log(`Code: ${code}`);
      console.log(`Message: קוד האימות שלך הוא: ${code}`);
      return true;
    }

    try {
      if (this.config.provider === 'twilio') {
        return await this.sendViaTwilio(phoneNumber, code);
      } else if (this.config.provider === 'infobip') {
        return await this.sendViaInfobip(phoneNumber, code);
      }

      return false;
    } catch (error) {
      console.error('SMS sending error:', error);
      return false;
    }
  }

  private async sendViaTwilio(phoneNumber: string, code: string): Promise<boolean> {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('Twilio credentials not configured');
    }

    const accountSid = this.config.apiKey;
    const authToken = this.config.apiSecret;
    const from = this.config.senderId || 'Cardly';

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: from,
          Body: `קוד האימות שלך הוא: ${code}`,
        }),
      }
    );

    return response.ok;
  }

  private async sendViaInfobip(phoneNumber: string, code: string): Promise<boolean> {
    if (!this.config.apiKey) {
      throw new Error('Infobip API key not configured');
    }

    const response = await fetch('https://api.infobip.com/sms/2/text/advanced', {
      method: 'POST',
      headers: {
        'Authorization': `App ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            from: this.config.senderId || 'Cardly',
            destinations: [{ to: phoneNumber }],
            text: `קוד האימות שלך הוא: ${code}`,
          },
        ],
      }),
    });

    return response.ok;
  }
}

export const smsService = new SMSService({
  provider: 'dev',
});

export default smsService;
