import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: 'Hello world 1'
  }
}

export default {
  handler
}
