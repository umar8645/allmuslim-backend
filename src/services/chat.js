import OpenAI from "openai"

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
})

export const islamicChat = async (req,res)=>{

const {message} = req.body

const completion = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages:[
{
role:"system",
content:"You are an Islamic assistant that answers using Quran and Hadith."
},
{
role:"user",
content:message
}

]

})

res.json({
reply:completion.choices[0].message.content
})

}