import { Router } from "express"
import { uploadProds } from "../config/multer.js"

const imagesRouter = Router()

imagesRouter.post('/products', uploadProds.single('thumbnail'), (req, res) => {
    if (req.file) {
        res.status(200).send({ message: 'Imagen subida correctamente' })
    }
})

export default imagesRouter