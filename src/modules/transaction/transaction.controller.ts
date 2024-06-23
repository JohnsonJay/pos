import { FastifyReply, FastifyRequest } from 'fastify'
import Product from '../product/product.model'
import { Transaction, TransactionProduct } from './transaction.model'
import {
  createTransactionSchema,
  CreateTransactionInput
} from './transaction.schema'
import { HttpResponseCodes } from '../../utils/httpResponseCodes'

type ProductsMap = Map<number, number>

interface TransactionProductInput {
  productId: number
  quantity: number
  upsell?: number[]
}

// TODO move these functions out to separate files
const explodeUpsellMap = (
  productsMap: ProductsMap,
  products?: number[]
): ProductsMap => {
  products?.forEach(item => productsMap.set(item, 1))
  return productsMap
}

const productsReducer = (
  productsMap: ProductsMap,
  product: TransactionProductInput
): ProductsMap => {
  productsMap.set(product.productId, product.quantity)

  explodeUpsellMap(productsMap, product.upsell)
  return productsMap
}

const productsMap = (
  products: TransactionProductInput[]
): ProductsMap => products.reduce(productsReducer, new Map<number, number>())

const productHasStock = async (
  productsMap: ProductsMap
): Promise<boolean> => {
  const result = await Product.findAll({
    attributes: ['productId', 'quantity'],
    where: { productId: [...productsMap.keys()] }
  })

  return result.every(item => item.quantity >= (productsMap.get(item.productId) ?? 0))
}

export const createTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
  const validation = createTransactionSchema.safeParse(request.body)
  // TODO Add Validation

  const { totalPrice, totalQuantity, products } = validation.data as CreateTransactionInput

  try {
    const lookupList = productsMap(products)

    if (!await productHasStock(lookupList)) {
      return await reply.status(HttpResponseCodes.BAD_REQUEST).send({ error: 'Products are not in stock' })
    }

    const transaction = await Transaction.create({
      totalPrice,
      totalQuantity
    })

    const productDetails = await Product.findAll({
      attributes: ['productId', 'price', 'quantity'],
      where: { productId: [...lookupList.keys()] }
    })

    await TransactionProduct.bulkCreate(productDetails.map(product => ({
      productId: product.productId,
      price: product.price,
      quantity: lookupList.get(product.productId) ?? 0,
      transactionId: transaction.transactionId
    })))

    await Promise.allSettled(productDetails.map(
      async product => {
        return await Product.decrement(
          ['quantity'],
          {
            by: lookupList.get(product.productId),
            where: { productId: product.productId }
          }
        )
      }
    ))

    reply.status(HttpResponseCodes.CREATED).send({
      transactionId: transaction.transactionId,
      totalPrice: transaction.totalPrice,
      totalQuantity: transaction.totalQuantity
    })
  } catch (error) {
    console.error(error)
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Could not create transaction.' })
  }
}

export const getTransaction = async (request: FastifyRequest, reply: FastifyReply) => {
  // TODO Add Validation

  const { transactionId } = request.params as { transactionId: number }
  try {
    const transaction = await Transaction.findByPk(transactionId, {
      include: {
        model: TransactionProduct,
        as: 'products'
      }
    })

    if (transaction === null) {
      return await reply.status(HttpResponseCodes.NOT_FOUND).send({ error: 'Transaction does not exist' })
    }

    // TODO Add Validation

    reply.status(HttpResponseCodes.OK).send(transaction.toJSON())
  } catch (error) {
    console.error(error)
    reply.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).send({ error: 'Could not get transaction' })
  }
}
