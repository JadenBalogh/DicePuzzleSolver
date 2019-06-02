import React from 'react';
import './App.css';
import PuzzleSolver from './PuzzleSolver.js';
import Puzzles from './PuzzleStructures.js';

const EDIT_MODE = 0;
const PRACTICE_MODE = 1;

class PuzzleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: this.props.structures[0],
      layout: new Puzzle(this.props.structures[0]),
      solution: []
    };
    this.solver = new PuzzleSolver();
    this.updateSolution = this.updateSolution.bind(this);
  }

  /*
    OKAY, HERE'S WHAT'S UP:
    The puzzle selector class is going to have 4 buttons for the 4 different puzzle types. This will update the structure of
    the input puzzle. The user will then be able to toggle between "edit" or "practice" mode. 
    
    Edit mode will increase the number of an individual tile with each click, going back to 0 after 
    it reaches 4. This will NOT affect adjacent tiles. 
    
    Practice mode will act as the puzzle normally acts, using the useTile() function to generate 
    the appropriate next puzzle after each press.

    When the user presses the "Solve" button, the current state of the input puzzle is passed into the solver as 
    a layout array. This creates a PuzzleSolution component with the starting state as a prop. A PuzzleSolution ONLY
    handles displaying the steps to the user.

    TBD: How will it know which piece to light up to show the next move? 
  */

  updateLayout(x, y) {
    var result = null;
    if (this.state.editMode === EDIT_MODE) {
      
    } else if (this.state.editMode === PRACTICE_MODE) {

    }

    this.setState({
      layout: result
    });
  }

  updateSolution() {
    this.setState({
      solution: this.solver.solve(
        this.state.structure,
        this.state.layout
      )
    });
  }

  render() {
    return(
      <>
        <div className="selector-container">
          <PuzzleSelectorList structures={this.props.structures} />
          <PuzzleInput 
            structure={this.state.structure}
            clickHandler={this.updateInput}
          />
          <button 
            className="solution-button"
            onClick={this.updateSolution}
          >Solve</button> 
        </div>
        <PuzzleSolution 
          solution={this.state.solution}
        />
      </>
    );
  }
}

function PuzzleInput(props) {
  const createPuzzle = () => {
    var result = [];
    for (var i = 0; i < props.structure.length; i++) {
      var cells = [];
      for (var j = 0; j < props.structure[i].length; j++) {
        if (layout[i][j] === -1) {
          cells.push(
            <td></td>
          );
        } else {
          cells.push(
            <td>
              <button onClick={(i, j) => props.clickHandler(i, j)}>
                <img src={`/icons/dice${layout[i][j]}.png`} alt="dice" />
              </button>
            </td>
          );
        }
      }
      result.push(<tr>{cells}</tr>)
    }
    return result;
  }

  return (
    <div className="selector-puzzle">
      <table>
        {createPuzzle()}
      </table>
    </div>
  );
}

function PuzzleSelectorList(props) {
  const createButtons = () => {
    var result = [];
    for (var i = 0; i < props.structures.length; i++) {
      result.push(
        <img 
          className="selector-button"
          src={`/icons/puzzle${i}.png`}
          alt={`Puzzle ${i}`}
        />
      );
    }
    return result;
  }
  return createButtons();
}

class PuzzleSolution extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="solution-container">
        <PuzzleList 
          solution={this.props.solution}
        />
      </div>
    );
  }
}

function PuzzleList(props) {
  const createPuzzle = (layout) => {
    var result = [];
    for (var i = 0; i < layout.length; i++) {
      var cells = [];
      for (var j = 0; j < layout[i].length; j++) {
        if (layout[i][j] === -1) {
          cells.push(
            <td></td>
          );
        } else {
          cells.push(
            <td>
              <img src={`/icons/dice${layout[i][j]}.png`} alt="dice" />
            </td>
          );
        }
      }
      result.push(<tr>{cells}</tr>);
    }
    return result;
  }

  return props.solution.map(
    layout => <>
      <div className="solution-arrow">
        <img src="/icons/arrow.png" alt="arrow" />
      </div>
      <div className="solution-box">
        <table>
          {createPuzzle(layout)}
        </table>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PuzzleSelector structures={Puzzles} />
      </header>
    </div>
  );
}

export default App;