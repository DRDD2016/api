# Spark API

## Getting started

**This project runs on Node v6.9.x**

### Installing this project
1. Clone this repository
2. `cd api` and `npm install`
3. Create a `.env` file in the root of the project (see below)
4. Start the server with `npm start` (or in watch mode with `npm run dev`)
```env
SECRET_JWT=[ jwt secret (for module 'jwt-simple') ]
S3ACCESSKEY=[ AWS S3 access key ]
S3SECRET=[ AWS S3 secret ]
S3BUCKET=[ AWS S3 bucket name ]
MAILGUN_API_KEY=[ mailgun api key ]
DOMAIN=[ mailgun domain ]
TO=[ address to send emails to (if using a mailgun sandbox, will be one of your verified email addresses) ]
REMOTE_DB=[ boolean: true if you want to connect to remote db, false if not ]
PG_USER=[ remote db username ]
PG_PASSWORD=[ remote db password ]
PG_HOST=[ remote db host ]
PG_PORT=[ remote db port ]
PG_DATABASE=[ remote db name ]
```
