const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  const openai = new OpenAIApi(configuration)

  const response = await openai.createCompletion({
    model: 'text-ada-001',
    prompt: req.body.prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  res.status(200).json({ data: `${response.data.choices[0].text}` })
}
