import React, { useState } from 'react';
import { api } from '../api';
import styled from "styled-components";

interface SignupPayload {
    email: string;
    password: string;
}

const SignUpForm = styled.form`
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

export const SignUp: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: SignupPayload = {
            email,
            password
        };

        try {
            const response = await api.post('/api/auth/signup', payload);
            // handle success
        } catch (error) {
            // handle error
        }
    };

    return (
        <SignUpForm onSubmit={handleSubmit}>
            <label>
                Email:
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
            </label>
            <label>
                Password:
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
            </label>
            <Button type="submit">Sign Up</Button>
        </SignUpForm>
    );
};
