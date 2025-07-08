const JWT_USER_PASSWORD = process.env.JWT_USER_SECRET || "your-secure-user-secret-key-here"
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_SECRET || "your-secure-admin-secret-key-here"

module.exports = {
    JWT_ADMIN_PASSWORD,
    JWT_USER_PASSWORD
}