import "./Login.css"
import { useState } from "react";
import { 
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../../Firebase/Config";
import { useHistory } from "react-router-dom"


function Login() {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const history = useHistory();

  const login = () => {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword).then(
      userCredential => {
        if(userCredential){
          history.push("/Dashboard");
          localStorage.setItem("email", loginEmail);
          localStorage.setItem("userState", "loggedIn")
        }
      }
    ).catch(e => {
      if(e.code === "auth/invalid-email"){
        console.log("Invalid email");
        setLoginError("Invalid email");
      }else if(e.code === "auth/user-not-found"){
        console.log("User not found");
        setLoginError("User not found");
      }else if(e.code === "auth/wrong-password"){
        console.log("Wrong password");
        setLoginError("Wrong password");
      }
    })
  }

  return(
    <div className={"loginContainer"}>
      <div className={"form"}>

        <h1> Login </h1>
        <div>
          <label htmlFor="email">{(loginError==="Wrong password"?"":loginError)}</label>
          <input id="email" placeholder="Email..." onChange={e => { setLoginEmail(e.target.value) }}/>
        </div>
        <div>
          <label htmlFor="">{(loginError==="Wrong password"?loginError:"")}</label>
          <input placeholder="Password..." type={"password"} onChange={e => { setLoginPassword(e.target.value) }}/>
        </div>

        <button onClick={login}> Login </button>
      </div>
    </div>
  )
 }
 
 export default Login;
 