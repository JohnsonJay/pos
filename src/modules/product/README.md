## Endpoints

### Create Product
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant ProductController
    participant ProductModel

    Client->>FastifyServer: POST /product
    FastifyServer->>ProductController: addProduct(request, reply)
    ProductController->>ProductController: addProductSchema.safeParse(request.body)
    ProductController->>ProductModel: Product.create({ name, description, price, quantity })
    ProductModel-->>ProductController: newProduct
    ProductController-->>FastifyServer: reply.status(HttpResponseCodes.OK).send(newProduct)
    FastifyServer-->>Client: HTTP 201
```

#### API Details

- Endpoint: /product/
- Method: POST
##### Request Body:
```json
{
  "name": "apple",
  "price": 15.00,
  "description": "sweet green apple",
  "quantity": 6
}
```
##### Response:
```json
{
	"productId": 1,
	"name": "apple",
	"description": "sweet green apple",
	"price": "15.00",
	"quantity": 6,
	"updatedAt": "2024-06-23T10:07:17.474Z",
	"createdAt": "2024-06-23T10:07:17.474Z"
}
```

### Get All Products
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant ProductController
    participant ProductModel

    Client->>FastifyServer: GET /product
    FastifyServer->>ProductController: getAllProducts(request, reply)
    ProductController->>ProductModel: Product.findAll()
    ProductModel-->>ProductController: allProducts
    ProductController-->>FastifyServer: reply.status(HttpResponseCodes.OK).send(allProducts)
    FastifyServer-->>Client: HTTP 200
```

#### API Details

- Endpoint: /product/
- Method: GET

##### Response:
```json
[
  {
    "productId": 1,
    "name": "apple",
    "description": "sweet green apple",
    "price": "15.00",
    "quantity": 6,
    "updatedAt": "2024-06-23T10:07:17.474Z",
    "createdAt": "2024-06-23T10:07:17.474Z"
  },
  {
    "productId": 2,
    "name": "pear",
    "description": "sweet green pear",
    "price": 12.00,
    "quantity": 3,
    "updatedAt": "2024-06-23T10:07:45.474Z",
    "createdAt": "2024-06-23T10:07:45.474Z"
  }
]
```

### Get Product By ID
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant ProductController
    participant ProductModel

    Client->>FastifyServer: GET /product/:productId
    FastifyServer->>ProductController: getProductById(request, reply)
    ProductController->>ProductController: request.params.productId
    ProductController->>ProductModel: Product.findByPk(productId)
    ProductModel-->>ProductController: product (or null)
    ProductController->>FastifyServer: reply.status(HttpResponseCodes.OK).send(product)
    FastifyServer-->>Client: HTTP response
```

#### API Details

- Endpoint: /product/:productId
- Method: GET

##### Response:
```json
{
	"productId": 1,
	"name": "apple",
	"description": "sweet green apple",
	"price": "15.00",
	"quantity": 6,
	"updatedAt": "2024-06-23T10:07:17.474Z",
	"createdAt": "2024-06-23T10:07:17.474Z"
}
```

### Update Product
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant ProductController
    participant ProductModel

    Client->>FastifyServer: PUT /product/:productId
    FastifyServer->>ProductController: updateProduct(request, reply)
    ProductController->>ProductController: request.params.productId, updateProductSchema.safeParse(request.body)
    ProductController->>ProductModel: Product.findByPk(productId)
    ProductModel-->>ProductController: product (or null)
    ProductController->>ProductModel: update product fields
    ProductModel-->>ProductController: savedProduct
    ProductController->>FastifyServer: reply.status(HttpResponseCodes.OK).send(savedProduct)
    FastifyServer-->>Client: HTTP response

```

#### API Details

- Endpoint: /product/:productId
- Method: PUT
##### Request Body:
```json
{
  "name": "red apple",
  "price": 16.00,
  "description": "sweet red apple",
  "quantity": 3
}
```
##### Response:
```json
{
    "productId": 1, 
    "name": "red apple",
    "price": "16.00",
    "description": "sweet red apple",
    "quantity": 3,
    "updatedAt": "2024-06-23T10:07:17.474Z",
    "createdAt": "2024-06-23T10:07:17.474Z"
}
```
