import React, {useState} from 'react';
import styled from 'styled-components';
import {api} from "../api";

interface LoginProps {
}

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 1em;
  margin: 0 auto;
`;

const Input = styled.input`
  padding: 0.5em;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5em;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const LogIn: React.FC<LoginProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleLogin(email, password);
    };

    const handleLogin = async (email: string, password: string) => {
        const payload = {
            email,
            password
        };

        try {

            const response = await api.post('/api/auth/login', payload);
            console.log(response.data);
            // Here you can handle the response, save the user info, tokens, etc.
        } catch (error) {
            console.error(error);
            // Here you can handle errors, show a message, etc.
        }
    };


    return (
        <LoginForm onSubmit={handleSubmit}>
            <label>
                Email:
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
            </label>
            <label>
                Password:
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
            </label>
            <Button type="submit">Login</Button>
        </LoginForm>
    );
};