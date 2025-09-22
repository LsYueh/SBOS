export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING
  })

  User.associate = (models) => {
    User.hasMany(models.Post)
  }

  return User
}
