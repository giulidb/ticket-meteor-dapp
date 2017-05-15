import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NumericInput from 'react-numeric-input';

// Ethereum libraries and contracts
import web3, { selectContractInstance, mapReponseToJSON } from '../api/ethereum/web3.js';
import event_artifacts from '../api/ethereum/truffle/build/contracts/Event.json'

// Contract component - represents a single todo item
export default class Ticket extends Component {

    constructor(){
        super();

        this.state = {
            total_price: "",
            value : "1",
            account: web3.eth.accounts[1],
            gasPrice: 100000000000,
            gas: 2500000,
            ticket_left: "",
            MyTickets: "",
            used: ""
        }
  }


    async componentWillMount() {
            this.getMyTickets();
            this.setState({total_price: web3.fromWei(this.props.item.TicketPrices.valueOf(),'ether')});
            this.setState({ticket_left: this.props.item.ticketsLeft.valueOf()});
    }
        

    async getMyTickets(){
            this.TicketsList = await selectContractInstance(event_artifacts);
            const MyTicketItems = await this.TicketsList.getTicket.call(this.state.account,this.props.index);
            console.log(MyTicketItems);
            this.setState( {MyTickets: MyTicketItems[0].valueOf()} );
            this.setState( {used: MyTicketItems[1]});
    }  

    async compute_price(){
            this.setState({value: this.refs.numInput.state.value});
            this.TicketsList = await selectContractInstance(event_artifacts);
            const price = await this.getPrice();
            this.setState( {total_price: web3.fromWei(price.valueOf(),'ether')} );
    }  

    async getPrice(){
            const num = this.refs.numInput.state.value;
            const PriceResp = await this.TicketsList.compute_price.call(this.props.index,num);
            return PriceResp;
    }

    async refreshValue(){
           const TicketsList = await selectContractInstance(event_artifacts);
           const TicketLeft = await TicketsList.getLeftTickets.call(this.props.index);
           console.log("ticketleft:");
           console.log(TicketLeft);
           this.setState({ticket_left: TicketLeft.valueOf()});  
    }

    async buy(){
            const TicketsList = await selectContractInstance(event_artifacts);
            const res = await TicketsList.buyTicket(this.props.index,this.state.value,
                                                    {from: this.state.account, gasPrice: this.state.gasPrice,
                                                     gas: this.state.gas, value: web3.toWei(this.state.total_price,'ether')});
            console.log(res);
            Bert.alert('Congratulations! Your transaction has been successful!','success','fixed-top','fa-smile-o');
            this.getMyTickets();
            this.refreshValue();
            ;
    }

    async use(){

            const TicketsList = await selectContractInstance(event_artifacts);
            await TicketsList.useTicket(this.props.index,{from: this.state.account, gasPrice: this.state.gasPrice,
                                                     gas: this.state.gas});
            Bert.alert('Congratulations! Your transaction has been successful!','success','fixed-top','fa-smile-o');
            this.getMyTickets();
           


    }

    renderMyTickets(){
            var own = this.state.MyTickets;

            if(own > 0){
                return (
            
                <div className="col col-3 tablet-col-1 mobile-full">
                        <span className="no-tablet no-mobile">
                                <button onClick={this.use.bind(this)} disabled = {this.state.used}>       
                                    <h3>Use</h3>
                                    Total Own: {own} 
                                </button>
                        </span>
                    </div>
                    );
            }
    }

    render() {

        var price = web3.fromWei(this.props.item.TicketPrices.valueOf(),'ether');

        return (
    
            <li><hr/><div className="row clear">
                <div className="col col-4 tablet-col-11 mobile-col-1-2">
                    <span className="no-tablet no-mobile">
                                    <h3>Description: {this.props.item.description}</h3>
                                    <span>Availability: {this.state.ticket_left} Remaining</span><br/>
                                    <span>Price: {price} ETH / {EthTools.formatBalance(price, '0.0,[0]', 'eur')}€ </span>
                    </span>
                </div>
                <div className="col col-3 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                            <button onClick={this.buy.bind(this)} disabled = {this.state.MyTickets != 0}>
                                <h3>Buy</h3>
                                Total: {this.state.total_price} ETH
                            </button>
                    </span>
                </div>
                <div className="col col-1 tablet-col-1 mobile-full">
                    <span className="no-tablet no-mobile">
                        <NumericInput className='form-control' 
                                    ref = "numInput"
                                    onChange={this.compute_price.bind(this)}
                                    min ={1} max = {4} value ={this.state.value}/>
                    </span>
                </div>
                <div className="col col-1 tablet-col-1 mobile-full">
                    <h1></h1>
                </div>
                
               {this.renderMyTickets()}

             </div>
        </li>
    );

  }

}
