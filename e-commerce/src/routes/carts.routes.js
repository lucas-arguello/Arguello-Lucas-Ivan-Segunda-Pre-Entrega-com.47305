//import fs from "fs";// importamos el modulo "fs" file system, para que funcionen las funciones asincronas.
import {Router} from "express";//importamos "routes" desde la libreria de express, para poder realizar el ruteo de los metodos.
//import { cartsService } from "../dao/index.js";//importamos la instancia del Manager de carritos.
import { cartsServiceMongo } from "../dao/index.js"
const router = Router();

//Usamos el metodo GET para crear una ruta que nos permita obtener el listado de todos los carritos.
router.get("/", async (req, res) => {
    try {
      const carts = await cartsServiceMongo.getCarts();
  
      res.json({ message: "Listado de carritos", data: carts });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

//Usamos el metodo GET para crear una ruta que nos permita obtener un solo carrito.

router.get("/:cid", async (req, res) => {
    try {
      
      const cartId = req.params.cid; //obtengo el id del carrito ingresado por el cliente en la URL.
      const carts = await cartsServiceMongo.getCarts(); //traigo todos los carritos con el metodo "getCarts" del "cartService", para luego buscar en el listado de carritos.
      
      const cart = carts.find(cart => cart.id === cartId); //busco el carrito por su id.
      res.json({ message: "Carrito encontrado", data: cart }); //la respuesta a la solicitud del cliente.
    
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

//Usamos el metodo POST para crear una ruta que nos permita crear un carrito.
router.post("/", async (req, res) => {
    try {
      
      const newCart = await cartsServiceMongo.createCarts();//traigo el metodo "createCart" del "cartService", para poder crear un carrito.
      res.json({ message: "Carrito creado", data: newCart });//la respuesta a la solicitud del cliente.
    
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

  //Usamos el metodo POST para crear una ruta que nos permita buscar un carrito y agregar productos en el.
  router.post("/:cid/products/:pid", async (req, res) => {
    try {

      //obtengo el id del carrito y el id del producto ingresado por el cliente en la URL.
      const cartsId = req.params.cid;
      const productId = req.params.pid;

      const quantity = 1;
      
      const cart = await cartsServiceMongo.addProduct(cartsId, productId, quantity);//Y con los ID de carrito y de producto, buscamos el carrito y le agregamos los productos segun su id.
      res.json({ message: "Producto agregado al carrito", data: cart });//la respuesta a la solicitud del cliente.
    
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

export {router as cartsRouter};