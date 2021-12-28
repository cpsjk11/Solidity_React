import React, { Component } from 'react';
import './App.css';
import './index.css';
import Web3 from 'web3';

/*
  리엑트 내부에서 배포한 스마트 컨트랙의 주소와 ABI를 알아내서
  직접 함수들을 호출해야 하기 때문에 아래의 두개의 변수를 만들었다.
*/
let lotteryaddress = '0x8d75Ae79D6Abd6dd00BC97Db6E95bCeE367D7b03';
let lotteryABI = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "index", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "bettor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "indexed": false, "internalType": "bytes1", "name": "answer", "type": "bytes1" }, { "indexed": false, "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event" }, { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "internalType": "bytes32", "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "internalType": "uint256", "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "internalType": "bool", "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "bytes1", "name": "challenges", "type": "bytes1" }, { "internalType": "bytes32", "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "internalType": "enum Lottery.BettingResult", "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "internalType": "uint256", "name": "answerBlockNumber", "type": "uint256" }, { "internalType": "address", "name": "bettor", "type": "address" }, { "internalType": "bytes1", "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function" } ];
class App extends Component {

  // 생성자 부분이다.
  constructor(props){ 
    super(props);

    
    this.state = {
      betRecords: [], // 배팅한 기록 저장소
      winRecords : [], // 승리한 기록 저장소
      failRecords : [], // 패배한 기록 저장소
      pot : '0', // 팟 머니 금액 기록 저장소
      challenges: ['A','B'], // 사용자가 배팅한 문자열 기록 저장소
      finalRecords: [{ // 3가지의 저장소 기록들을 모아둔 최종 저장 기록소
        bettor:'0xabcd...', // 배팅한 주소
        index:'0',  
        challenges:'ab', // 배팅한 문자
        answer:'ab', // 정답 블록 해쉬
        targetBlockNumber:'10', //어떤 블록숫자의 배팅했는지
        pot:'0' // 팟 머니
      }]
    }
  }

  async componentDidMount() { // 앱이 구동되면 제일 먼저 실행되는 공간이다.
    
      await this.initWeb3(); // initWeb3(); 함수를 실행
      
     setInterval(this.pollData , 1000); // 1초에 한번씩 수행하는 문장
      
  }
  pollData = async () =>{ // 이벤트들을 모아둔 함수
    await this.getPot();
    await this.getBetEvents();
    await this.getWinEvents();
    await this.getFailEvents();
    await this.makeFinalRecords();
  }
  initWeb3 = async () => { // 메타마스크와 연동 부분 솔직히 이 부분 증말 모르겠어요..
    if (window.ethereum) {
      console.log('Recent mode')
      this.web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          // this.web3.eth.sendTransaction({/* ... */});
      } catch (error) {
          // User denied account access...
          console.log(`User denied account access error : ${error}`)
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('legacy mode')
      this.web3 = new Web3(Web3.currentProvider);
      // Acccounts always exposed
      // web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    let accounts = await this.web3.eth.getAccounts(); // web3기본 내장 함수인 현재 접속자의 getAccounts() 현재 주소를 가져오는 부분이다.
    this.account = accounts[0]; // 현재 접속자의 맨 상위의 있는 메타마스크와 연결!
    // console.log(this.account);
    this.lotteryContract = new this.web3.eth.Contract(lotteryABI,lotteryaddress); // 꼭 대문자!!!! 스마트 컨트랙 생성하는 부분이다.
    
    // let pot = await this.lotteryContract.methods.getPot().call(); // call : 스마트컨트랙의 상태를 바꾸지 않는 트랙잭션을 발생하지 않은 애들은 call로 호출해야 한다.
    // console.log(pot);

    // let owner = await this.lotteryContract.methods.owner().call();
    // console.log(owner);

    
  }
  makeFinalRecords = () =>{ // 최종 테이블의 표현될 정보들 표현
    let f = 0, w = 0;
    const records = [...this.state.betRecords]; // records에 있는 Bet이벤트 전부를 복사한 내용이다.(깊은 복사)
    for(let i=0;i<this.state.betRecords.length;i+=1) { // 이 반복문은 배팅 한 인덱스 만큼 도는 반복문이다.

      if(this.state.winRecords.length > 0 && this.state.betRecords[i].index === this.state.winRecords[w].index){
        records[i].win = 'WIN'
        records[i].answer = records[i].challenges;
        records[i].pot = this.web3.utils.fromWei(this.state.winRecords[w].amount, 'ether'); // 숫자를 이더 형식으로 바꿔서 표현해줬다! 
        if(this.state.winRecords.length - 1 > w){
          //  만약 winRecords가 하나만 있다면 다음 winRecords는 가져올 것이 없기 때문에
          // -1을 해 winRecords가 2개 이상일 때만 w 값을 증가시켜 더 뽑는다.
          w++;
        }
        
      } else if(this.state.failRecords.length > 0 && this.state.betRecords[i].index === this.state.failRecords[f].index){
          
        records[i].win = 'FAIL'
        records[i].answer = this.state.failRecords[f].answer;
        records[i].pot = 0;
        if(this.state.failRecords.length - 1 > f){
          f++;
        }
  
      } else {
        records[i].answer = 'Not Revealed';
      }
    }
    this.setState({finalRecords:records});
  }
  getPot = async () =>{ // 현재 저장된 팟 머니의 금액을 가져오는 함수
    let pot = await this.lotteryContract.methods.getPot().call(); // 아까 생성한 스마트컨트랙을 이용해 팟 머니를 가져왔다.
    let potString = this.web3.utils.fromWei(pot.toString(),"ether"); // 그냥 뽑을 시 오류가 나기 때문에 ether의 단위로 변환 해서 넣어줬다.
    this.setState({pot:potString});  // constructor 안에서 state값을 바꾸는 것은 가능 하지만 생성된 후 state값을 바꾸는 방법은 setState를 사용한다.
  }
  getBetEvents = async () =>{
    const records = [];
    let event = await this.lotteryContract.getPastEvents('BET',{fromBlock:0,toBlock:'latest'});
    // console.log(event);
    for(let i=0; i<event.length; i++){
      const record = {}
      record.index = parseInt(event[i].returnValues.index, 10).toString();
      record.bettor = event[i].returnValues.bettor.slice(0,4) + '...' + event[i].returnValues.bettor.slice(40,42);
      record.betBlockNumber = event[i].blockNumber;
      record.targetBlockNumber = event[i].returnValues.answerBlockNumber.toString();
      record.challenges = event[i].returnValues.challenges;
      record.win = 'Not Revealed';
      record.answer = '0x00';
      records.unshift(record);
    }
    // console.log(records);
    this.setState({betRecords : records});
  }

  getWinEvents = async () =>{
    const records = [];
    // 현재 우리가 만든 스마트컨트랙에 있는 이벤트를 가져올려면 getPastEvents()함수를 사용해줘야 한다!!
    let event = await this.lotteryContract.getPastEvents('WIN',{fromBlock:0,toBlock:'latest'}); 
    // console.log(event);
    for(let i=0; i<event.length; i++){
      const record = {}
      record.index = parseInt(event[i].returnValues.index, 10).toString(); // parseInt 에 10은 string의 진수를 나타내는 2부터 36까지의 정수입니다
      record.amount = parseInt(event[i].returnValues.amount, 10).toString();
      records.unshift(record); // 쉽게 얘기하면 unshift는 정리를 반대로 즉 오름차순을 내림차순으로 정렬 한 것이랑 똑같다.
    }
    // console.log(records);
    this.setState({winRecords : records});
  }

  getFailEvents = async () =>{
    const records = [];
    let event = await this.lotteryContract.getPastEvents('FAIL',{fromBlock:0,toBlock:'latest'});
    // console.log(event);
    for(let i=0; i<event.length; i++){
      const record = {}
      record.index = parseInt(event[i].returnValues.index, 10).toString();
      record.answer = event[i].returnValues.answer;
      records.unshift(record);
    }
    console.log(records);
    this.setState({failRecords : records});
  }


  bet = async () =>{ // 배팅 함수
    // 사용자가 배팅한 문자열을 가져와 저장
    let challenges = '0x'+this.state.challenges[0].toLowerCase() + this.state.challenges[1].toLowerCase();
    let nonce = await this.web3.eth.getTransactionCount(this.account);
    // 실직적인 메타 마스크를 이용한 이더 송금 방식이다.
    this.lotteryContract.methods.betAndDistribute(challenges).send({from:this.account,value:5000000000000000,gas:500000,nonce:nonce}).on('transactionHash',(hash) => {
      console.log(hash);
    }); // 상태를 바꾸는 함수이기 때문에 call 이 아닌 send를 이용하였다.
  }
  // 팟 머니가 얼마인지 확인

  // 배팅하는 글자 선택 UI(버튼)
  onClickCard = (_character)  => {
    this.setState({
      challenges : [this.state.challenges[1], _character]
    })
  }
  // 배팅

  // History Table
  // index address challenge answer pot status answerBlockNumber
  getCard = (_character, _cardStyle) =>{
    let card = "";
    if(_character === 'A'){
      card = "🃦";
    }
    if(_character === 'B'){
      card = "🃧";
    }
    if(_character === 'C'){
      card = "🃨";
    }
    if(_character === '0'){
      card = "🃩";
    }
    return(
      <button className={_cardStyle} onClick={() => {
        this.onClickCard(_character);
      }}>
        <div className='card-body text-center'>
          <p className='card-text'></p>
          <p className='card-text text-center' style={{fontSize : 300 , textAlign:'center'}}>{card}</p>
          <p className='card-text'></p>
        </div>
      </button>
    )
  }
  render() {
    return (
      <div className="App">
        
        <div className="container" id='center'>
          <div className="jumbotron">
          <h1>Current Pot : {this.state.pot}</h1>
            <h3>Lottery</h3>
            <p>Lottery 연습</p>
            <p>Your Bet</p>
            <p>{this.state.challenges[0]} {this.state.challenges[1]}</p>
          </div>
        </div>
        <div className='container'>
          <div className='card-group'>
            {this.getCard('A','card bg-primary')}
            {this.getCard('B','card bg-warning')}
            {this.getCard('C','card bg-danger')}
            {this.getCard('0','card bg-success')}
          </div>
        </div>
        <br/>
        <div className='container'>
          <button className='btn-danger btn-lg' onClick={this.bet}>배팅🔥</button>
        </div>
        <br/>
        <div className='container'>
          <table className='table table-dark table-striped'>
            <thead>
              <tr>
                <th>배팅횟수</th>
                <th>사용자</th>
                <th>배팅문자</th>
                <th>정답</th>
                <th>금액</th>
                <th>상태</th>
                <th>블록숫자</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.finalRecords.map((record, index) => {
                  return (
                    <tr key={index}>
                      <td>{record.index}</td>
                      <td>{record.bettor}</td>
                      <td>{record.challenges}</td>
                      <td>{record.answer}</td>
                      <td>{record.pot}</td>
                      <td>{record.win}</td>
                      <td>{record.targetBlockNumber}</td>
                      
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
// index address challenge answer pot status answerBlockNumber
export default App;