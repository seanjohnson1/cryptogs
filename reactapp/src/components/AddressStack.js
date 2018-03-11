import React, { Component } from 'react';
import Stack from '../components/Stack.js'
import Cryptog from '../components/Cryptog.js'
import Spinner from '../components/Spinner.js'
import StackGrid from 'react-stack-grid'
import Blockies from 'react-blockies'
import MMButton from '../components/MMButton.js'
import PogAnimation from '../components/PogAnimation.js'
let loadInterval

class AddressStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenData:[],
      hovers:[],
      hasLoadedFirst:false
    }
    this.loadTokenData()
    setTimeout(this.loadTokenData.bind(this),701)
    loadInterval = setInterval(this.loadTokenData.bind(this),1577)
  }
  componentWillUnmount(){
    clearInterval(loadInterval)
  }
  async loadTokenData(){
    let tokenData = await this.props.context.contracts['Cryptogs'].methods.tokensOfOwner(this.props.match.params.address).call()
    let tokens = []
    for(let t in tokenData){
      let tokenObject = {id:tokenData[t]}
      let token = await this.props.context.contracts['Cryptogs'].methods.getToken(tokenObject.id).call()
      tokenObject.image = this.props.context.web3.utils.toAscii(token.image).replace(/[^a-zA-Z\d\s.]+/g,"")
      tokens.push(tokenObject)
    }
    this.setState({tokenData:tokens,hasLoadedFirst:true})
  }
  render(){
    let {hasLoadedFirst,tokenData,hovers} = this.state
    if(!tokenData){
      return (
        <div style={{opacity:0.3}}><PogAnimation loader={true} image={"unicorn.png"}/></div>
      )
    }
    if(!hasLoadedFirst){
      return (
        <div style={{opacity:0.3}}><PogAnimation loader={true} image={"unicorn.png"}/></div>
      )
    }

    let cryptogScale = Math.min(0.8, 0.8 * (window.innerWidth/700))
    console.log("cryptogScale",cryptogScale)
    let stackWidth = cryptogScale*115

		let tokenDisplay = tokenData.map((token)=>{
			return (
        <Spinner key={"cryptog"+token.id} guts={
          (spinning)=>{
            return (
              <Cryptog  id={token.id} scale={1} slowrolling={spinning} image={token.image} zIndex={1}/>
            )
          }
        } click={()=>{
          if(token.id>0){
            window.open("/cryptog/"+token.id);
          }
        }}/>
      )
		})

    let callToAction = ""
    let callToBuy = ""
    if(tokenData.length<=0){
      callToAction= (
        <div className={"centercontainer"}>
          <div style={{padding:40,marginBottom:60,opacity:0.3}}>
            <MMButton color={"#6081c3"} onClick={()=>{window.location="/stacks"}}>{"Play 'Togs!"}</MMButton>
          </div>
        </div>
      )
      callToBuy = (
        <div className={"centercontainer"}>
          <div style={{padding:40,marginBottom:60}}>
            <MMButton color={"#6ac360"} onClick={()=>{window.location="/buy"}}>{"Buy 'Togs!"}</MMButton>
          </div>
        </div>
      )
    }else{
      callToAction = (
        <div className={"centercontainer"}>
          <div style={{padding:40,marginBottom:60}}>
            <MMButton color={"#6ac360"} onClick={()=>{window.location="/stacks"}}>{"Play 'Togs!"}</MMButton>
          </div>
        </div>
      )
    }
//transform:"scale("+cryptogScale+"),
    return (
      <div>

        {callToAction}

        <div style={{float:'left',marginTop:-40}}>
          <span style={{verticalAlign:'middle'}}>
          <Blockies
            seed={this.props.match.params.address.toLowerCase()}
            scale={3}
          />
          </span>
          <span style={{fontSize:20,paddingLeft:5}}><a target="_blank" href={this.props.etherscan+"address/"+this.props.match.params.address}>{this.props.match.params.address}</a></span>
        </div>
        <div style={{float:'right',marginTop:-140,opacity:0.4}}>({tokenData.length})</div>

          <StackGrid
            style={{marginTop:20}}
            columnWidth={115}
          >
             {tokenDisplay}
          </StackGrid>

        {callToBuy}
      </div>
    )
  }
}
export default AddressStack;

/*

const JoinStack = ({ match: { params } }) => (
  <div>
    {params.stack}
  </div>
)*/
