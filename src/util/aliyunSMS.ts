import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

const createClient = (): Dysmsapi20170525 => {
  let config = new $OpenApi.Config({
    accessKeyId: process.env.ALIYUNSMS_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUNSMS_ACCESS_KEY_SECRET,
  });
  // 访问的域名
  config.endpoint = "dysmsapi.aliyuncs.com";
  return new Dysmsapi20170525(config);
}

export const sendMessage = async (phone: string, code: number) => {
  let client = createClient();
  let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
    phoneNumbers: phone,
    signName: "殷魄space",
    templateCode: "SMS_218165726",
    templateParam: `{code:${code}}`,
  });
  let runtime = new $Util.RuntimeOptions({ });
  try {
    // 复制代码运行请自行打印 API 的返回值
    const result = await client.sendSmsWithOptions(sendSmsRequest, runtime);
    if (result.body.code === 'OK') {
      return {
        code: 0,
        message: 'The verification code is successfully sent, valid for less than 5 minutes.'
      }
    } else {
      throw new Error(result.body.message);
    }
  } catch (error) {
    return {code: 100, error}
  }
}
