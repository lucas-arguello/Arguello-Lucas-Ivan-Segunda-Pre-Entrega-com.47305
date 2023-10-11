import { cartsModel } from "./models/cartsModel.js";


export class CartsManagerMongo{
            constructor() {
                this.model = cartsModel;
                
            };
            //Esta funcion es para crear el carrito.
            async createCarts (productId) {
                try{
                    const cart = await this.model.create({ product: [{ productId, quantity: 1 }] });

                    return cart

                }catch(error){
                    console.log("createCarts ",error.message);
                    throw new Error("No se pudo crear el carrito");

                };
                
            };

            //Esta funcion es para obtener el listado de carritos.
            async getCarts () {
                try {

                    const carts = await this.model.find();

                    return carts

                }catch(error){
                    console.log("getCarts",error.message);
                    throw new Error("No se pudieron obtener el listado de carritos");

                };
            };

            //Esta funcion es para agregar productos al carrito
            async addProduct(cartId, productId, quantity) {
                try {

                    const cart = await this.model.findById(cartId);

                    if (!cart) {
                        throw new Error("No es posible obtener el carrito");
                    }
            
                    // Verifica si el producto ya existe en el carrito
                    const existingProductIndex = cart.products.findIndex(item => item.id === productId);
            
                    if (existingProductIndex !== -1) {
                        // Incrementa la cantidad si el producto ya existe
                        cart.products[existingProductIndex].quantity += quantity || 1;
                    } else {
                        // Agrega un nuevo producto al carrito
                        cart.products.push({
                            id: productId,
                            quantity: quantity || 1
                        });
                    }
                    
                    await cart.save();
              
                    return cart;

                }catch(error){
                    console.log("addProduct",error.message);
                    throw new Error("No se pudieron agregar productos al carrito");

                };

            };

            //Esta funcion es para eliminar un carrito segun su "id".
            // async deleteProduct(cartId) {
            //     try {
            //       // Intento encontrar y eliminar el carrito por su ID
            //       const cart = await this.model.findByIdAndDelete(cartId);
              
            //       // Verifico si el carrito se encontró y se eliminó exitosamente
            //       if (!cart) {
            //         throw new Error("No se pudo encontrar el carrito a eliminar");
            //       }
              
            //       // Devuelve el resultado que contiene el carrito eliminado
            //       return cart;
            //     } catch (error) {
            //       console.log("deleteCart", error.message);
              
            //       // Lanza una excepción con un mensaje específico si ocurre un error
            //       throw new Error("No se pudo eliminar el carrito");
            //     };
            //   };
              
};