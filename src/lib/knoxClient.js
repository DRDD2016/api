import knox from 'knox';

const knoxClient = knox.createClient({
  key: process.env.S3ACCESSKEY,
  secret: process.env.S3SECRET,
  bucket: process.env.S3BUCKET,
  region: 'eu-west-2'
});

export default knoxClient;
