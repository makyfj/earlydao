const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(req, res) {
  let prompt = `Create a reflective essay about the following health data and give recommendations on how to improve going forward.
  \n\Data: ${req.body.search}:\n`

  const openai = new OpenAIApi(configuration)

  const response = await openai.createCompletion({
    model: 'text-ada-001',
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })

  res.status(200).json({ data: `${response.data.choices[0].text}` })
}
