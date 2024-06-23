import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize'
import Product from '../product/product.model'
import sequelize from '../../config/mysql.adapter'

class ProductUpsell extends Model<InferAttributes<ProductUpsell>, InferCreationAttributes<ProductUpsell>> {
  declare productId: ForeignKey<Product['productId']>
  declare upsellProductId: ForeignKey<Product['productId']>
}

ProductUpsell.init({
  productId: {
    type: DataTypes.BIGINT.UNSIGNED
  },
  upsellProductId: {
    type: DataTypes.BIGINT.UNSIGNED
  }
}, {
  tableName: 'product_upsell',
  sequelize
})

export default ProductUpsell
