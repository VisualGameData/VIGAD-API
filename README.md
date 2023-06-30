# VIGAD-API
A REST-API web application built using expressjs and redis. It is used to distribute / access data extracted by the [VIGAD Desktop Application](https://github.com/VisualGameData/VIGAD).

# QuickStart
1. Customize settings in .env:
   - PORT: The Port the web application listens on
   - ALLOWED_ORIGINS: A comma seperated list of origins that are allowed to access the api
   - TOKEN_HASH: A hash value of an access token that every client needs to provide. Generated using [bcrypt.hash](https://bcrypt.online/)
   - REDIS_HOST: The address of a redis-stack (RedisJSON required)
   - REDIS_PORT: The port the redis db listens on
     
2. Build the application:
   ```
   npm run build
   ```
3. Start the application:
   ```
   npm run start
   ```

# Access data:
Access data previously uploaded by VIGAD using a simple http GET request:
```
GET http://<HOST>:<PORT>/session/<SessionToken>/data

HEADERS:
Authorization: Bearer <Token>
Content-Type: application/json
```
\<SessionToken\> specified under "Session Settings" in VIGAD

\<Token\> used to generate TOKEN_HASH
