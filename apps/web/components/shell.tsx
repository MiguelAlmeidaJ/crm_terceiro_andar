'use client';
import {useEffect,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import Link from 'next/link';
import {LayoutDashboard,Users,KanbanSquare,CheckSquare,LogOut,Layers3} from 'lucide-react';
import {api,User} from '@/lib/api';
const nav=[{href:'/',label:'Visão geral',icon:LayoutDashboard},{href:'/clientes',label:'Clientes',icon:Users},{href:'/comercial',label:'Comercial',icon:KanbanSquare},{href:'/tarefas',label:'Tarefas',icon:CheckSquare}];
export default function Shell({children}:{children:React.ReactNode}){const [user,setUser]=useState<User|null>(null);const [loading,setLoading]=useState(true);const router=useRouter(),path=usePathname();
useEffect(()=>{if(path==='/login'){setLoading(false);return;}api<User>('/auth/me').then(setUser).catch(()=>router.replace('/login')).finally(()=>setLoading(false));},[path,router]);
if(path==='/login')return <>{children}</>;
if(loading)return <div className="centered">Carregando CRM...</div>;
if(!user)return null;
return <div className="layout"><aside className="sidebar"><div className="brand"><span className="brand-icon"><Layers3 size={22}/></span><div>TERCEIRO <strong>ANDAR</strong><small>CRM · Gestão integrada</small></div></div><p className="nav-caption">ESPAÇO DE TRABALHO</p><nav>{nav.map(item=><Link className={'navlink '+(path===item.href?'selected':'')} key={item.href} href={item.href}><item.icon size={18}/>{item.label}</Link>)}</nav><div className="sidebar-footer"><div className="avatar">{user.name.charAt(0).toUpperCase()}</div><div className="user-info"><strong>{user.name}</strong><small>{user.role}</small></div><button title="Sair" className="icon-btn" onClick={async()=>{await api('/auth/logout',{method:'POST'});router.replace('/login')}}><LogOut size={17}/></button></div></aside><main className="content">{children}</main></div>;
}
