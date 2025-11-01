interface AgentCardProps { id: string; name: string; type: string; rate: number; onRequestTask: (id: string) => void; }
export default function AgentCard({ id, name, type, rate, onRequestTask }: AgentCardProps) {
return (<div className="border p-4 rounded shadow-md mb-4"> <h2 className="text-xl font-bold">{name}</h2> <p>Type: {type}</p> <p>Rate: {rate} SOL/min</p>
<button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={() => onRequestTask(id)}>Request Task</button>

  </div>);
}
