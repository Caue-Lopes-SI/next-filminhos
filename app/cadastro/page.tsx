"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import styles from "../login/styles.module.css";

export default function Cadastro() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch("https://tarefaapi.onrender.com/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, passwordConfirmation }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.errors && json.errors.length > 0) {
          setErrorMsg(json.errors[0].message);
        } else {
          setErrorMsg("Erro ao criar conta.");
        }
        return;
      }

      // Se deu sucesso no cadastro, faz o login logo em seguida
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        setErrorMsg("Conta criada, mas houve um erro ao entrar automaticamente.");
      } else {
        router.push("/");
      }
    } catch (err) {
      setErrorMsg("Erro de conexão.");
    }
  };

  return (
    <div className={styles.authPage}>
        <Link href="/"className={styles.logo}>
          Film{"{IN}"}hos
        </Link>
      <div className={styles.authRegister}>
        <h1 className={styles.authTitle}>Cadastro</h1>
        <div className={styles.registerLink}>
          <h3>Já possui uma conta? </h3>
          <Link href="/login">Entre</Link>
        </div>
        
        {errorMsg && <p className="text-red-500 mb-4 text-sm font-medium">{errorMsg}</p>}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputContainer}>
            <label htmlFor="fullName">Nome Completo</label>
            <input
              className={styles.authInput}
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu Nome"
              required
            />
          </div>
          
          <div className={styles.inputContainer}>
            <label htmlFor="email">Email</label>
            <input
              className={styles.authInput}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="xxxx@gmail.com"
              required
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
              placeholder="••••••••"
              required
            />
            <EyeOff className="w-5 h-5 text-gray-500 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 mt-2" />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="passwordConfirmation">Confirmar Senha</label>
            <input
              className={styles.authInput}
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              required
            />
            <EyeOff className="w-5 h-5 text-gray-500 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 mt-2" />
          </div>

          <button className={styles.formButton} type="submit" style={{ marginTop: "1rem" }}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
