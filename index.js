const express = require ('express')
const app = express ()
const port = 6579;
require('./src/models')
const produtosRoutes = require('./src/routes/produtos')
const usersRoutes = require('./src/routes/users')
const authRoutes = require('./src/routes/auth')
const cors = require ('cors')

app.use(cors())
app.use(express.json())
app.use(produtosRoutes)
app.use(usersRoutes)
app.use(authRoutes)

app.listen(port, () => {
console.log (`Servidor rodando na porta ${port}`)
})