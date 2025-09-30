import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TwoFactorTokenEmailProps {
  token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const TwoFactorTokenEmail = ({ token }: TwoFactorTokenEmailProps) => (
  <Html>
    <Head />
    <Preview>Tu código de verificación</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/images/brand/brand-01.svg`}
          width="170"
          height="50"
          alt="Saber 11"
          style={logo}
        />
        <Heading style={h1}>Tu código de verificación</Heading>
        <Text style={text}>
          Usa el siguiente código para completar el proceso de autenticación de dos
          factores.
        </Text>
        <Section style={codeBox}>
          <Text style={code}>{token}</Text>
        </Section>
        <Text style={text}>
          Si no solicitaste este código, puedes ignorar este correo electrónico de
          forma segura.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TwoFactorTokenEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "14px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginRight: "50px",
  marginLeft: "50px",
  marginBottom: "24px",
  padding: "40px 10px",
};

const code = {
  color: "#333",
  fontSize: "30px",
  fontWeight: "bold",
  textAlign: "center" as const,
};
