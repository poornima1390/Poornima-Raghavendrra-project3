import axios from "axios";
import { useState } from "react";

export default function Login() {


    async function submitLogin() {

    }   

    return (
        <div>
            Login Page
            <div>
                <h3>Login Here:</h3>
                <div>
                    Username:
                    <input onChange={(event) => console.log(event)} />
                </div>
                <div>
                    Passowrd:
                    <input onChange={(event) => console.log(event)} />
                </div>
                <div>
                    <button onClick={() => submitLogin()}>Login</button>
                </div>


            </div>
        </div>
    )
}