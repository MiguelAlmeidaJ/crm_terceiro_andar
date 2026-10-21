export const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3446';
export async function api<T>(path:string,options:RequestInit={}):Promise<T>{
 const response=await fetch(`${API}/api${path}`,{...options,credentials:'include',headers:{'Content-Type':'application/json',...options.headers},cache:'no-store'});
 if(!response.ok){let message='Falha na solicitação';try{const error=await response.json();message=Array.isArray(error.message)?error.message.join('; '):(error.message||message);}catch{} throw new Error(message);}
 return response.json() as Promise<T>;
}
export type User={id:string;name:string;email:string;role:string};
export type Client={id:string;name:string;company?:string|null;email?:string|null;phone?:string|null;notes?:string|null;stage:string;value?:string|null};
export type Task={id:string;title:string;description?:string|null;status:string;priority:string;dueDate?:string|null;client?:{id:string;name:string}|null};
export const stages:Record<string,string>={LEAD:'Novo lead',CONTACTED:'Contato',PROPOSAL:'Proposta',NEGOTIATION:'Negociação',WON:'Ganho',LOST:'Perdido'};
export const statuses:Record<string,string>={TODO:'A fazer',IN_PROGRESS:'Em execução',WAITING:'Aguardando',DONE:'Concluída'};
