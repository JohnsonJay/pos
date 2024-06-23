import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/mysql.adapter';

interface UserModel {
    id: number
    email: string
    password: string
}

interface UserCreationModel extends Optional<UserModel, 'id'> {}

class User extends Model<UserModel, UserCreationModel> implements UserModel {
    declare id: number
    declare email: string
    declare password: string

    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: new DataTypes.STRING(120),
            allowNull: false
        },
        password: {
            type: new DataTypes.STRING(120),
            allowNull: false
        }
    },
    {
        tableName: 'users',
        sequelize
    }
)

export default User
