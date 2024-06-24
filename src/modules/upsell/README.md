## Endpoints

### Add Product Upsell
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant UpsellController
    participant ProductController
    participant ProductModel

    Client->>FastifyServer: POST /upsell
    FastifyServer->>UpsellController: addProductUpsell(request, reply)
    UpsellController->>UpsellController: addProductUpsellSchema.safeParse(request.body)
    UpsellController->>ProductController: getProduct(productId)
    ProductController->>ProductModel: Product.findByPk(productId)
    ProductModel-->>ProductController: product (or null)
    ProductController-->>UpsellController: return product
    UpsellController->>ProductModel: product.addUpsell(relatedProductIds)
    ProductModel-->>UpsellController: updated product
    UpsellController-->>FastifyServer: reply.status(HttpResponseCodes.CREATED).send(updatedProduct)
    FastifyServer-->>Client: HTTP 201
```

#### API Details

- Endpoint: /upsell/
- Method: POST
##### Request Body:
```json
{
  "productId": 1,
  "relatedProductIds": [2, 3]
}
```
##### Response:
```json
{
  "productId": 1,
  "name": "bread",
  "description": "loaf of bread",
  "price": "15.00",
  "quantity": 2,
  "createdAt": "2024-06-23T08:19:51.000Z",
  "updatedAt": "2024-06-23T08:19:51.000Z"
}
```

### Get Product Upsell
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant UpsellController
    participant ProductModel

    Client->>FastifyServer: GET /upsell/:productId
    FastifyServer->>UpsellController: getProductUpsell(request, reply)
    UpsellController->>UpsellController: request.params.productId
    UpsellController->>ProductModel: Product.findByPk(productId, { include: [{ model: Product, as: 'upsell' }] })
    ProductModel-->>UpsellController: productUpsells (or null)
    UpsellController-->>FastifyServer: reply.status(HttpResponseCodes.OK).send(productUpsells)
    FastifyServer-->>Client: HTTP 200
```

#### API Details

- Endpoint: /upsell/:productId
- Method: GET
##### Response:
```json
{
  "productId": 1,
  "name": "bread",
  "description": "loaf of bread",
  "price": "15.00",
  "quantity": 2,
  "createdAt": "2024-06-23T08:19:51.000Z",
  "updatedAt": "2024-06-23T08:32:04.000Z",
  "upsell": [
    {
      "productId": 2,
      "name": "jam",
      "description": "jar of jam",
      "price": "20.00",
      "quantity": 1,
      "createdAt": "2024-06-23T08:19:51.000Z",
      "updatedAt": "2024-06-23T08:19:51.000Z"
    }
  ]
}
```

### Delete Product Upsell
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant UpsellController
    participant ProductController
    participant ProductModel

    Client->>FastifyServer: DELETE /upsell
    FastifyServer->>UpsellController: deleteProductUpsell(request, reply)
    UpsellController->>UpsellController: deleteProductUpsellSchema.safeParse(request.body)
    UpsellController->>ProductController: getProduct(productId)
    ProductController->>ProductModel: Product.findByPk(productId)
    ProductModel-->>ProductController: product (or null)
    ProductController-->>UpsellController: return product
    UpsellController->>ProductModel: product.removeUpsell(relatedProductId)
    ProductModel-->>UpsellController: updated product
    UpsellController-->>FastifyServer: reply.status(HttpResponseCodes.OK).send(`Product ${relatedProductId} has been removed from upsell`)
    FastifyServer-->>Client: HTTP 200

```

#### API Details

- Endpoint: /upsell/:productId
- Method: DELETE

##### Response:
```
Product 2 has been removed from upsell
