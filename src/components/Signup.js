import React, { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { IconAt, IconLock, IconUser } from '@tabler/icons-react';
import { Input, Button } from '@mantine/core';
import { MantineProvider } from '@mantine/core';

function SignUp() {

    const history = useNavigate();
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e) {
        e.preventDefault();

        try {

            await axios.post("http://localhost:8000/signup", {
                username,
                email,
                password
            })
                .then(res => {
                    if (res.data === "exist") {
                        alert("user already exists")
                    }
                    else if (res.data === "notexist") {
                        // Redirect to the login page after successful registration
                        history("/");
                    }
                })
                .catch(e => {
                    alert("wrong details")
                    console.log(e);
                })
        }
        catch (e) {
            console.log(e);
        }

    }

    return (
        <MantineProvider>
            <div className="login">

                <center>
                    <br />
                    <h1>SignUp</h1><br /><br />
                    <form action="POST">
                        <label>Create Username:  </label>
                        <Input type="text" onChange={(e) => { setUsername(e.target.value) }} name="" id="" placeholder="Username" size="xs" icon={<IconUser />} style={{ width: '200px' }} />
                        <br /><br />
                        <label>Enter Email:  </label>
                        <Input type="text" onChange={(e) => { setEmail(e.target.value) }} name="" id="" placeholder="Your Email" size="xs" icon={<IconAt />} style={{ width: '200px' }} />
                        <br /><br />
                        <label>Password:  </label>
                        <Input type="password" onChange={(e) => { setPassword(e.target.value) }} name="" id="" placeholder="Password" size="xs" icon={<IconLock />} style={{ width: '200px' }} />
                        <br /><br />
                        <Button type="submit" style={{width: '10%'}} onClick={submit} color="dark">Register</Button>
                    </form>

                    <br />
                    <p>OR</p>
                    <br />

                    <Link to="/">Login page</Link>
                </center>
            </div>
        </MantineProvider>
    )
}

export default SignUp