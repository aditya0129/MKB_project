// import React from "react";
// import "./login-man-ki-baat_component.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field } from "formik";
// import axios from "axios";
// import $ from "jquery";
// import { useCookies } from "react-cookie";

// export function LoginManKiBaatComponent() {
//   const navigate = useNavigate();
//   const [cookies, setCookie, removeCookie] = useCookies();

//   const SignupClick = () => {
//     navigate("/signup")
//   }

//   return (
//     <>
//       <div className="box" id="body" style={{height:"470px"}}>
//         <Formik 
//         initialValues={{
//             "email":"",
//             "password":""
//         }}
//         onSubmit={
//             (values)=>{
//                 $.ajax({
//                     method: "get",
//                     url: "http://localhost:3001/user/:userId/profile"
//                 })
//                 .then(response=>{
//                     for(var user of response.data){
//                         if(user.email===values.email && user.password===values.password) {
//                             setCookie("userid", values.email);
//                             navigate("/");
//                             break;
//                         } else {
//                             navigate("/invalid")
//                         }
//                     }
//                 })
//             }
//         }
//         >
//             {
//                 <Form autocomplete="off">
//                 <FontAwesomeIcon className="icon" icon={faUserTie} />
//                 <h2>Sign in</h2>
//                 <div className="inputBox">
//                   <Field type="text" name="email"/>
//                   <span>Email</span>
//                   <i></i>
//                 </div>
//                 <div id="inputBox">
//                   <Field type="password"  name="password"/>
//                   <span>Password</span>
//                   <i></i>
//                 </div>
//                 <div className="links">
//                   <a href="forget-password">Forgot Password ?</a>
//                   <a href="signup" onClick={SignupClick}>Signup</a>
//                 </div>
//                 <input type="submit" value="Login" />
//               </Form>
//             }
//         </Formik>
//       </div>
//     </>
//   );
// }


// import React from "react";
// import "./login-man-ki-baat_component.css";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate } from "react-router-dom";
// import { Formik, Form, Field } from "formik";
// import axios from "axios";
// import $ from "jquery";
// import { useCookies } from "react-cookie";

// export function LoginManKiBaatComponent() {
//   const navigate = useNavigate();
//   const [cookies, setCookie, removeCookie] = useCookies();

//   const SignupClick = () => {
//     navigate("/signup");
//   }

//   return (
//     <>
//       <div className="box" id="body" style={{height:"470px"}}>
//         <Formik 
//           initialValues={{
//               "email":"",
//               "password":""
//           }}
//           onSubmit={(values, { setSubmitting }) => {
//             axios.get("http://localhost:3001/user/:userId/profile")
//               .then(response => {
//                 const user = response.data.find(user => user.email === values.email && user.password === values.password);
//                 if (user) {
//                   setCookie("userid", values.email);
//                   navigate("/");
//                 } else {
//                   navigate("/invalid");
//                 }
//               })
//               .catch(error => {
//                 console.error('Error:', error);
//                 navigate("/invalid");
//               })
//               .finally(() => {
//                 setSubmitting(false);
//               });
//           }}
//         >
//           {({ isSubmitting }) => (
//             <Form autoComplete="off">
//               <FontAwesomeIcon className="icon" icon={faUserTie} />
//               <h2>Sign in</h2>
//               <div className="inputBox">
//                 <Field type="text" name="email"/>
//                 <span>Email</span>
//                 <i></i>
//               </div>
//               <div id="inputBox">
//                 <Field type="password"  name="password"/>
//                 <span>Password</span>
//                 <i></i>
//               </div>
//               <div className="links">
//                 <a href="forget-password">Forgot Password ?</a>
//                 <a href="signup" onClick={SignupClick}>Signup</a>
//               </div>
//               <button type="submit" disabled={isSubmitting}>Login</button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </>
//   );
// }

import React from "react";
import "./login-man-ki-baat_component.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useCookies } from "react-cookie";

export function LoginManKiBaatComponent() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();

  const SignupClick = () => {
    navigate("/signup");
  }

  return (
    <div className="box" id="body" style={{ height: "470px" }}>
      <Formik
        initialValues={{
          email: "",
          password: ""
        }}
        // onSubmit={async (values, { setSubmitting }) => {
        //   try {
        //     const response = await axios.get("http://localhost:3001/user/66166315a8928cdfd5941024/profile"); // Adjust the URL accordingly
        //     const user = response.data.find(user => user.email === values.email && user.password === values.password);
        //     if (user) {
        //       setCookie("userid", values.email);
        //       navigate("/");
        //     } else {
        //       navigate("/invalid");
        //     }
        //   } catch (error) {
        //     console.error('Error:', error);
        //     navigate("/invalid");
        //   } finally {
        //     setSubmitting(false);
        //   }
        // }}

        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.get("http://localhost:3001/user/66166315a8928cdfd5941024/profile");
            console.log(response.data); // Log the response data to see its contents
            const user = Array.isArray(response.data) ? response.data.find(user => user.email === values.email && user.password === values.password) : null; // Check if response.data is an array and use find
            if (user) {
              setCookie("userid", values.email);
              navigate("/");
            } else {
              navigate("/invalid");
            }
          } catch (error) {
            console.error('Error:', error);
            navigate("/invalid");
          } finally {
            setSubmitting(false);
          }
        }}
        
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <FontAwesomeIcon className="icon" icon={faUserTie} />
            <h2>Sign in</h2>
            <div className="inputBox">
              <Field type="text" name="email" />
              <span>Email</span>
              <i></i>
            </div>
            <div id="inputBox">
              <Field type="password" name="password" />
              <span>Password</span>
              <i></i>
            </div>
            <div className="links">
              <a href="forget-password">Forgot Password ?</a>
              <a href="signup" onClick={SignupClick}>Signup</a>
            </div>
            <button type="submit" disabled={isSubmitting}>Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}