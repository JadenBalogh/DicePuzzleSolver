import React from 'react';
import './App.css';
import PuzzleSolver from './PuzzleSolver.js';
import Puzzle from './Puzzle.js';
import Structures from './PuzzleStructures.js';
import { Priorities, AltPriorities } from './PuzzlePriorities.js';

const EDIT_MODE = 0;
const PRACTICE_MODE = 1;

class PuzzleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      structure: this.props.structures[0].map(row => row.slice()),
      puzzle: new Puzzle(this.props.structures[0].map(row => row.slice())),
      useAltPriority: false,
      priority: this.props.priorities[0].map(row => row.slice()),
      altPriority: this.props.altPriorities[0].map(row => row.slice()),
      editMode: 0,
      valid: true,
      solution: [],
      noSolutions: false
    };
    this.solver = new PuzzleSolver(false);
    this.swapPriority = this.swapPriority.bind(this);
    this.resetPuzzle = this.resetPuzzle.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.setPracticeMode = this.setPracticeMode.bind(this);
    this.updateStructure = this.updateStructure.bind(this);
    this.updatePuzzle =  this.updatePuzzle.bind(this);
    this.updateSolution = this.updateSolution.bind(this);
    this.redoSolution = this.redoSolution.bind(this);
  }

  swapPriority(e) {
    var result = e.currentTarget.checked;
    this.setState(
      { useAltPriority: result },
      this.redoSolution
    );
  }
  
  resetPuzzle() {
    this.setState({
      puzzle: new Puzzle(this.state.structure),
      valid: true,
      solution: [],
      noSolutions: false
    });
  }

  setEditMode() {
    this.setState({
      editMode: EDIT_MODE
    })
  }

  setPracticeMode() {
    this.setState({
      editMode: PRACTICE_MODE
    })
  }

  updateStructure(e) {
    var i = e.currentTarget.getAttribute('structureIndex');
    this.setState({
      structure: this.props.structures[i].map(row => row.slice()),
      puzzle: new Puzzle(this.props.structures[i].map(row => row.slice())),
      priority: this.props.priorities[i].map(row => row.slice()),
      altPriority: this.props.altPriorities[i].map(row => row.slice()),
      valid: true,
      solution: [],
      noSolutions: false
    });
  }

  updatePuzzle(e) {
    var row = Number(e.currentTarget.getAttribute('row'));
    var col = Number(e.currentTarget.getAttribute('col'));
    var result = null;
    if (this.state.editMode === EDIT_MODE) {
      result = this.solver.editTile(this.state.puzzle, row, col);
    } else if (this.state.editMode === PRACTICE_MODE) {
      var priority = this.state.useAltPriority ? 
        this.state.altPriority : this.state.priority;
      result = this.solver.useTile(this.state.puzzle, row, col, priority);
    }

    this.setState({
      puzzle: result,
      valid: this.solver.isPuzzleValid(this.state.structure, result.layout),
      solution: [],
      noSolutions: false
    });
  }

  updateSolution() {
    if (this.state.puzzle.equals(new Puzzle(this.state.structure))) {
      return;
    }
    var priority = this.state.useAltPriority ? 
      this.state.altPriority : this.state.priority;
    var result = this.solver.solve(
      this.state.structure,
      this.state.puzzle.layout,
      priority
    );
    this.setState({
      solution: result,
      noSolutions: result.length === 0
    });
  }

  redoSolution() {
    if (this.state.solution.length !== 0) {
      this.updateSolution();
    }
  }

  render() {
    return(
      <>
        <div className="selector-container">
          <div className="menu-container">
            <div className="title-container">
              <p className="title">
                <u>Puzzle Type</u>
              </p>
            </div>
            <div className="menu-item-container">
              <PuzzleTypeList 
                structures={this.props.structures} 
                clickHandler={this.updateStructure}
              />
            </div>
          </div>
          <div className="input-container">
            <div className="input-puzzle-container">
              <PuzzleInput 
                layout={this.state.puzzle.layout}
                clickHandler={this.updatePuzzle}
              />
            </div>
            <div className="input-text-container">
              <p className={`input-text ${!this.state.valid ? "active" : ""}`}>
                Puzzle state is invalid!
              </p>
            </div>
            <div className="input-checkbox-container">
              <input
                className="input-checkbox"
                type="checkbox"
                checked={this.state.useAltPriority}
                onChange={this.swapPriority}
              />
              <p className="input-checkbox-text">
                Use alternate tile priority
              </p>
            </div>
          </div>
          <div className="menu-container">
            <div className="title-container">
              <p className="title">
                <u>Mode</u>
              </p>
            </div>
            <div className="menu-button-container">
              <button 
                className={`menu-button ${this.state.editMode === EDIT_MODE ? "active" : ""}`}
                onClick={this.setEditMode}
              >Edit</button>
              <button 
                className={`menu-button ${this.state.editMode === PRACTICE_MODE ? "active" : ""}`}
                onClick={this.setPracticeMode}
              >Practice</button>
            </div>
            <div className="title-container">
              <p className="title">
                <u>Options</u>
              </p>
            </div>
            <div className="menu-button-container">
              <button 
                className="menu-button"
                onClick={this.resetPuzzle}
              >Reset</button> 
              <button 
                className="menu-button"
                onClick={this.updateSolution}
              >Solve</button> 
            </div>
          </div>
        </div>
        <div className="solution-container">
          <h2 className={`solution-text ${this.state.noSolutions ? "active" : ""}`}>
            No Solutions!
          </h2>
          <PuzzleList 
            layout={this.state.puzzle.layout}
            solution={this.state.solution}
          />
        </div>
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
              <div className="input-puzzle-tile-empty" />
            </td>
          );
        } else {
          cells.push(
            <td>
              <button 
                row={i} 
                col={j} 
                className="input-puzzle-tile" 
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
    <div className="input-puzzle">
      <table>
        {createPuzzle()}
      </table>
    </div>
  );
}

function PuzzleTypeList(props) {
  const createButtons = () => {
    var result = [];
    for (var i = 0; i < props.structures.length; i++) {
      var img = {
        backgroundImage: `url(/icons/puzzle${i}.png)`
      };
      result.push(
        <div className="menu-item">
          <button
            style={img}
            structureIndex={i}
            className={`puzzle-type-button`}
            onClick={(e) => props.clickHandler(e)}
          />
        </div>
      );
    }
    return result;
  }
  return createButtons();
}

function PuzzleList(props) {
  var prev = props.layout;

  const createPuzzle = (layout) => {
    var result = [];
    for (var i = 0; i < layout.length; i++) {
      var cells = [];
      for (var j = 0; j < layout[i].length; j++) {
        if (layout[i][j] === -1) {
          cells.push(
            <td>
              <div className="puzzle-solution-tile-empty" />
            </td>
          );
        } else {
          cells.push(
            <td className={(layout[i][j] > prev[i][j]) ? "highlighted" : ""}>
              <img 
                className="puzzle-solution-tile"
                src={`/icons/dice${layout[i][j]}.png`} 
                alt="dice" 
              />
            </td>
          );
        }
      }
      result.push(<tr>{cells}</tr>);
    }
    prev = layout;
    return result;
  }

  return props.solution.map(
    layout => <>
      <div className="solution-arrow">
        <img src="/icons/arrow.png" alt="arrow" />
      </div>
      <div className="solution-puzzle">
        <table>
          {createPuzzle(layout)}
        </table>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>DDO "Smash and Burn" Dice Puzzle Solver</h1>
      </header>
      <div className="app-body"> 
        <PuzzleSelector 
          structures={Structures} 
          priorities={Priorities}
          altPriorities={AltPriorities}
        />
      </div>
      <footer className="app-footer">
        <p>Made by Furyflash of Thelanis (Dungeons and Dragons Online). Note: All solutions assume facing East in-game.</p>
      </footer>
    </div>
  );
}

export default App;