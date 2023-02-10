import './App.css';
import { Home } from './view/Home';
import styled from '@emotion/styled';

function App() {
  return (
    <CenterDiv>
      <Home />
    </CenterDiv>
    
  );
}

const CenterDiv = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`

export default App;
