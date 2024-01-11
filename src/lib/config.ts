import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm"
import { ENV } from './env'

export async function getConfigValue(path: string, decryption = false) {
    const envValue = process.env[path]

    if (envValue != null ) return envValue

    const client = new SSMClient({
        region: process.env.AWS_REGION || 'us-east-1',
      credentials: ENV.IS_PROD ? undefined : {
            accessKeyId: "FAKEKEY",
            secretAccessKey: "FAKEKEY"
        }
    })
    const paths = [
        `/research/chatbot/${ENV.NAME}/${path}`,
        `/research/chatbot/all/${path}`,
    ]
    const result = await client.send(new GetParametersCommand({
        Names: paths,
        WithDecryption: decryption
    }));
    if (!result.Parameters?.length || result.Parameters[0].Value == null) {
        throw new Error(`No values found for ${paths.join(' or ')}`);
    }
    return result.Parameters[0].Value
}

export type SSOCookie = {
    name: string
    private_key: string
    public_key: string
}

export async function ssoCookieConfig() {
    const cookieStr = await getConfigValue('sso-cookie')
    return JSON.parse(cookieStr) as SSOCookie
}
