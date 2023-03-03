import { randomBytes } from 'crypto';
import { Twilio } from 'twilio';

export function generateVerificationCode(): string {
    // Generate random 6-digit code
    const buffer = randomBytes(3);
    const code = buffer.toString('hex').slice(0, 6);

    return code;
}

export async function sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    // Initialize Twilio client
    const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Send SMS message with verification code
    try {
        await twilioClient.messages.create({
            body: `Your verification code is ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
        console.log(`Verification code sent to ${phoneNumber}`);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send verification code');
    }
}
