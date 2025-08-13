import './App.css'

import '@mantine/core/styles.css';
import { MantineProvider, createTheme,  Card, Stack, Title, Container, Input, NativeSelect, Button } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';
import { useState } from 'react';



import { MathJaxContext, MathJax } from 'better-react-mathjax'; 





const myColor: MantineColorsTuple = [
  '#effde7',
  '#e1f8d4',
  '#c3efab',
  '#a2e67e',
  '#87de58',
  '#75d93f',
  '#6bd731',
  '#59be23',
  '#4da91b',
  '#3d920d'
];


const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"]
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"]
    ]
  }
};


const theme = createTheme({
  colors: {
    myColor,
  }
});

export default function App() {

  const [gradeInput, setGradeInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [latexOutput, setLatexOutput] = useState(''); 
  const [loading, setLoading] = useState(false);


  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setGradeInput(e.target.value);
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => setSubjectInput(e.target.value);

  const generateExercise = async () => {
  setLoading(true);
  setLatexOutput('');
  const generatedOutput =  await fetch('https://ai.hackclub.com/chat/completions?t=${Date.now()}', {
  method: 'POST',
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json'
  },
  // body: '{\n        "messages": [{"role": "user", "content": "Tell me a joke!"}],\n        "model": "openai/gpt-oss-120b"\n    }',
  body: JSON.stringify({
    'messages': [
      {
        'role': 'user',
        'content': `
      Generate a math exercise in MathJax-compatible LaTeX for a ${gradeInput} student studying ${subjectInput}.

      **Rules:**
      - Output ONLY the LaTeX code. No extra text, explanations, or markdown.
      - Do not use complex environments like \\begin{...} or \\end{...}.
      - Use standard commands like \\text{}, \\frac{}, \\sqrt{}, etc.
      - specify the task
      - You must generate it, and you must not take it from anywhere 
      - it needs to be different from ${latexOutput}
      - ** You must make new lines to make the text fit into an 800px container **
      - It needs to be original 
      - Use "\\[", "\\]" or "$$ $$"
      - It needs to be compatible with MathJax
      **Example of a good response:**
     \\[\\sum_{n = 100}^{1000}\\left(\\frac{10\\sqrt{n}}{n}\\right)\\]
    `
      }
    ],
    'model': 'openai/gpt-oss-120b',
    'temperature': 1.5

  })
});
let output = ''
if (subjectInput){
const data = await generatedOutput.json();
 output = data.choices?.[0].message?.content || '';
} else{
   output = 'Error: Please Insert a subject';
  
}
setLoading(false);
setLatexOutput(output);

  }


  

  

  return ( <MathJaxContext version={3} config={config}><MantineProvider theme={theme}>
<Stack gap="xl" 
>
          <Title>Problems Generator</Title>
          <Container  style={{
            justifyContent: 'center',
            width: '300px',
          }}>
          <NativeSelect label="Grade" value={gradeInput} onChange={handleGradeChange} description="Which grade are you in?" radius="md" data={['9th grade', '10th grade', '11th grade', "Undergraduate", "Postgraduate"]}
          style={{marginBottom: '10px'}} />
      
     <Input size="md" width='md' style={{
marginBottom: '10px', }} radius="md" value={subjectInput} onChange={handleSubjectChange} placeholder='What are you studying?'></Input>

     <Button loading={loading} onClick={generateExercise}  size="lg" radius="lg" >
       Generate</Button>
</Container>

     <Card shadow="md"  radius="lg" withBorder p="lg" style={{
      maxWidth: '900px',
  overflowWrap: 'break-word',
  overflowX: 'auto',
  textAlign: 'center',
      minHeight: '80px',
      alignItems: 'center',
      justifyContent: 'center',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
      boxSizing: 'border-box'
     }}>
      <MathJax dynamic>{latexOutput}</MathJax>
     </Card>

    
 </Stack>   
    </MantineProvider></MathJaxContext>);
}
