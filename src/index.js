import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Cell(props) {
    return(
        <button className = {props.className}  onClick={props.onClick}/>
    );
}

class Board extends React.Component {
    render(){
        let rows = Array(parseInt(this.props.rows)).fill(true);
        let cols = Array(parseInt(this.props.cols)).fill(true);
        return(
            <ul className="board">
                {
                    rows.map((step1, elem1) => {
                        return(
                            <li className="board-row">
                                <ul>
                                {
                                    cols.map((step2, elem2) => {
                                    return(
                                    <li><Cell className= {this.props.board[elem1][elem2] === true? "cell alive":"cell dead"} onClick={() => this.props.onClick(elem1, elem2)}/></li>);
                                    })
                                }
                                </ul>
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}

class Game extends React.Component {

    constructor(props){
        super(props);
        console.log(this.props);
        let board = []
        
        for(let i = 0; i < parseInt(props.rows); i++) {
            let temp = Array(parseInt(props.cols)).fill(false);
            board.push(temp);
        }
        this.intervalID = null;
        this.state = {
            board: board,
        }
    }



    getAliveNeighbours(row, col){
        let rops = [1, 1, -1, -1, 0, 0, 1, -1];
        let cops = [1, -1, 1, -1, 1, -1, 0, 0];
        let count = 0;
        for(let i = 0; i < 8; i++) {
            let nRow = row + rops[i];
            let nCol = col + cops[i];
            if(nRow > -1 && nRow < this.props.rows && nCol > -1 && nCol < this.props.cols) {
                if(this.state.board[nRow][nCol] === true)
                    count++;
            }
        }

        return count;
    }

    getNextStateForCell(row, col){
        let noAlive = this.getAliveNeighbours(row, col);
        const board = this.state.board;
        let cellAlive = board[row][col]
        if(noAlive < 2)
            return false;
        if(noAlive > 3)
            return false;
        if(noAlive === 3 && !cellAlive)
            return true
       
        return cellAlive
    }

    getNextState(){
        let nState = []
        for(let row = 0; row < this.props.rows; row++)
        {
            let rowArr = []
            for(let col = 0; col < this.props.cols; col++)
            {
                rowArr.push(this.getNextStateForCell(row, col));
            }
            nState.push(rowArr);
        }

        this.setState(
            {
                board: nState,
            }
        )
    }

    start(){
        this.intervalID = setInterval(() => this.getNextState(), 150);
    }

    stop(){
        clearInterval(this.intervalID);
    }

    handleClick(row, col) {
        row = parseInt(row)
        col = parseInt(col)
        const board = this.state.board.slice();
        let stat = this.state.board[row][col];
        board[row][col] = board[row][col]? false : true;
        this.setState({
            board: board,
        });
    }

    render(){
        return(<div>
               <Board board={this.state.board} rows={this.props.rows} cols={this.props.cols} onClick={(row,col) => this.handleClick(row, col)}/>
               <button onClick={() => this.getNextState()}> Next </button>
               <button onClick={() => this.start()}> Start </button>
               <button onClick={() => this.stop()}> Stop </button>
               </div>);
    }
}

ReactDOM.render(
    <Game rows="30" cols="60" />,
    document.getElementById('root')
);