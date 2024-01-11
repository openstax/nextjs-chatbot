// import { getUser } from '../../models/user'
import { telefunc, config } from 'telefunc'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import assert from 'assert'

config.telefuncUrl = '/api/tf'
config.disableNamingConvention = true

async function streamToString(stream: any) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

export async function POST(req: NextRequest) {
    const { url, method } = req
  assert(url && method)
    const context = { user: null } // getUser(req) }
    const bodyStr = await req.text()

    const r = await telefunc({ url, method, body: bodyStr, context })
    console.log(r)
    return new NextResponse(r.body, {
        status: r.statusCode,
        headers: {
            contentType: r.contentType
        }
    })
    console.log(httpResponse)

    return httpResponse
  //   const resp = Response({
  //       status: httpResponse.statusCode,
  //       body: httpResponse.body
  //   })

  // res.status(httpResponse.statusCode).send(httpResponse.body)
}

export async function GET() {
    return NextResponse.json({
        message: "Please enter title"
    }, {
        status: 200,
    })
  

}

// export async function POST() {
//   const res = await fetch('https://data.mongodb-api.com/...', {
//     headers: {
//       'Content-Type': 'application/json',
//       'API-Key': process.env.DATA_API_KEY,
//     },
//   })
//   const data = await res.json()

//   return Response.json({ data })
// }
