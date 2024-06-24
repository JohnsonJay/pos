## Endpoints

### Create Transaction
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant TransactionController
    participant ProductModel
    participant TransactionModel

    Client->>FastifyServer: POST /transaction
    FastifyServer->>TransactionController: createTransaction(request, reply)
    TransactionController->>TransactionController: createTransactionSchema.safeParse(request.body)
    TransactionController-->>FastifyServer: validation
    FastifyServer->>ProductModel: productHasStock(productsMap)
    ProductModel->>ProductModel: Product.findAll(attributes, where)
    ProductModel-->>FastifyServer: result
    FastifyServer-->>TransactionController: continue if all products have stock
    TransactionController->>TransactionModel: Transaction.create({totalPrice, totalQuantity})
    TransactionModel-->>TransactionController: transaction
    TransactionController->>ProductModel: Product.findAll(attributes, where)
    ProductModel-->>TransactionController: productDetails
    TransactionController->>TransactionModel: TransactionProduct.bulkCreate(productDetails)
    TransactionModel-->>TransactionController: created transaction products
    TransactionController->>ProductModel: Promise.allSettled(Product.decrement(quantity))
    ProductModel-->>TransactionController: decremented product quantities
    TransactionController-->>FastifyServer: reply.status(HttpResponseCodes.CREATED).send(transaction details)
    FastifyServer-->>Client: HTTP 201

```

#### API Details

- Endpoint: /transaction/
- Method: POST
##### Request Body:
```json
{
  "totalPrice": 36.00,
  "totalQuantity": 2,
  "products": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```
##### Response:
```json
{
  "transactionId": 1,
  "totalPrice": "36.00",
  "totalQuantity": 2
}
```

### Get Transaction By ID
```mermaid
sequenceDiagram
    participant Client
    participant FastifyServer
    participant TransactionController
    participant TransactionModel

    Client->>FastifyServer: GET /transaction/:transactionId
    FastifyServer->>TransactionController: getTransaction(request, reply)
    TransactionController->>TransactionController: request.params.transactionId
    TransactionController->>TransactionModel: Transaction.findByPk(transactionId, { include: { model: TransactionProduct, as: 'products' } })
    TransactionModel-->>TransactionController: transaction (or null)
    TransactionController-->>FastifyServer: return transaction or not found
    FastifyServer-->>Client: HTTP 200
```

#### API Details

- Endpoint: /transaction/:transactionId
- Method: GET

##### Response:
```json
{
  "transactionId": 1,
  "totalPrice": "36.00",
  "totalQuantity": 2,
  "createdAt": "2024-06-24T05:43:31.000Z",
  "updatedAt": "2024-06-24T05:43:31.000Z",
  "products": [
    {
      "transactionProductId": 1,
      "productId": 2,
      "price": "15.00",
      "quantity": 1,
      "createdAt": "2024-06-24T05:43:31.000Z",
      "updatedAt": "2024-06-24T05:43:31.000Z",
      "transactionId": 1
    },
    {
      "transactionProductId": 2,
      "productId": 3,
      "price": "30.00",
      "quantity": 1,
      "createdAt": "2024-06-24T05:43:31.000Z",
      "updatedAt": "2024-06-24T05:43:31.000Z",
      "transactionId": 1
    }
  ]
}
```
