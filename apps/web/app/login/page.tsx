'use client';
import {FormEvent,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Layers3} from 'lucide-react';
import {api} from '@/lib/api';
export default function Login(){const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);const router=useRouter();
async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError('');try{await api('/auth/login',{method:'POST',body:JSON.stringify({email,password})});router.replace('/');}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
return <div className="login-background"><form className="login-card" onSubmit={submit}><div className="login-logo"><Layers3 size={26}/></div><p className="eyebrow">AGÊNCIA TERCEIRO ANDAR</p><h1>Bem-vindo de volta.</h1><p className="muted">Entre para acompanhar sua operação.</p><label>E-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@agencia.com.br"/></label><label>Senha<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="error">{error}</p>}<button className="primary full" disabled={busy}>{busy?'Entrando...':'Entrar no CRM'}</button></form></div>;
}
