import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute
} from 'sequelize'
import sequelize from "../../config/mysql.adapter";

class Transaction extends Model<
InferAttributes<Transaction, { omit: 'products' }>,
InferCreationAttributes<Transaction, { omit: 'products' }>
> {
  declare transactionId: CreationOptional<number>
  declare totalPrice: number
  declare totalQuantity: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare products?: NonAttribute<TransactionProduct>
}

Transaction.init({
  transactionId: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  tableName: 'transactions',
  sequelize
})

class TransactionProduct extends Model<
InferAttributes<TransactionProduct>,
InferCreationAttributes<TransactionProduct>
> {
  declare transactionProductId: CreationOptional<number>
  declare transactionId: ForeignKey<Transaction['transactionId']>
  declare productId: number
  declare price: number
  declare quantity: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

TransactionProduct.init({
  transactionProductId: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE
  },
  updatedAt: {
    type: DataTypes.DATE
  }
},
{
  tableName: 'transaction_product',
  sequelize
}
)

Transaction.hasMany(TransactionProduct, { foreignKey: 'transactionId', as: 'products' })
TransactionProduct.belongsTo(Transaction, { foreignKey: 'transactionId' })

export { Transaction, TransactionProduct }
