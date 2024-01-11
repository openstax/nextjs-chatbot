import { Dynamo } from 'dynamodb-onetable/Dynamo'
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { IS_PROD } from '../config'

let options: DynamoDBClientConfig = {

}


if (!IS_PROD) {
    options = {
        ...options,
        endpoint: `http://localhost:8000`,
        region: 'local-env',
        credentials: {
            secretAccessKey: "ASDF",
            accessKeyId: "ASDF"
        }
    }
}

export const DynamoClient = new Dynamo({
    // log: !IS_PROD,
    log: true,
    client: new DynamoDBClient({
        ...options,
    }),
})
