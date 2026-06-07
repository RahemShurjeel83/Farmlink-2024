const express = require("express");
const {checkToken:Auth}=require("../middlewares/authentication")
const { Login, Register } = require("../Controllers/vendorController");
const { BothAuth } = require("../utils/guards");
const { getproductForVendor } = require("../Controllers/Admin/ProductController");
const   router = express.Router();

router.route("/login").post(Login);
router.route("/register").post(Register);
router.route("/getproduct").get(Auth,BothAuth,getproductForVendor);

// //Category Routes
// router.route("/postcategory").post(categoryUploadMiddleware,postCategory); 
// router.route("/getcategory").get(Auth,getCategories);
// router.route("/deletecategory/:categoryId").delete(Auth,deleteCategory);
// //Product Routes
// router.route("/postproduct").post(productUploadMiddleware,postproduct);
// router.route("/getproduct").get(getproduct);
// router.route("/deleteproduct/:productId").delete(deleteproduct);

// //ContactUs Routes
// router.route("/postcontactus").post(postcontactus);
// router.route("/getcontactus").get(getcontactus);
// router.route("/deletecontactus/:queryId").delete(deletecontactus);

// //Orders Routes
// router.route("/addtocart/:productid/:userid").post(addtocart);
// router.route("/getCartItems/:userid").get(getCartItems); 
// router.route("/removeFromCart/:productid/:userid").delete(removeFromCart);
// router.route("/postorder").post(postorder);
// router.route("/getorder").get(getorder);
// router.route("/deleteorder/:orderId").delete(deleteorder); 
// router.route("/getCartItemsSingle/:productid/:userid").get(getCartItemsSingle);
// router.route("/filterbycategory/:filter").get(filterbycategory);



module.exports = router;
