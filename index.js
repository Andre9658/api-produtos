const express = require('express')
const app = express ()
const port = 6579  //porta do meu computador
require('dotenv').config() 
const { Pool } = require('pg')

const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT   // porta do banco de dados
})

app.use(express.json()) // configuração inicial

app.post('/produtos', async (req,res) => {
    const { nome, preco, categoria, image_url } = req.body

    if(!nome || !preco || !categoria || !image_url) {
        return res.status(400).send('Todos os campos são obrigatórios')
    }


    if(nome.lenght > 100) {
        return res.status(400).send('Nome pode ter no máximo 100 caracteres')
    }

    if(categoria.lenght > 50) {
        return res.status(400).send('Categoria pode ter no máximo caracteres')
    }

    try {
        const produto = await pool.query(`
    INSERT INTO produtos (nome, preco, categoria, image_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,[nome, preco, categoria, image_url])

    res.status(201).send(produto.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).send('Erro ao cadastrar produto')
    }
})

app.get('/produtos', async (req,res) => {
    try {
        const produtos = await pool.query('SELECT * FROM produtos')

        return res.status(200).send(produtos.rows)
    } catch (error) {
        console.error(error)

        return res.status(500).send('Erro ao buscar produtos')
    }
})

app.get('/produtos/:id' , async (req,res) => {
    const { id } = req.params;

    try {
      const produto = await pool.query(`
      SELECT * FROM produtos WHERE id = $1
      `, [id])
      
      if(!produto.rows.length){
        return res.status(404).send('Produto não encontrado!')
      }

      return res.status(200).send(produto.rows[0])
    } catch (error) {
        console.error(error)
        return res.status(500).send('Erro ao buscar o produto')

    }

})

app.delete('/produtos/:id',async (req,res) => {
    const { id } = req.params;
    
    try {
        const produto = await pool.query(`
        SELECT * FROM produtos WHERE id = $1
        `,[id])

        if(produto.rows.length){
            return res.status(404).send('Produto não encontrado')
        }

        await pool.query(`
        DELETE FROM produtos WHERE id = $1
        `,[id])

        return res.status(204).send('Produto deletado com sucesso')
    } catch (error) {
        console.error(error)

        return res.status(500).send('Erro ao deletar o produto')
    }
})

app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params; 
    const { nome, preco, categoria, image_url } = req.body;

    try {
      const produto = await pool.query('SELECT * FROM produtos WHERE id = $1', [id])  

      if(!produto.rows.length){
        return res.status(404).send('Produto não encontrado')
      }

      await pool.query(`
      UPDATE produtos Set
      nome = $1,
      preco = $2,
      categoria = $3,
      image_url = $4
      WHERE id = $5
      `,[nome, preco, categoria, image_url, id])
    } catch (error) {
        console.error(error)
        return res.status(500).send('Produto atualizado com sucesso')
    }


})

app.listen (port, () => {
    console.log(`O servidor está rodando na porta ${port}`)
})