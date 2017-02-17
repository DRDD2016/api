import aws from 'aws-sdk';

const ses = new aws.SES({
  accessKeyId: process.env.S3ACCESSKEY,
  secretAccessKey: process.env.S3SECRET,
  region: "eu-west-1",
});

export default ses;
