import { NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"
import getRawBody from "raw-body"

export async function POST(request: NextApiRequest, response: NextApiResponse) {
    // const data = await request.json()
    // console.log(data)
    // return NextResponse.json({})

    const rawBody = await getRawBody(request);
    console.log('rawBody', rawBody)
    const bodySignature = sha1(rawBody, process.env.WEBHOOK_SECRET ? process.env.WEBHOOK_SECRET : '');

    if (bodySignature !== request.headers['x-vercel-signature']) {
      return response.status(403).json({
        code: 'invalid_signature',
        error: `signature didn't match`,
      });
    }

    const json = JSON.parse(rawBody.toString('utf-8'));
    console.log('json', json)

    response.status(200).end('OK');
}


function sha1(data: Buffer, secret: string): string {
  return crypto.createHmac('sha1', secret).update(data).digest('hex');
}