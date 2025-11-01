import { useEffect, useState } from 'react';
import WalletConnector from '../components/WalletConnector';
import AgentCard from '../components/AgentCard';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
interface Agent { id: string; name: string; type: string; rate: number; }
export default function Home() {
const [agents, setAgents] = useState<Agent[]>([]);
const { publicKey } = useWallet();
useEffect(() => { setAgents([{ id: '1', name: 'GPT Assistant', type: 'text', rate: 0.01 }, { id: '2', name: 'Drawing Assistant', type: 'image', rate: 0.02 }]); }, []);
const requestTask = async (agentId: string) => {
if (!publicKey) return alert('Please connect wallet first!');
const taskPayload = prompt('Enter task content:');
if (!taskPayload) return;
try {
const res = await axios.post('[http://localhost:5000/api/request-task](http://localhost:5000/api/request-task)', { userWallet: publicKey.toBase58(), taskType: agents.find(a => a.id === agentId)?.type, taskPayload });
alert();
} catch (err) { console.error(err); alert('Task request failed'); }
};
return (<div className="p-8"><WalletConnector /><h1 className="text-3xl font-bold my-4">AgentHub Marketplace</h1>{agents.map(agent => (<AgentCard key={agent.id} {...agent} onRequestTask={requestTask} />))}</div>);
}
