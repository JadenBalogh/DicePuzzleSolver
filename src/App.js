import React from 'react';
import './App.css';
import PuzzleSolver from './PuzzleSolver.js';
import Puzzle from './Puzzle.js';
import Puzzles from './PuzzleStructures.js';

const EDIT_MODE = 0;
const PRACTICE_MODE = 1;

class PuzzleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: this.props.structures[0],
      puzzle: new Puzzle(this.props.structures[0]),
      editMode: 0,
      solution: []
    };
    this.solver = new PuzzleSolver();
    this.updateStructure = this.updateStructure.bind(this);
    this.updateLayout =  this.updateLayout.bind(this);
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

  // CURRENT STRUGGLE: how to deal with updating the structure of the puzzle input while still using the layout to update it as well...
  // SOLUTION: just update the layout in updateStructure you dummy! do that next. set the layout to the structure in updateStructure.
  // now to figure out how to give those buttons active states...

  updateStructure(e) {
    var i = e.currentTarget.getAttribute('structureIndex');
    this.setState({
      structure: this.props.structures[i]
    });
  }

  updateLayout(e) {
    var row = e.currentTarget.getAttribute('row');
    var col = e.currentTarget.getAttribute('col');
    var result = null;
    if (this.state.editMode === EDIT_MODE) {
      result = this.solver.editTile(this.state.puzzle, row, col);
    } else if (this.state.editMode === PRACTICE_MODE) {
      result = this.solver.useTile(this.state.puzzle, row, col);
    }

    this.setState({
      puzzle: result
    });
  }

  updateSolution() {
    this.setState({
      solution: this.solver.solve(
        this.state.structure,
        this.state.puzzle
      )
    });
  }

  render() {
    return(
      <>
        <div className="selector-container">
          <PuzzleSelectorList 
            structures={this.props.structures} 
            clickHandler={this.updateStructure}
          />
          <PuzzleInput 
            layout={this.state.puzzle.layout}
            clickHandler={this.updateLayout}
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
    for (var i = 0; i < props.layout.length; i++) {
      var cells = [];
      for (var j = 0; j < props.layout[i].length; j++) {
        if (props.layout[i][j] === -1) {
          cells.push(
            <td>
              <div className="selector-puzzle-empty" />
            </td>
          );
        } else {
          cells.push(
            <td>
              <button 
                row={i} 
                col={j} 
                className="selector-puzzle-tile" 
                onClick={(e) => props.clickHandler(e)}
              >
                <img 
                  src={`/icons/dice${props.layout[i][j]}.png`} 
                  alt="dice" 
                />
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
        <button
          structureIndex={i}
          className={`selector-button ${props.structures[i] === props.structure ? "active" : ""}`}
          onClick={(e) => props.clickHandler(e)}
        >
          <img 
            src={`/icons/puzzle${i}.png`}
            alt={`Puzzle ${i}`}
          />
        </button>
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