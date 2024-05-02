import OpenAI from 'openai';
import rootLogger from './logger';

const logger = rootLogger.child({ 'module': 'openai' }, { 'level': 'debug', })

export const openai = new OpenAI({
    fetch: async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
        const response = await fetch(url, init);
        logger.debug({ url, init, response }, 'openai fetch')
        return response;
    },
});