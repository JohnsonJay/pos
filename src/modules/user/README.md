## Sequence Diagram
### Create User
```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UserModel
    participant AuthUtils
    participant Database

    Client->>Controller: HTTP POST /createUser { email, password }
    Controller->>UserModel: findOne({ where: { email } })
    UserModel->>Database: SELECT * FROM users WHERE email = email
    Database-->>UserModel: User data
    UserModel-->>Controller: User instance
    alt User exists
        Controller-->>Client: 409 User already exists
    else User does not exist
        Controller->>AuthUtils: hashPassword(password)
        AuthUtils-->>Controller: hashedPassword
        Controller->>UserModel: create({ email, password: hashedPassword })
        UserModel->>Database: INSERT INTO users (email, password) VALUES (...)
        Database-->>UserModel: New user data
        UserModel-->>Controller: New user instance
        Controller-->>Client: 201 New user instance
    end
```

### Login User
```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant UserModel
    participant AuthUtils
    participant Database
    Client->>Controller: HTTP POST /loginUser { email, password }
    Controller->>UserModel: findOne({ where: { email } })
    UserModel->>Database: SELECT * FROM users WHERE email = email
    Database-->>UserModel: User data
    UserModel-->>Controller: User instance
    alt User not found
        Controller-->>Client: 404 User not found
    else User found
        Controller->>AuthUtils: comparePassword(password, user.password)
        AuthUtils-->>Controller: isPasswordValid
        alt Invalid password
            Controller-->>Client: 409 Invalid email or password
        else Valid password
            Controller->>AuthUtils: generateToken({ id: user.id, username: user.email }, JWT_SECRET)
            AuthUtils-->>Controller: token
            Controller-->>Client: 200 { token }
        end
    end

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
"createdAt": "date",
"updatedAt": "date"
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
