import './globals.css';
import Shell from '@/components/shell';
export const metadata={title:'Terceiro Andar · CRM',description:'CRM da Agência Terceiro Andar'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><Shell>{children}</Shell></body></html>}
