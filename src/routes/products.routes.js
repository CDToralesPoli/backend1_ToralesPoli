import { Router } from "express"
import crypto from "crypto"
import { readFile, writeFile } from 'fs/promises'

const productsRouter = Router()

const productsData = await readFile('src/db/products.json', 'utf-8')
const products = JSON.parse(productsData)

// Obtener todos los productos
productsRouter.get('/', (req, res) => {
    const { limit } = req.query
    const limitedProducts = products.slice(0, limit)
    res.status(200).send(limitedProducts)
})

// Obtener un solo producto
productsRouter.get('/:pid', (req, res) => {
    const id = (req.params.pid)
    const product = products.find(p => p.id == id)
    if (product) { 
        res.status(200).send(product)
    } else {
        res.status(404).send({ error: 'Producto no encontrado' })
    }
})

// Agregar un nuevo producto
productsRouter.post ('/', async (req,res) => {
    const {title, description, code, price, stock, category} = req.body
    const newProduct = {
         id: crypto.randomBytes(10).toString('hex'), //Genera id unico mediante crypto
         title: title,
         description: description,
         code: code,
         price: price,
         status: true,
         stock: stock,
         category: category,
         thumbnails: []
    }
    products.push(newProduct)
    await writeFile('src/db/products.json', JSON.stringify(products))
    res.status(201).send({mensaje: `Producto creado correctamente con el id: ${newProduct.id}`})
 })

// Actualizar un producto
productsRouter.put('/:pid', async (req, res) => {
    const id = (req.params.pid)
    const {title, description, code, price, status, stock, category, thumbnails} = req.body
    const index = products.findIndex(p => p.id == id)
    if (index != -1) {
        products[index].title = title
        products[index].description = description
        products[index].code = code
        products[index].status = status
        products[index].price = price
        products[index].stock = stock
        products[index].category = category
        products[index].thumbnails = thumbnails
        await writeFile('src/db/products.json', JSON.stringify(products))
        res.status(200).send({ message: 'Producto actualizado correctamente' })
    } else {
        res.status(404).send({ error: 'Producto no encontrado' })
    }
})

// Eliminar un producto
productsRouter.delete('/:pid', async (req, res) => {
    const id = req.params.pid
    const index = products.findIndex(p => p.id == id)
    if (index != -1) {
        products.splice(index, 1)
        await writeFile('src/db/products.json', JSON.stringify(products))
        res.status(200).send({ message: 'Producto eliminado correctamente' })
    } else {
        res.status(404).send({ error: 'Producto no encontrado' })
    }
})

export default productsRouter