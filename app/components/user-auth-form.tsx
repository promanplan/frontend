"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  mode: "login" | "register";
}

export function UserAuthForm({ className, mode, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const url = `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/users/${mode}`;
      
      let res;
      if (mode === "login") {
        // Send login data as form-data
        const formData = new FormData();
        formData.append("username", name);
        formData.append("password", password);
        
        res = await fetch(url, {
          method: "POST",
          body: formData,
        });
      } else {
        // Send register data as JSON
        const body = { name, password, email };
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      if (mode === "login") {
        localStorage.setItem("access_token", data.access_token);
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("grid gap-6", className)} onSubmit={handleSubmit} {...props}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="input"
      />
      {mode === "register" && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="input"
        />
      )}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="input"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : mode === "login" ? "Login" : "Register"}
      </Button>
    </form>
  );
}
