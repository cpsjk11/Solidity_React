# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### 'Create React app'
리액트를 먼저 깔아주자!

### create-react-app '원하는폴더명'-react-web
리액트 앱을 생성해준다!

### `npm start`
시작할려면 해당 폴더에 들어가 해야한당

### web3을 사용할려면 npm install web3
꼭 저렇게 해줘야 한다 잘 못 했다가 진짜 어질어질 했어요...

### 리액트에서 메타마스크 연동은?!?!
https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8 여기로 이동해주세요 ㅎㅎ

👇👇 아니면 여기 올려둘께요<br/>
window.addEventListener('load', async () => {<br/>
    // Modern dapp browsers...<br/>
    if (window.ethereum) {<br/>
        window.web3 = new Web3(ethereum);<br/>
        try {<br/>
            // Request account access if needed<br/>
            await ethereum.enable();<br/>
            // Acccounts now exposed<br/>
            web3.eth.sendTransaction({/* ... */});<br/>
        } catch (error) {<br/>
            // User denied account access...<br/>
        }<br/>
    }<br/>
    // Legacy dapp browsers...<br/>
    else if (window.web3) {<br/>
        window.web3 = new Web3(web3.currentProvider);<br/>
        // Acccounts always exposed<br/>
        web3.eth.sendTransaction({/* ... */});<br/>
    }<br/>
    // Non-dapp browsers...<br/>
    else {<br/>
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');<br/>
    }<br/>
});<br/>

### 스마트컨트랙 생성하여 함수 호출하기🔥🔥
let address = "배포한 스마트 컨트랙주소!";<br/>
let ABI = "배포한 스마트컨트랙의 ABI json형식의 문자열";<br/>
this.myContract = new this.web3.eth.Contract(address,ABI); 이게 생성🔥🔥<br/>

### 스마트컨트랙 함수 사용해보기
await this.myContract.methods.'함수이름'.call();<br/>
await this.myContract.methods.'함수이름'.send();<br/>
call : 스마트컨트랙의 상태를 바꾸지 않는 트랙잭션을 발생하지 않은 애들은 call로 호출해야 한다.<br/>
send : 상태를 바꾸는 함수이기 때문에 call 이 아닌 send를 이용하였다.


