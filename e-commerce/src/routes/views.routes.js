import {Router} from "express";//importamos "routes" desde la libreria de express
//import { productsService } from "../dao/index.js";
import { productsServiceMongo } from "../dao/index.js";
import { cartsServiceMongo } from "../dao/index.js";

const router = Router();

router.get("/", async (req,res)=>{
    try{
            const products = await productsServiceMongo.getProducts();
            //console.log(products)
            if(products.length === 0){
                res.render('no-products', products)
                throw new Error('No hay productos');
            }
            //aca renderizamos la vista del "home", y le pasamos un objeto con los datos de nuestros productos y los enviamos al "home.hbs".
            res.render("home", {products: products});

        } catch (error) {
            res.status(500).json({ message: error.message }); 
        }

});//

//ruta que esta vinculada al servidor de "websocket"
router.get("/realtimeproducts", (req,res)=>{
    try{    
            //aca renderizamos la vista del "realtime".
            res.render("realtime")

        } catch (error) {
            res.status(500).json({ message: error.message });        
        }

});

//ruta que esta vinculada al servidor de "websocket"
router.get("/chats", (req,res)=>{
    try{    
            //aca renderizamos la vista del "realtime".
            res.render("chats")

        } catch (error) {
            res.status(500).json({ message: error.message });        
        }

});

//pagiante// localhost:8080?page=1 ... 2 ...3 ..etc
router.get('/products', async (req, res) => {
    try {

        const { limit= 4, page=1 } = req.query;
        const query = {};
        const options = {
            limit,
            page,
            sort: { price: 1 },   
            lean: true
        }
        const result = await productsServiceMongo.getProductsPaginate(query, options);
        //console.log('products', result);
        //obtengo la ruta del servidor 
        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const dataProducts = {
            status:'success',
            payload: result,
            totalPages: result.totalPages,
            prevPage: result.prevPage ,
            nextPage: result.nextPage,
            page: result.page,
            pagingCounter: result.pagingCounter,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? 
            `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}` 
            : null,
            nextLink: result.hasNextPage ? baseUrl.includes("page") ? 
            baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) :
            baseUrl.concat(`?page=${result.nextPage}`) : null

        }
        console.log(result)
       // console.log(dataProducts.payload)
       // console.log('Data del console log:', dataProducts.nextLink, dataProducts.prevLink)
        res.render('productsPaginate', dataProducts);

    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
})

//ruta hardcodeada localhost:8080/cart/652832e202a5657f7db4c22a
router.get('/cart/:cid', async (req, res) => {
    const cartId = '6652832e202a5657f7db4c22a'
    try {
        const cart = await cartsServiceMongo.getCartsId(cartId);
        //console.log('Prueba en consola', cart);
        if(!cart){
            return res.status(404).send('No se pudo encontrar el carrito');
        }else{
            //console.log('Carrito en consola ',cart.products);
            res.status(200).render('cart', { products: cart.products });
            
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

export {router as viewsRouter};//lo exportamos para poder importarlo en "app.js".
