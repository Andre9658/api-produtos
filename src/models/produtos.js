const pool = require('./database')

async function getProdutos () {
    const produtos = await pool.query('SELECT * FROM produtos')

    return produtos.rows
}

async function createProduto(produto){
    try {
        const insertProduto = await pool.query(`
        INSERT INTO produtos
                (nome, categoria, preco, image_url)
                VALUES ($1, $2, $3, $4)
                RETURNING *
        `, [
            produto.nome,
            produto.categoria,
            produto.preco,
            produto.image_url
        ])

        return insertProduto.rows[0]
    } catch (error) {
        console.error(error)
        throw new Error('Erro ao criar produto')
    }

}

async function deleteProduto(id) {
    try {
        await pool.query(`
        DELETE FROM produtos 
        WHERE id = $1  
        
        `, [id])
    } catch (error) {
        console.error(error)
        throw new error ('Erro ao Deletar produto')
    }
}
module.exports = {
    getProdutos,
    createProduto,
    deleteProduto
}