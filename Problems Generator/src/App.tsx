import './App.css'
import {useState} from 'react';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme, Stack, Title, Container, Input, Paper, NativeSelect, Button } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';





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
  setLatexOutput('')

  const generatedOutput =  await fetch('https://ai.hackclub.com/chat/completions', {
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
      Generate a math exercise in KaTeX-compatible LaTeX for a ${gradeInput} student studying ${subjectInput}.

      **Rules:**
      - Output ONLY the LaTeX code. No extra text, explanations, or markdown.
      - Do not use complex environments like \\begin{...} or \\end{...}.
      - Do not wrap the output in \\[...\\] or $$...$$.
      - Use standard commands like \\text{}, \\frac{}, \\sqrt{}, etc.
      - Don't use \cdot
      - It needs to be original 
      **Example of a good response:**
      \\text{Solve for } x: \\quad 5x - 3 = 2(2x + 1) - 4.
    `
      }
    ],
    'model': 'openai/gpt-oss-120b'
  })
});

const data = await generatedOutput.json();
let output = data.choices?.[0].message?.content || '';
output = output
setLoading(false);
setLatexOutput(output);
  }


  

  

  return (<MantineProvider theme={theme}>

          <Container size='sm' py={'xl'}>
          <Stack
      bg="var(--mantine-color-body)"
      gap="lg"
    >
          <Title>Problems Generator</Title>
          <NativeSelect label="Grade" value={gradeInput} onChange={handleGradeChange} description="Which grade are you in?" radius="md" data={['9th grade', '10th grade', '11th grade', "Undergraduate", "Postgraduate"]} />
     <Input size="md" radius="md" value={subjectInput} onChange={handleSubjectChange} placeholder='What are you studying?'></Input>
    
     <Button loading={loading} onClick={generateExercise}  size="md" style={{
      minHeight: '80px',
      width: '100%'
     }}> Generate</Button>

     <Paper shadow="md"  radius="lg" withBorder p="lg" style={{
      width:'100%',
      maxWidth: 500,
      wordBreak: 'break-word',
      overflowX: 'auto',
      minHeight: '80px',
      whiteSpace: 'pre-wrap',
      boxSizing: 'border-box'
     }}>
      <BlockMath>{latexOutput}</BlockMath>
     </Paper>
    
     </Stack></Container>
    </MantineProvider>);
}