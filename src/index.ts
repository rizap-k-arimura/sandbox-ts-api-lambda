import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createCipheriv } from 'crypto';
import { Context } from 'vm';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);

    const body: any = event.body;

    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');
    const algorithm = "aes-256-gcm";

    const cipher = createCipheriv(algorithm, key, iv)

    const encrypted = Buffer.concat([
      cipher.update(body.string, 'utf8'),
      cipher.final(),
    ]);
    
    const encryptedString = encrypted.toString('base64');

    return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Encrypted String API (Sandbox)',
          encrypted: encryptedString,
        }),
    };
};
