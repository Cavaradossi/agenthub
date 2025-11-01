import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function recordTask(task: {
    user: string;
    agent: string;
    durationMinutes: number;
    paymentTx: string;
    success: boolean;
}) {
    await prisma.task.create({
        data: {
            user: task.user,
            agent: task.agent,
            durationMinutes: task.durationMinutes,
            paymentTx: task.paymentTx,
            success: task.success
        }
    });
}
