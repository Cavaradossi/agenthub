import express from 'express';
import { x402Pay } from './x402';
import { getAvailableAgents } from './agents';
import { recordTask } from './ledger';

const router = express.Router();

router.post('/request-task', async (req, res) => {
  try {
    const { userWallet, taskType, taskPayload } = req.body;

    const agent = await getAvailableAgents(taskType);

    const startTime = Date.now();
    const taskResult = await agent.executeTask(taskPayload);
    const endTime = Date.now();

    const durationMinutes = (endTime - startTime) / 60000;
    const paymentAmount = durationMinutes * agent.ratePerMinute;

    const paymentTx = await x402Pay(userWallet, agent.wallet, paymentAmount);

    await recordTask({
      user: userWallet,
      agent: agent.id,
      durationMinutes,
      paymentTx,
      success: true
    });

    res.json({ taskResult, paymentTx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Task request failed' });
  }
});

export default router;
