import redisClient from "@services/redis";
import twilioClient from "@services/twilio";
import { randomBytes } from "crypto";

export function generateVerificationCode(): string {
    // Generate random 6-digit code
    const buffer = randomBytes(3);
    const code = buffer.toString('hex').slice(0, 6);

    return code;
}

export async function sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    // Initialize Twilio client

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
        throw new Error('Failed to send verification code ' + (error as Error).message);
    }
}


export async function VerifyPhone(phone: string, code: string) {
    return await redisClient.get(`verification:${phone}`) == code
}

export async function setVerificationCode(phoneOrEmail: string){
    let code = generateVerificationCode()
    await redisClient.set(`verification:${phoneOrEmail}`, code, "EX", 60 * 5)
    return code
}