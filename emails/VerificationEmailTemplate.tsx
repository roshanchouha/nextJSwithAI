// components/EmailTemplate.tsx
import React from 'react';
import { Html, Head, Body, Container, Heading, Text } from '@react-email/components';

interface EmailTemplateProps {
  otp: string;
  username: string;
}

const VerificationEmailTemplate: React.FC<EmailTemplateProps> = ({ username, otp }) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', margin: 0, padding: 0 }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff' }}>
        <Heading style={{ textAlign: 'center', color: '#333' }}>Verify Your Email</Heading>
        <Text>Hi,</Text>
        <Text>
          Please use the OTP below to verify your username: <strong>{username}</strong>
        </Text>
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          {otp}
        </Text>
        <Text>If you didn’t request this, you can safely ignore this username.</Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmailTemplate;
