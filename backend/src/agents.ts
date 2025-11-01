interface Agent {
id: string;
name: string;
type: string;
ratePerMinute: number;
wallet: string;
executeTask: (payload: any) => Promise<any>;
}

const agents: Agent[] = [
{
id: '1',
name: 'GPT Assistant',
type: 'text',
ratePerMinute: 0.01,
wallet: 'AGENT_WALLET_1',
executeTask: async (payload: any) => { await new Promise(res => setTimeout(res, 1000)); return `GPT processed: ${payload}`; }
},
{
id: '2',
name: 'Drawing Assistant',
type: 'image',
ratePerMinute: 0.02,
wallet: 'AGENT_WALLET_2',
executeTask: async (payload: any) => { await new Promise(res => setTimeout(res, 1500)); return `Drawing generated for: ${payload}`; }
}
];

export async function getAvailableAgents(taskType: string): Promise<Agent> {
const agent = agents.find(a => a.type === taskType);
if (!agent) throw new Error('No agent available for this task type');
return agent;
}
