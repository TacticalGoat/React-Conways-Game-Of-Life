import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
            height: this.props.rows * 12,
            width: this.props.cols * 12,
            board: board,
        }
    }

    componentDidMount() {
        this.drawCanvas();
    }

    drawCanvas() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,this.state.width,this.state.height);
        ctx.lineWidth = 2;
        ctx.lineCap = 'square';
        ctx.strokeStyle = '#c0c0c0';
        ctx.fillStyle = '#000';
        for(let row = 0; row < this.props.rows; row++) {
            for(let col = 0; col < this.props.cols; col++) {
                let y = row * 12 + 2;
                let x = col * 12 + 2;
                let alive = this.state.board[row][col];
                ctx.beginPath();
                ctx.rect(x, y, 9, 9);
                if(alive === true)
                    ctx.fill();
                ctx.stroke();
            }
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
        );
        this.drawCanvas();
    }

    start(){
        this.intervalID = setInterval(() => this.getNextState(), 100);
    }

    stop(){
        clearInterval(this.intervalID);
    }

    handleClick(e) {
        console.log("CLICK");
        const rect = ReactDOM.findDOMNode(this.refs.canvas).getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let row = Math.floor(y / 12);
        let col = Math.floor(x / 12);
        const board = this.state.board.slice();
        board[row][col] = !board[row][col];
        this.setState({
            board: board,
        });
        this.drawCanvas();
    }
    

    render(){
        return(
        <div>
            <div>
                <canvas ref="canvas" width={this.state.width} height={this.state.height} onClick={this.handleClick.bind(this)} />
            </div>
            <button onClick={() => this.getNextState()}> Next </button>
            <button onClick={() => this.start()}> Start </button>
            <button onClick={() => this.stop()}> Stop </button>
        </div>
        );
    }
}

ReactDOM.render(
    <Game rows="48" cols="100" />,
    document.getElementById('root')
);