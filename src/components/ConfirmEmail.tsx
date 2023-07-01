import React, { useState } from 'react';
import { api } from '../api';
import styled from "styled-components";

interface ConfirmEmailPayload {
    email: string;
    confirmationCode: string;
}

const ConfirmEmailForm = styled.form`
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


export const ConfirmEmail: React.FC = () => {
    const [email, setEmail] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: ConfirmEmailPayload = {
            email,
            confirmationCode
        };

        try {
            const response = await api.post('/api/auth/confirm-email', payload);
            // handle success
        } catch (error) {
            // handle error
        }
    };

    return (
        <ConfirmEmailForm onSubmit={handleSubmit}>
            <label>
                Email:
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
            </label>
            <label>
                Verification Code:
                <Input type="text" value={confirmationCode} onChange={e => setConfirmationCode(e.target.value)} required/>
            </label>
            <Button type="submit">Confirm Account</Button>
        </ConfirmEmailForm>
    );
};

