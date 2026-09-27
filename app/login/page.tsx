// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./styles.module.css";
import { EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import gitHubIcon from "../../components/assets/GitHub_Invertocat_White.png"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Credenciais inválidas");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className={styles.authPage}>
        <Link href="/"className={styles.logo}>
          Film{"{IN}"}hos
        </Link>
        <div className={styles.authContainer}>
          <h1 className={styles.loginTitle}>Login</h1>
          <div className={styles.loginLink}>
            <h3>Não possui uma conta? </h3>
            <Link href="/cadastro">Cadastre-se</Link>
          </div>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputContainer}>
              <label htmlFor="email">Email</label>
              <input
                className={styles.authInput}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xxxx@gmail.com"
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="password">Senha</label>
              <input
                className={styles.authInput}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
              />

              <EyeOff className="w-5 h-5 text-gray-500 cursor-pointer absolute self-end my-8 mx-4" />
            </div>
            <div className={styles.loginOptions}>
              <div className={styles.loginCheckbox}>
                <input type="checkbox" />
                <span>Mantenha-me conectado</span>
              </div>
              <a href="#">Esqueceu a senha?</a>
            </div>

            <button className={styles.formButton} type="submit">
              Log In
            </button>
          </form>
          <div className="mt-4">
            <button onClick={() => signIn("github", { callbackUrl: "/" })} className="flex items-center gap-4 p-4 bg-[#1B559D] text-white rounded-[.625rem]">
                <Image src={gitHubIcon} alt="logoIn" className="h-8 w-auto" />
                <span>Login Github</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}