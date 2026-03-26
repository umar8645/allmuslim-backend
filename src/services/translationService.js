import OpenAI from "openai"

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
})

export const translateLecture = async (text,lang)=>{

const completion = await openai.chat.completions.create({
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:"Translate Islamic lecture text"
},
{
role:"user",
content:`Translate this into ${lang}: ${text}`
}
]
})

return completion.choices[0].message.content

}