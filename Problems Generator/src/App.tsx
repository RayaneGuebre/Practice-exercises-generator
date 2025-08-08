import './App.css'
import {useState} from 'react';
import '@mantine/core/styles.css';
import { MantineProvider, createTheme, Title , Input, NativeSelect, Button } from '@mantine/core';
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
  const generateExercise = async () => {
  const generatedOutput =  await fetch('https://ai.hackclub.com/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  // body: '{\n        "messages": [{"role": "user", "content": "Tell me a joke!"}],\n        "model": "openai/gpt-oss-120b"\n    }',
  body: JSON.stringify({
    'messages': [
      {
        'role': 'user',
        'content': `Ur task is to generate an exercise for a student preparing for a test, the test is about ${subjectInput} and the student is ${gradeInput}, i want you to output just the exercise in a latex format`
      }
    ],
    'model': 'openai/gpt-oss-120b'
  })
});

const data = await generatedOutput.json();
let output = data.choices?.[0].message?.content || '';
setLatexOutput(output);
  }


  const [gradeInput, setGradeInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [latexOutput, setLatexOutput] = useState(''); 

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setGradeInput(e.target.value);
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => setSubjectInput(e.target.value);


  return <MantineProvider theme={theme}>{
        <div>
          <Title>Problems Generator</Title>
          <NativeSelect label="Grade" value={gradeInput} onChange={handleGradeChange} description="Which grade are you in?" radius="md" data={['9th grade', '10th grade', '11th grade', "Undergraduate", "Postgraduate"]} />
     <Input size="md" radius="md" value={subjectInput} onChange={handleSubjectChange} placeholder='What are you studying?'></Input>
     </div>}
     <Button onClick={generateExercise}> Generate</Button>
     <BlockMath>{latexOutput}</BlockMath>,
       
    </MantineProvider>;
}