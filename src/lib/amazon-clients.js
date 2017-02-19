import aws from 'aws-sdk';

export const s3 = new aws.S3({
  accessKeyId: process.env.S3ACCESSKEY,
  secretAccessKey: process.env.S3SECRET,
  region: "eu-west-2",
});


export const ses = new aws.SES({
  accessKeyId: process.env.S3ACCESSKEY,
  secretAccessKey: process.env.S3SECRET,
  region: "eu-west-1" // this is set to eu-west-1 because ses doesn't support eu-west-2
});
