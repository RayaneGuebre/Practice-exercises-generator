import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider, createTheme, Title , Input, NativeSelect } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

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
  return <MantineProvider theme={theme}>{
        <div>
          <Title>Problems Generator</Title>
          <NativeSelect label="Grade" description="Which grade are you in?" radius="md" data={['9th grade', '10th grade', '11th grade', "Undergraduate", "Postgraduate"]} />
     <Input size="md" radius="md" placeholder='What are you studying?'></Input>
     </div>}
    </MantineProvider>;
}