const userModel = require("../models/userModel");
const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");

//================================================ Authentication ==================================================//

// const isAuthenticated = async function ( req , res , next ) {
//     try{
//         let token = req.headers.authorization

//         if( !token ){
//             return res.status(400).send({ status : false , message : "Token must be present in the bearer."})
//         }
//         token = token.slice(7)

//         jwt.verify( token , "man-ki-baat" , function ( error , decodedToken ) {
//             if ( error) {
//                 if ( error.name === "JsonWebTokenError" ) {
//                     return res.status(401).send({ status : false , message : "Invalid token."})
//                 }

//                 if ( error.name === "TokenExpiredError") {
//                     return res. status(401).send({ status : false , message : "You are logged out login again."})
//                 }else {
//                     return res.status(401).send({ status : false , message : error.message})
//                 }
//             }else{

//                 req.token = decodedToken
//                 let data=req.token
//                 console.log(data)
//                 next()
//             }
//         })

//     }catch( error ){
//         return res.status(500).send({ status : false , message : error.message})
//     }
// }

/* const isAuthenticated =  async function (req, res, next) {
  let token = req.headers["x-auth-token"] || req.query.token;

  if (!token) {
    return res.status(400).send({
      status: false,
      message: "Please provide your number and verify yourself ",
    });
  }

  jwt.verify(token, "man-ki-baat", async function (err, decoded) {
    if (err) {
        console.log(err.message)
      return res.status(401).send({ status: false, message: err.message});
    } else {
      req.token = decoded;
      req.user = decoded;
      let data = req.token;
    //   console.log(data);
    //   console.log(req.token.userId)
      next();
    }
  });
}; */

const isAuthenticated = async (req, res, next) => {
  try {
    // ✅ 1. Get token from multiple sources
    const authHeader = req.headers["authorization"]; // Bearer token
    const token =
      req.cookies?.auth_token ||        // from cookie
      req.headers["x-auth-token"] ||    // custom header
      req.query.token ||                // query param
      (authHeader && authHeader.startsWith("Bearer ") 
        ? authHeader.split(" ")[1] 
        : null);                        // Bearer header

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // ✅ 2. Verify token
    const decoded = jwt.verify(token, "man-ki-baat"); // replace with your secret

    // ✅ 3. Attach user info to req
    req.user = decoded;
    req.token = token;

    // ✅ 4. Continue to next middleware or route
    next();
  } catch (err) {
    // ✅ 5. Detailed logging for debugging
    console.error(
      "❌ JWT verification failed:",
      err.name,   // TokenExpiredError, JsonWebTokenError, etc.
      err.message
    );

    // ✅ 6. Clear cookie only if it exists
    if (req.cookies?.auth_token) {
      res.clearCookie("auth_token");
    }

    // ✅ 7. Send appropriate response
    let message = "Invalid or expired session. Please log in again.";
    if (err.name === "TokenExpiredError") {
      message = "Session expired. Please log in again.";
    } else if (err.name === "JsonWebTokenError") {
      message = "Invalid token. Please log in again.";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

//============================================ Autherisation ==============================================//

const isAuthorized = async function (req, res, next) {
  try {
    let loggedUserId = req.token.userId;

    if (req.originalUrl === "/user") {
      let userId = req.body.userId;

      if (userId && typeof userId != "string") {
        return res
          .status(400)
          .send({ status: false, message: "UserId must be in string." });
      }
      if (!userId || !userId.trim()) {
        return res
          .status(400)
          .send({
            status: false,
            message: "User Id must be present for Authorization.",
          });
      }
      userId = userId.trim();

      if (!isValidObjectId(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid UserId." });
      }

      const userData = await userModel.findById(userId);
      if (!userData) {
        return res
          .status(404)
          .send({ status: false, message: "The user Id does not exist." });
      }

      if (loggedUserId != userId) {
        return res
          .status(403)
          .send({
            status: false,
            message: "You are not authorized,please provide valid user id.",
          });
      }
      req.body.userId = userId;
    } else {
      let userId = req.params.userId;

      if (!userId) {
        return res
          .status(400)
          .send({ status: false, message: "User id is mandatory" });
      }
      if (!isValidObjectId(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid user ID" });
      }

      let checkuserId = await userModel.findById(userId);
      if (!checkuserId) {
        return res
          .status(404)
          .send({
            status: false,
            message:
              "Data Not found with this user id, Please enter a valid user id",
          });
      }

      let authenticatedUserId = checkuserId._id;

      if (authenticatedUserId != loggedUserId) {
        return res
          .status(403)
          .send({
            status: false,
            message: "Not authorized,please provide your own user id",
          });
      }
    }
    next();
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { isAuthenticated, isAuthorized };
