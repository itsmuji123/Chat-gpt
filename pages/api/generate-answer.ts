import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

type ResponseData = {
	text: string;
};

interface GenerateNextApiRequest extends NextApiRequest {
	body: {
		prompt: string;
	};
}

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export default async function handler(
	req: GenerateNextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	const prompt = req.body.prompt;

	if (!prompt || prompt === '') {
		return new Response('Please send your prompt', { status: 400 });
	}

	// https://beta.openai.com/docs/api-reference/completions/create
	const aiResult = await openai.createCompletion({
		model: 'text-davinci-003',
		prompt: `${prompt}`,
		temperature: 0.9, // Higher values means the model will take more risks.
		max_tokens: 2048, // The maximum number of tokens to generate in the completion.
		frequency_penalty: 0.5, // Number between -2.0 and 2.0.
		presence_penalty: 0 // Number between -2.0 and 2.0.
	});

	const response = aiResult.data.choices[0].text?.trim() || 'Sorry, there was a problem!';
	res.status(200).json({ text: response });
}