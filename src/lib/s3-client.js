import aws from 'aws-sdk'; //eslint-disable-line

const s3 = new aws.S3({
  accessKeyId: process.env.S3ACCESSKEY,
  secretAccessKey: process.env.S3SECRET,
  region: "eu-west-2",
});

export default s3;
