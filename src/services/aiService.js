import OpenAI from "openai"

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

// ----------------------
// CLASSIFY LECTURE
// ----------------------
export const classifyLecture = async (text) => {

try {

```
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "You are an Islamic lecture classifier."
    },
    {
      role: "user",
      content: "Classify this Islamic lecture and return topic, language and keywords: " + text
    }
  ]
})

return completion.choices[0].message.content
```

} catch (error) {

```
console.error("AI classify error:", error.message)
return ""
```

}

}

// ----------------------
// SUMMARIZE LECTURE
// ----------------------
export const summarizeLecture = async (text) => {

try {

```
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "Summarize this Islamic lecture in a short paragraph."
    },
    {
      role: "user",
      content: text
    }
  ]
})

return completion.choices[0].message.content
```

} catch (error) {

```
console.error("AI summary error:", error.message)
return ""
```

}

}

// ----------------------
// DETECT QURAN AYAH
// ----------------------
export const detectQuranAyah = async (text) => {

try {

```
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: "Find Quran verses mentioned in this Islamic lecture title."
    },
    {
      role: "user",
      content: text
    }
  ]
})

return completion.choices[0].message.content
```

} catch (error) {

```
console.error("Quran detection error:", error.message)
return []
```

}

}
