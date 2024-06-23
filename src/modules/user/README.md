## Sequence Diagram
### Create User
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant UserController
    participant UserModel
    participant AuthUtils

    Client->>FastifyServer: POST /register
    FastifyServer->>UserController: createUser(request, reply)
    UserController->>UserController: userRegistrationSchema.safeParse(request.body)
    UserController->>UserController: existingUser(email)
    UserController->>UserModel: User.findOne({ where: { email } })
    UserModel-->>UserController: user (or null)
    UserController-->>UserController: userExists
    UserController->>AuthUtils: hashPassword(password)
    AuthUtils-->>UserController: hashedPassword
    UserController->>UserModel: User.create({ password: hashedPassword, email })
    UserModel-->>UserController: newUser
    UserController-->>FastifyServer: reply.status(HttpResponseCodes.CREATED).send(newUser)
    FastifyServer-->>Client: HTTP 201 Created
```

### Login User
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant UserController
    participant UserModel
    participant AuthUtils
    
    Client->>FastifyServer: POST /login
    FastifyServer->>UserController: loginUser(request, reply)
    UserController->>UserController: userLoginSchema.safeParse(request.body)
    UserController->>UserModel: User.findOne({ where: { email } })
    UserModel-->>UserController: user (or null)
    UserController->>AuthUtils: comparePassword(password, user.password)
    AuthUtils-->>UserController: isPasswordValid
    UserController->>UserController: request.jwt.sign(payload)
    UserController-->>FastifyServer: reply.setCookie('access_token', token).status(HttpResponseCodes.OK).send({ token })
    FastifyServer-->>Client: HTTP 200 OK
```

### Logout User
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant UserController
    
    Client->>FastifyServer: DELETE /logout
    FastifyServer->>UserController: logoutUser(_, reply)
    UserController-->>FastifyServer: reply.clearCookie('access_token').status(HttpResponseCodes.OK).send('User has been logged out.')
    FastifyServer-->>Client: HTTP 200 OK

```

## API Details
### Authentication Endpoints
#### Register User
- Endpoint: /auth/register
- Method: POST
##### Request Body:
```json
{
"email": "string",
"password": "string"
}
```

##### Response:
```json
{
"id": 1,
"email": "string",
}
```

#### Login User
- Endpoint: /auth/login
- Method: POST
##### Request Body:
```json
{
"email": "string",
"password": "string"
}
```
##### Response:
```json
{
"token": "jwt_token_string"
}
```

#### Logout User
- Endpoint: /auth/logout
- Method: DELETE
##### Request Body:
```json
{}
```
##### Response:
```
User has been logged out.
```
