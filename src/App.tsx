import { useState } from 'react'
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

enum ButtonType {
  CLEAR,
  OPERATION,
  NUMBER,
  EQUALS
}

const numbers: string[] = [
  '1','2','3','4','5','6','7','8','9','0',
] as const;
const operators: string[] = [
  '+','-','*','/'
] as const;

function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpr] = useState('');
  const [negative, setNegative] = useState(false);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    const element = event.target as HTMLElement;
    let text = element.innerText;
    console.log(expression);

    // Check if text equals '='
    if (text === '=') {
      showResult();
      return;
    }

    // Clears if AC is selected
    if (text === 'AC') {
      setExpr('');
      setDisplay('0');
      return;
    }

    // Swaps 'X' For '*'
    if (text === 'X') {
      text = '*';
    }

    // Special handling for '-'
    if (negative === true) {
      if (operators.includes(text)) {
        const newExpr = expression.split("");
        newExpr[newExpr.length - 1] = text;
        setExpr(newExpr.join(""));
        if (text !== '-') {
          setNegative(false);
        }
        setDisplay(text);
        return;
      } else {
        setNegative(false);
      }
    }
    if (text === '-' && negative === false) {
      setExpr(expression + text);
      setDisplay('-');
      setNegative(true);
    }
    if (text === '-') {
      setDisplay('-');
      return;
    }

    // Checks if the input is an operator
    if (operators.includes(text)) {
      const last = expression[expression.length - 1];
      const secondLast = expression[expression.length - 2];
      console.log(last, secondLast)
      if (operators.includes(last)) {
        const newExpr = expression.split("");
        console.log(negative);
        if (operators.includes(secondLast)) {
          newExpr[expression.length - 1] = '';
          newExpr[expression.length - 2] = text;
        } else {
          newExpr[expression.length - 1] = text;
        }
        setExpr(newExpr.join(""));
        setDisplay(text);
        return;
      }
      setDisplay(text);
      setExpr(expression + text);
      return;
    }

    // Checks if the input is a '.'
    if (text === '.') {
      if (!display.includes('.')) {
        setDisplay(display + text);
        setExpr(expression + text);
      }
      return;
    }

    // Overwites contents if an operator or zero is displayed.
    if (display === '0' || operators.includes(display)) {
      setDisplay(text);
      setExpr(expression + text);
      return;
    }

    // Otherwise add the number
    setDisplay(display + text);
    setExpr(expression + text);
  }

  function showResult() {
    let result;
    console.log("Raw Expression: " + expression);
    const expArray = expression.split("");
    console.log(expArray);

    // Try to fix Expression before parse
    for (let i = 0; i < expression.length - 1; i++) {
      if (
        operators.includes(expArray[i]) && 
        operators.includes(expArray[i+1]) &&
        expArray[i+1] !== '-'
      ) {
        expArray[i] = '';
      }
    }
    console.log(expArray)
    setExpr(expArray.join(""));

    console.log("Final Expression: " + expression);

    try {
      result = eval(expArray.join(""));
    } catch (err) {
      console.log(err);
      result = 'NaN'
    }
    if (result === '') {
      result = 0;
    }
    setDisplay(result);
    setExpr(result);
  }

  return (
    <div id="calculator-container">
      <div id="display">{display}</div>
      <div id="controls">
        <CalcButton id="clear" text="AC" type={ButtonType.CLEAR} click={handleClick} colStart={1} colEnd={2}/>
        <CalcButton id="divide" text="/" type={ButtonType.OPERATION} click={handleClick}  />
        <CalcButton id="multiply" text="X" type={ButtonType.OPERATION} click={handleClick}  />
        <CalcButton id="seven" text="7" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="eight" text="8" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="nine" text="9" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="subtract" text="-" type={ButtonType.OPERATION} click={handleClick}  />
        <CalcButton id="four" text="4" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="five" text="5" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="six" text="6" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="add" text="+" type={ButtonType.OPERATION} click={handleClick}  />
        <CalcButton id="one" text="1" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="two" text="2" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="three" text="3" type={ButtonType.NUMBER} click={handleClick}  />
        <CalcButton id="equals" text="=" type={ButtonType.EQUALS} click={handleClick}  rowStart={4} rowEnd={5} colStart={4} colEnd={4}/>
        <CalcButton id="zero" text="0" type={ButtonType.NUMBER} click={handleClick}  colStart={1} colEnd={2}/>
        <CalcButton id="decimal" text="." type={ButtonType.NUMBER} click={handleClick} />
      </div>
    </div>
  )
}

type CalcButtonProps = {
  id: string,
  text: string,
  click(event: React.MouseEvent<HTMLElement>): void,
  type?: ButtonType,
  rowStart?: number,
  rowEnd?: number,
  colStart?: number,
  colEnd?: number
}
function CalcButton({ id, text, type, click, rowStart, rowEnd, colStart, colEnd }: CalcButtonProps) {
  let buttonType: string = '';
  switch (type) {
    case ButtonType.CLEAR:
      buttonType = 'calc-clear';
      break;
    case ButtonType.OPERATION:
      buttonType = 'calc-operation';
      break;
    case ButtonType.EQUALS:
      buttonType = 'calc-equals';
      break;
    default:
      buttonType = 'calc-number';
  }
  return (
    <div id={id} className={`${buttonType}${rowStart ? " row-start-" + rowStart : ""}${rowEnd ? " row-end-" + rowEnd : ""}${colStart ? " col-start-" + colStart : ""}${colEnd ? " col-end-" + colEnd : ""}`} onClick={click}>
      {text}
    </div>
  );
}

export default App
